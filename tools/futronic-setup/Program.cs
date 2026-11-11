using System.Diagnostics;
using System.IO.Compression;
using System.Net.Http;
using System.Reflection;
using System.Runtime.InteropServices;
using Microsoft.Win32;

const string resourceName = "FutronicSetup.payload.zip";
const string uninstallKey = @"Software\Microsoft\Windows\CurrentVersion\Uninstall\PpaFutronic";
var target = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "PPA", "FutronicAgent");
var shortcutPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Programs), "Futronic Scanner Helper.lnk");

if (args.Any(arg => string.Equals(arg, "/uninstall", StringComparison.OrdinalIgnoreCase)))
{
    Uninstall(target, shortcutPath);
    return;
}

try
{
    StopHelper();
    var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
    if (stream == null)
    {
        Show("This setup file does not contain the Futronic helper. Build it from tools/futronic-setup after publishing the agent.");
        return;
    }
    using (stream)
    {
        Directory.CreateDirectory(target);
        using var zip = new ZipArchive(stream, ZipArchiveMode.Read);
        var root = Path.GetFullPath(target + Path.DirectorySeparatorChar);
        foreach (var entry in zip.Entries)
        {
            if (string.IsNullOrEmpty(entry.Name))
            {
                continue;
            }
            var destination = Path.GetFullPath(Path.Combine(target, entry.FullName));
            if (!destination.StartsWith(root, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }
            var folder = Path.GetDirectoryName(destination);
            if (!string.IsNullOrEmpty(folder))
            {
                Directory.CreateDirectory(folder);
            }
            entry.ExtractToFile(destination, overwrite: true);
        }
    }

    var exePath = Path.Combine(target, "futronic-agent.exe");
    if (!File.Exists(exePath))
    {
        Show("The helper was not copied. Futronic Setup did not finish.");
        return;
    }

    using (var protocol = Registry.CurrentUser.CreateSubKey(@"Software\Classes\ppa-futronic"))
    {
        protocol?.SetValue("", "URL:PPA Futronic Helper");
        protocol?.SetValue("URL Protocol", "");
    }
    using (var command = Registry.CurrentUser.CreateSubKey(@"Software\Classes\ppa-futronic\shell\open\command"))
    {
        command?.SetValue("", "\"" + exePath + "\" \"%1\"");
    }

    var setupCopy = Path.Combine(target, "FutronicSetup.exe");
    var runningFromInstall = string.Equals(Environment.ProcessPath, setupCopy, StringComparison.OrdinalIgnoreCase);
    if (!runningFromInstall && !string.IsNullOrEmpty(Environment.ProcessPath))
    {
        File.Copy(Environment.ProcessPath, setupCopy, overwrite: true);
    }
    RegisterInstalledApp(target, exePath, setupCopy);
    CreateShortcut(shortcutPath, exePath);

    Show("Futronic Scanner Helper is installed for this Windows user.\n\nIt is listed in Settings, Apps, Installed apps. UAMS starts it when you choose Connect Futronic FS64. Allow the browser to open it the first time.");
}
catch (Exception ex)
{
    Show("Futronic Setup could not finish.\n\n" + ex.Message);
}

static void StopHelper()
{
    try
    {
        using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };
        client.PostAsync("http://127.0.0.1:17364/shutdown", new StringContent("")).GetAwaiter().GetResult();
    }
    catch (Exception)
    {
    }

    var deadline = DateTime.UtcNow.AddSeconds(5);
    while (DateTime.UtcNow < deadline)
    {
        var running = Process.GetProcessesByName("futronic-agent");
        if (running.Length == 0)
        {
            return;
        }
        foreach (var process in running)
        {
            try
            {
                process.Kill(entireProcessTree: true);
            }
            catch (Exception)
            {
            }
        }
        Thread.Sleep(300);
    }
}

static void RegisterInstalledApp(string target, string helperPath, string setupPath)
{
    long bytes = 0;
    foreach (var file in Directory.EnumerateFiles(target, "*", SearchOption.AllDirectories))
    {
        try
        {
            bytes += new FileInfo(file).Length;
        }
        catch (IOException)
        {
        }
    }
    using var key = Registry.CurrentUser.CreateSubKey(uninstallKey);
    key?.SetValue("DisplayName", "Futronic Scanner Helper");
    key?.SetValue("DisplayVersion", "1.0.0");
    key?.SetValue("Publisher", "Parole and Probation Administration");
    key?.SetValue("InstallLocation", target);
    key?.SetValue("DisplayIcon", helperPath);
    key?.SetValue("UninstallString", "\"" + setupPath + "\" /uninstall");
    key?.SetValue("NoModify", 1, RegistryValueKind.DWord);
    key?.SetValue("NoRepair", 1, RegistryValueKind.DWord);
    key?.SetValue("EstimatedSize", (int)Math.Min(int.MaxValue, bytes / 1024), RegistryValueKind.DWord);
}

static void CreateShortcut(string shortcutPath, string helperPath)
{
    var shellType = Type.GetTypeFromProgID("WScript.Shell");
    if (shellType == null)
    {
        return;
    }
    dynamic shell = Activator.CreateInstance(shellType)!;
    dynamic shortcut = shell.CreateShortcut(shortcutPath);
    shortcut.TargetPath = helperPath;
    shortcut.WorkingDirectory = Path.GetDirectoryName(helperPath);
    shortcut.Description = "Futronic FS64 helper for UAMS";
    shortcut.Save();
}

static void Uninstall(string target, string shortcutPath)
{
    StopHelper();
    try
    {
        if (File.Exists(shortcutPath))
        {
            File.Delete(shortcutPath);
        }
    }
    catch (Exception)
    {
    }
    try
    {
        Registry.CurrentUser.DeleteSubKeyTree(@"Software\Classes\ppa-futronic", throwOnMissingSubKey: false);
    }
    catch (Exception)
    {
    }
    try
    {
        Registry.CurrentUser.DeleteSubKeyTree(uninstallKey, throwOnMissingSubKey: false);
    }
    catch (Exception)
    {
    }
    var remove = Path.Combine(Path.GetTempPath(), "ppa-futronic-remove.cmd");
    File.WriteAllText(remove, "timeout /t 2 /nobreak >nul\r\nrmdir /s /q \"" + target + "\"\r\ndel \"%~f0\"\r\n");
    Process.Start(new ProcessStartInfo
    {
        FileName = "cmd.exe",
        Arguments = "/c \"" + remove + "\"",
        CreateNoWindow = true,
        UseShellExecute = false
    });
    Show("Futronic Scanner Helper was removed from this Windows user.");
}

static void Show(string message)
{
    MessageBox(IntPtr.Zero, message, "Futronic Setup", 0x00000040);
}

[DllImport("user32.dll", CharSet = CharSet.Unicode)]
static extern int MessageBox(IntPtr owner, string text, string caption, uint type);
