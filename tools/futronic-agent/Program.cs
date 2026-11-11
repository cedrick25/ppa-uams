using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

const string instanceName = "Local\\PpaFutronicAgent";
using var instanceLock = new Mutex(false, instanceName);
var ownsInstance = false;
try
{
    ownsInstance = instanceLock.WaitOne(TimeSpan.Zero);
}
catch (AbandonedMutexException)
{
    ownsInstance = true;
}
if (!ownsInstance)
{
    return;
}

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory
});
builder.Logging.ClearProviders();
builder.WebHost.UseUrls("http://127.0.0.1:17364");

var app = builder.Build();
var secret = app.Configuration["HmacSecret"] ?? "";
var sdkDirectory = ResolveSdkDirectory(app.Configuration["SdkDirectory"]);

var webJson = new JsonSerializerOptions(JsonSerializerDefaults.Web);
var scanner = new FutronicAgent.FutronicScanner();
scanner.Load(sdkDirectory);
var gate = new SemaphoreSlim(1, 1);
var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
var lastActivityTicks = DateTime.UtcNow.Ticks;
var stopping = 0;

void Touch()
{
    Interlocked.Exchange(ref lastActivityTicks, DateTime.UtcNow.Ticks);
}

bool ScanInProgress()
{
    var phase = scanner.Phase;
    return phase is "place" or "lift" or "place-again" or "match";
}

void RequestStop()
{
    if (Interlocked.Exchange(ref stopping, 1) == 0)
    {
        lifetime.StopApplication();
    }
}

app.Use(async (context, next) =>
{
    Touch();
    var origin = context.Request.Headers.Origin.ToString();
    if (origin.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || origin.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
    {
        context.Response.Headers["Access-Control-Allow-Origin"] = origin;
        context.Response.Headers["Vary"] = "Origin";
    }
    context.Response.Headers["Access-Control-Allow-Private-Network"] = "true";
    context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type";
    if (HttpMethods.IsOptions(context.Request.Method))
    {
        context.Response.StatusCode = StatusCodes.Status204NoContent;
        return;
    }
    await next();
});

app.MapGet("/status", () => Results.Json(new { phase = scanner.Phase, message = scanner.PhaseMessage, capture = scanner.CaptureGeneration }, webJson));

app.MapGet("/health", () =>
{
    var hmacConfigured = IsSecretConfigured(secret);
    var scannerOpen = false;
    if (!gate.Wait(TimeSpan.FromSeconds(2)))
    {
        return Results.Json(Health(false, scanner.SdkLoaded, false, hmacConfigured, "The scanner is busy with another fingerprint."), webJson);
    }
    try
    {
        scannerOpen = scanner.SdkLoaded && scanner.TryOpen();
    }
    finally
    {
        gate.Release();
    }

    var usable = scannerOpen && scanner.CanMatch;
    var message = scanner.Message;
    if (!hmacConfigured)
    {
        message = "Set HmacSecret in the Futronic helper to the same value as the API.";
    }
    else if (usable)
    {
        message = "Futronic FS64 is ready.";
    }
    return Results.Json(new
    {
        ok = usable && hmacConfigured,
        sdkLoaded = scanner.SdkLoaded,
        scannerOpen = usable,
        hmacConfigured,
        liveFingerDetection = scanner.LiveFingerDetection,
        message
    }, webJson);
});

app.MapPost("/enroll", async (HttpContext context) =>
{
    if (!IsSecretConfigured(secret))
    {
        return Results.Json(new { message = "Set HmacSecret in the Futronic helper to the same value as the API." }, webJson, statusCode: StatusCodes.Status503ServiceUnavailable);
    }
    ChallengeRequest? request;
    try
    {
        request = await context.Request.ReadFromJsonAsync<ChallengeRequest>(webJson);
    }
    catch (JsonException)
    {
        return Results.Json(new { message = "The enrollment challenge is missing." }, webJson, statusCode: StatusCodes.Status400BadRequest);
    }
    if (!IsChallenge(request?.Challenge))
    {
        return Results.Json(new { message = "The enrollment challenge is missing." }, webJson, statusCode: StatusCodes.Status400BadRequest);
    }

    await gate.WaitAsync(context.RequestAborted);
    try
    {
        var template = scanner.Enroll();
        var mac = Sign(secret, request!.Challenge!, "enroll", null, template);
        return Results.Json(new { template = Convert.ToBase64String(template), mac, finger = 0 }, webJson);
    }
    catch (Exception ex) when (ex is IOException or InvalidOperationException)
    {
        return Results.Json(new { message = ex.Message }, webJson, statusCode: StatusCodes.Status422UnprocessableEntity);
    }
    finally
    {
        gate.Release();
    }
});

app.MapPost("/verify", async (HttpContext context) =>
{
    if (!IsSecretConfigured(secret))
    {
        return Results.Json(new { message = "Set HmacSecret in the Futronic helper to the same value as the API." }, webJson, statusCode: StatusCodes.Status503ServiceUnavailable);
    }
    VerifyRequest? request;
    try
    {
        request = await context.Request.ReadFromJsonAsync<VerifyRequest>(webJson);
    }
    catch (JsonException)
    {
        return Results.Json(new { message = "The sign-in challenge is missing." }, webJson, statusCode: StatusCodes.Status400BadRequest);
    }
    if (!IsChallenge(request?.Challenge))
    {
        return Results.Json(new { message = "The sign-in challenge is missing." }, webJson, statusCode: StatusCodes.Status400BadRequest);
    }
    byte[] enrolled;
    try
    {
        enrolled = string.IsNullOrWhiteSpace(request?.Template) ? Array.Empty<byte>() : Convert.FromBase64String(request.Template);
    }
    catch (FormatException)
    {
        return Results.Json(new { message = "The enrolled fingerprint could not be read." }, webJson, statusCode: StatusCodes.Status400BadRequest);
    }
    if (enrolled.Length < 32 || enrolled.Length > 65536)
    {
        return Results.Json(new { message = "The enrolled fingerprint could not be read." }, webJson, statusCode: StatusCodes.Status400BadRequest);
    }

    await gate.WaitAsync(context.RequestAborted);
    try
    {
        var match = scanner.Verify(enrolled);
        var mac = Sign(secret, request!.Challenge!, "login", match, enrolled);
        return Results.Json(new { match, mac }, webJson);
    }
    catch (Exception ex) when (ex is IOException or InvalidOperationException)
    {
        return Results.Json(new { message = ex.Message }, webJson, statusCode: StatusCodes.Status422UnprocessableEntity);
    }
    finally
    {
        Array.Clear(enrolled, 0, enrolled.Length);
        gate.Release();
    }
});

app.MapPost("/shutdown", () =>
{
    if (ScanInProgress() || !gate.Wait(TimeSpan.Zero))
    {
        return Results.Json(new { ok = false, message = "A fingerprint scan is still in progress." }, webJson, statusCode: StatusCodes.Status409Conflict);
    }
    gate.Release();
    RequestStop();
    return Results.Json(new { ok = true }, webJson);
});

using var idleTimer = new Timer(_ =>
{
    if (Volatile.Read(ref stopping) == 1 || ScanInProgress())
    {
        return;
    }
    var lastActivity = new DateTime(Interlocked.Read(ref lastActivityTicks), DateTimeKind.Utc);
    if (DateTime.UtcNow - lastActivity < TimeSpan.FromSeconds(90))
    {
        return;
    }
    if (!gate.Wait(TimeSpan.Zero))
    {
        return;
    }
    gate.Release();
    RequestStop();
}, null, TimeSpan.FromSeconds(15), TimeSpan.FromSeconds(15));

try
{
    app.Run();
}
finally
{
    instanceLock.ReleaseMutex();
}

static string ResolveSdkDirectory(string? configured)
{
    if (!string.IsNullOrWhiteSpace(configured))
    {
        return configured;
    }
    var candidates = new[] { AppContext.BaseDirectory, Directory.GetCurrentDirectory() };
    foreach (var candidate in candidates)
    {
        if (File.Exists(Path.Combine(candidate, "ftrScanAPI.dll")))
        {
            return candidate;
        }
    }
    return AppContext.BaseDirectory;
}

static bool IsSecretConfigured(string value)
{
    return !string.IsNullOrWhiteSpace(value) && value.Trim().Length >= 16;
}

static bool IsChallenge(string? value)
{
    if (string.IsNullOrWhiteSpace(value) || value.Length < 32 || value.Length > 128)
    {
        return false;
    }
    foreach (var character in value)
    {
        var hex = (character >= '0' && character <= '9') || (character >= 'a' && character <= 'f') || (character >= 'A' && character <= 'F');
        if (!hex)
        {
            return false;
        }
    }
    return true;
}

static string Sign(string secret, string challenge, string purpose, bool? match, byte[] template)
{
    var hash = Convert.ToHexString(SHA256.HashData(template)).ToLowerInvariant();
    var payload = purpose == "enroll"
        ? challenge + "|enroll|" + hash
        : challenge + "|login|" + (match == true ? "1" : "0") + "|" + hash;
    using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
    return Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(payload))).ToLowerInvariant();
}

static object Health(bool ok, bool sdkLoaded, bool scannerOpen, bool hmacConfigured, string message)
{
    return new
    {
        ok,
        sdkLoaded,
        scannerOpen,
        hmacConfigured,
        liveFingerDetection = false,
        message
    };
}

record ChallengeRequest(string? Challenge);
record VerifyRequest(string? Challenge, string? Template);
