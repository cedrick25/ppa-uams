using System.Runtime.InteropServices;

namespace FutronicAgent;

sealed class FutronicScanner : IDisposable
{
    const int FakeFingerOption = 0x00000001;
    // Futronic FTR_ANSISDK_MATCH_SCORE_MEDIUM (false-accept rate 0.01%).
    const float MatchScoreRequired = 93f;

    IntPtr _scanModule;
    IntPtr _ansiModule;
    IntPtr _device;
    int _imageWidth;
    int _imageHeight;
    int _imageSize;
    int _maxTemplateSize;
    bool _liveFingerDetection;

    OpenDeviceDelegate? _openDevice;
    CloseDeviceDelegate? _closeDevice;
    GetImageSizeDelegate? _getImageSize;
    SetOptionsDelegate? _setOptions;
    GetLastErrorDelegate? _getLastError;
    IsFingerPresentDelegate? _isFingerPresent;
    GetFrameDelegate? _getFrame;
    SetDiodesDelegate? _setDiodes;
    CaptureImageDelegate? _captureImage;
    GetImageDelegate? _getImage;
    GetMaxTemplateSizeDelegate? _getMaxTemplateSize;
    CreateTemplateDelegate? _createTemplate;
    CreateFromBufferDelegate? _createFromBuffer;
    MatchTemplatesDelegate? _matchTemplates;

    public bool SdkLoaded { get; private set; }
    public bool CanMatch => (_createTemplate != null || _createFromBuffer != null) && _matchTemplates != null;
    public string Phase { get; private set; } = "idle";
    public string PhaseMessage { get; private set; } = "Ready.";
    public int CaptureGeneration { get; private set; }
    public bool ScannerOpen => _device != IntPtr.Zero;
    public bool LiveFingerDetection => _liveFingerDetection;
    public string Message { get; private set; } = "Futronic SDK is not loaded.";

    public void Load(string directory)
    {
        CloseDevice();
        SdkLoaded = false;
        _liveFingerDetection = false;
        Message = "Futronic SDK DLLs were not found next to the helper.";

        if (string.IsNullOrWhiteSpace(directory) || !Directory.Exists(directory))
        {
            Message = "The Futronic SDK directory does not exist.";
            return;
        }
        if (!File.Exists(Path.Combine(directory, "ftrScanAPI.dll")))
        {
            Message = "Copy ftrScanAPI.dll from the Futronic FS64 package next to the helper.";
            return;
        }

        SetDllDirectory(directory);
        _scanModule = LoadLibrary(Path.Combine(directory, "ftrScanAPI.dll"));
        _ansiModule = LoadLibrary(Path.Combine(directory, "ftrAnsiSDK.dll"));
        if (_ansiModule == IntPtr.Zero)
        {
            _ansiModule = LoadLibrary(Path.Combine(directory, "ftrAnsiSdk.dll"));
        }

        _openDevice = GetDelegate<OpenDeviceDelegate>(_scanModule, "ftrScanOpenDevice");
        _closeDevice = GetDelegate<CloseDeviceDelegate>(_scanModule, "ftrScanCloseDevice");
        _getImageSize = GetDelegate<GetImageSizeDelegate>(_scanModule, "ftrScanGetImageSize");
        _setOptions = GetDelegate<SetOptionsDelegate>(_scanModule, "ftrScanSetOptions");
        _getLastError = GetDelegate<GetLastErrorDelegate>(_scanModule, "ftrScanGetLastError");
        _isFingerPresent = GetDelegate<IsFingerPresentDelegate>(_scanModule, "ftrScanIsFingerPresent");
        _getFrame = GetDelegate<GetFrameDelegate>(_scanModule, "ftrScanGetFrame");
        _setDiodes = GetDelegate<SetDiodesDelegate>(_scanModule, "ftrScanSetDiodesStatus");
        _captureImage = GetDelegate<CaptureImageDelegate>(_scanModule, "ftrAnsiSdkCaptureImage")
            ?? GetDelegate<CaptureImageDelegate>(_ansiModule, "ftrAnsiSdkCaptureImage");
        _getImage = GetDelegate<GetImageDelegate>(_scanModule, "ftrScanGetImage");
        _getMaxTemplateSize = GetDelegate<GetMaxTemplateSizeDelegate>(_scanModule, "ftrAnsiSdkGetMaxTemplateSize")
            ?? GetDelegate<GetMaxTemplateSizeDelegate>(_ansiModule, "ftrAnsiSdkGetMaxTemplateSize");
        _createTemplate = GetDelegate<CreateTemplateDelegate>(_scanModule, "ftrAnsiSdkCreateTemplate")
            ?? GetDelegate<CreateTemplateDelegate>(_ansiModule, "ftrAnsiSdkCreateTemplate");
        _createFromBuffer = GetDelegate<CreateFromBufferDelegate>(_scanModule, "ftrAnsiSdkCreateTemplateFromBuffer")
            ?? GetDelegate<CreateFromBufferDelegate>(_ansiModule, "ftrAnsiSdkCreateTemplateFromBuffer");
        _matchTemplates = GetDelegate<MatchTemplatesDelegate>(_scanModule, "ftrAnsiSdkMatchTemplates")
            ?? GetDelegate<MatchTemplatesDelegate>(_ansiModule, "ftrAnsiSdkMatchTemplates");

        SdkLoaded = _openDevice != null && _getImageSize != null && (_captureImage != null || _getImage != null);
        if (!SdkLoaded)
        {
            Message = "ftrScanAPI.dll does not export the FS64 scan functions.";
            return;
        }

        Message = "Futronic SDK loaded. The scanner is not open.";
    }

    public bool TryOpen()
    {
        if (!SdkLoaded || _openDevice == null)
        {
            return false;
        }
        if (_device != IntPtr.Zero)
        {
            return true;
        }

        var handle = _openDevice();
        if (handle == IntPtr.Zero)
        {
            Message = "Futronic FS64 is not open. Install the Futronic driver and connect the scanner (" + LastError() + ").";
            return false;
        }

        _device = handle;
        if (!ReadImageSize())
        {
            CloseDevice();
            return false;
        }

        _maxTemplateSize = _getMaxTemplateSize == null ? 0 : _getMaxTemplateSize();
        if (_maxTemplateSize < 16 || _maxTemplateSize > 262144)
        {
            _maxTemplateSize = 65536;
        }

        _liveFingerDetection = false;
        if (_setOptions != null && _setOptions(_device, FakeFingerOption, FakeFingerOption) != 0)
        {
            _liveFingerDetection = true;
        }

        Message = CanMatch
            ? "Futronic FS64 is ready."
            : "Futronic FS64 is connected (" + _imageWidth + "x" + _imageHeight + "). This Futronic package can scan, but it does not include fingerprint matching.";
        return true;
    }

    public byte[] Enroll()
    {
        BeginCapture();
        EnsureReady();
        for (var attempt = 0; attempt < 3; attempt++)
        {
            SetPhase("place", "The scanner light is on. Place one finger flat in the center of the glass and hold still.");
            var first = CreateTemplate(CaptureFinger());
            SetPhase("lift", "Lift your finger off the glass.");
            WaitForLift();
            SetPhase("place-again", "Place the same finger flat in the center of the glass.");
            var second = CreateTemplate(CaptureFinger());
            SetPhase("match", "Checking that both scans are the same finger.");
            if (TemplatesMatch(second, first))
            {
                Array.Clear(first, 0, first.Length);
                SetPhase("done", "Fingerprint read. Saving it.");
                return second;
            }
            Array.Clear(first, 0, first.Length);
            Array.Clear(second, 0, second.Length);
        }
        SetPhase("error", "The two scans did not match. Place the same finger flat in the center and try again.");
        throw new IOException("The two scans did not match. Place the same finger flat in the center of the glass and try again.");
    }

    public bool Verify(byte[] enrolledTemplate)
    {
        BeginCapture();
        EnsureReady();
        if (enrolledTemplate.Length < 32)
        {
            throw new InvalidOperationException("The enrolled fingerprint template is empty.");
        }
        SetPhase("place", "The scanner light is on. Place your enrolled finger flat in the center of the glass.");
        var probe = CreateTemplate(CaptureFinger());
        try
        {
            SetPhase("match", "Checking your fingerprint.");
            var matched = TemplatesMatch(probe, enrolledTemplate);
            SetPhase(
                matched ? "done" : "error",
                matched
                    ? "Fingerprint matched."
                    : "That fingerprint did not match the registered finger.");
            return matched;
        }
        finally
        {
            Array.Clear(probe, 0, probe.Length);
        }
    }

    public void Dispose()
    {
        CloseDevice();
    }

    void EnsureReady()
    {
        if (!TryOpen() || (_captureImage == null && _getImage == null))
        {
            throw new IOException(Message);
        }
        if (!CanMatch)
        {
            throw new IOException(Message);
        }
    }

    bool ReadImageSize()
    {
        if (_getImageSize == null)
        {
            Message = "The Futronic SDK does not export ftrScanGetImageSize.";
            return false;
        }
        var size = new FtrImageSize();
        if (_getImageSize(_device, ref size) == 0)
        {
            Message = "The scanner did not report an image size (" + LastError() + ").";
            return false;
        }
        var bytes = size.ImageSize > 0 ? size.ImageSize : size.Width * size.Height;
        if (size.Width < 1 || size.Height < 1 || bytes < 1000 || bytes > 20000000)
        {
            Message = "The scanner reported an unexpected image size.";
            return false;
        }
        _imageWidth = size.Width;
        _imageHeight = size.Height;
        _imageSize = bytes;
        return true;
    }

    byte[] CaptureFinger()
    {
        SetDiodes(green: true);
        try
        {
            var deadline = DateTime.UtcNow.AddSeconds(45);
            while (DateTime.UtcNow < deadline)
            {
                if (FingerOnGlass())
                {
                    var image = GrabFrame();
                    if (image != null && HasFinger(image))
                    {
                        return image;
                    }
                    if (image != null)
                    {
                        Array.Clear(image, 0, image.Length);
                    }
                }
                Thread.Sleep(150);
            }
        }
        finally
        {
            SetDiodes(green: false);
        }
        SetPhase("error", "No finger was found. Place one finger flat in the center of the glass while the scanner light is on.");
        throw new IOException("No finger was found. Place one finger flat in the center of the glass and hold still.");
    }

    bool FingerOnGlass()
    {
        if (_isFingerPresent == null)
        {
            return true;
        }
        var parameters = Marshal.AllocHGlobal(256);
        try
        {
            for (var i = 0; i < 256; i++)
            {
                Marshal.WriteByte(parameters, i, 0);
            }
            return _isFingerPresent(_device, parameters) != 0;
        }
        finally
        {
            Marshal.FreeHGlobal(parameters);
        }
    }

    void SetDiodes(bool green)
    {
        if (_setDiodes == null || _device == IntPtr.Zero)
        {
            return;
        }
        _setDiodes(_device, green ? (byte)1 : (byte)0, 0);
    }

    byte[]? GrabFrame()
    {
        var buffer = new byte[_imageSize];
        var pin = GCHandle.Alloc(buffer, GCHandleType.Pinned);
        var parameters = Marshal.AllocHGlobal(256);
        try
        {
            for (var i = 0; i < 256; i++)
            {
                Marshal.WriteByte(parameters, i, 0);
            }
            var captured = 0;
            if (_getFrame != null)
            {
                captured = _getFrame(_device, pin.AddrOfPinnedObject(), parameters);
            }
            if (captured == 0 && _getImage != null)
            {
                captured = _getImage(_device, 4, pin.AddrOfPinnedObject());
            }
            if (captured == 0 && _captureImage != null)
            {
                captured = _captureImage(_device, pin.AddrOfPinnedObject());
            }
            return captured == 0 ? null : buffer;
        }
        finally
        {
            pin.Free();
            Marshal.FreeHGlobal(parameters);
        }
    }

    bool HasFinger(byte[] image)
    {
        if (_imageWidth < 1 || _imageHeight < 1)
        {
            return false;
        }
        var background = CornerLevel(image);
        var hits = 0;
        for (var y = 0; y < _imageHeight; y += 4)
        {
            var row = y * _imageWidth;
            for (var x = 0; x < _imageWidth; x += 4)
            {
                if (Math.Abs(image[row + x] - background) > 22)
                {
                    hits++;
                }
            }
        }
        return hits > 1200;
    }

    int CornerLevel(byte[] image)
    {
        long sum = 0;
        var count = 0;
        var edge = 40;
        for (var y = 0; y < edge; y++)
        {
            for (var x = 0; x < edge; x++)
            {
                sum += image[y * _imageWidth + x];
                sum += image[y * _imageWidth + (_imageWidth - 1 - x)];
                sum += image[(_imageHeight - 1 - y) * _imageWidth + x];
                sum += image[(_imageHeight - 1 - y) * _imageWidth + (_imageWidth - 1 - x)];
                count += 4;
            }
        }
        return count == 0 ? 0 : (int)(sum / count);
    }

    byte[] CreateTemplate(byte[] image)
    {
        byte[]? window = null;
        try
        {
            var direct = TryTemplate(image, _imageWidth, _imageHeight);
            if (direct != null)
            {
                return direct;
            }
            window = FingerWindow(image);
            var cropped = window == null ? null : TryTemplate(window, 320, 480);
            if (cropped != null)
            {
                return cropped;
            }
            SetPhase("error", "The scanner could not read a fingerprint. Place one finger flat in the center of the glass and hold still.");
            throw new IOException("The scanner could not read a fingerprint. Place one finger flat in the center of the glass and hold still.");
        }
        finally
        {
            Array.Clear(image, 0, image.Length);
            if (window != null)
            {
                Array.Clear(window, 0, window.Length);
            }
        }
    }

    byte[]? TryTemplate(byte[] image, int width, int height)
    {
        var imagePin = GCHandle.Alloc(image, GCHandleType.Pinned);
        var template = new byte[_maxTemplateSize];
        var templatePin = GCHandle.Alloc(template, GCHandleType.Pinned);
        try
        {
            var templateSize = template.Length;
            var created = 0;
            if (_createFromBuffer != null)
            {
                created = _createFromBuffer(_device, 0, imagePin.AddrOfPinnedObject(), width, height, templatePin.AddrOfPinnedObject(), ref templateSize);
            }
            if (created == 0 && _createTemplate != null && width == _imageWidth && height == _imageHeight)
            {
                templateSize = template.Length;
                created = _createTemplate(_device, 0, imagePin.AddrOfPinnedObject(), templatePin.AddrOfPinnedObject(), ref templateSize);
            }
            if (created == 0 || templateSize < 32 || templateSize > template.Length)
            {
                return null;
            }
            var trimmed = new byte[templateSize];
            Buffer.BlockCopy(template, 0, trimmed, 0, templateSize);
            return trimmed;
        }
        finally
        {
            imagePin.Free();
            templatePin.Free();
            Array.Clear(template, 0, template.Length);
        }
    }

    byte[]? FingerWindow(byte[] image)
    {
        const int outWidth = 320;
        const int outHeight = 480;
        if (_imageWidth < outWidth || _imageHeight < outHeight)
        {
            return null;
        }
        var background = CornerLevel(image);
        var minX = _imageWidth;
        var minY = _imageHeight;
        var maxX = 0;
        var maxY = 0;
        var hits = 0;
        for (var y = 0; y < _imageHeight; y += 2)
        {
            var row = y * _imageWidth;
            for (var x = 0; x < _imageWidth; x += 2)
            {
                if (Math.Abs(image[row + x] - background) <= 22)
                {
                    continue;
                }
                hits++;
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }
        }
        if (hits < 400)
        {
            return null;
        }
        var centerX = Math.Min(_imageWidth - outWidth, Math.Max(0, (minX + maxX) / 2 - outWidth / 2));
        var centerY = Math.Min(_imageHeight - outHeight, Math.Max(0, (minY + maxY) / 2 - outHeight / 2));
        var window = new byte[outWidth * outHeight];
        for (var y = 0; y < outHeight; y++)
        {
            Buffer.BlockCopy(image, ((centerY + y) * _imageWidth) + centerX, window, y * outWidth, outWidth);
        }
        return window;
    }

    bool TemplatesMatch(byte[] probe, byte[] gallery)
    {
        var probePin = GCHandle.Alloc(probe, GCHandleType.Pinned);
        var galleryPin = GCHandle.Alloc(gallery, GCHandleType.Pinned);
        try
        {
            float score = 0;
            var compared = _matchTemplates!(probePin.AddrOfPinnedObject(), galleryPin.AddrOfPinnedObject(), ref score) != 0;
            return compared && score > MatchScoreRequired;
        }
        finally
        {
            probePin.Free();
            galleryPin.Free();
        }
    }

    void WaitForLift()
    {
        if (_isFingerPresent == null)
        {
            Thread.Sleep(2000);
            return;
        }
        var frame = Marshal.AllocHGlobal(512);
        try
        {
            for (var i = 0; i < 512; i++)
            {
                Marshal.WriteByte(frame, i, 0);
            }
            var lifted = false;
            for (var i = 0; i < 100; i++)
            {
                if (_isFingerPresent(_device, frame) == 0)
                {
                    lifted = true;
                    break;
                }
                Thread.Sleep(200);
            }
            if (lifted)
            {
                Thread.Sleep(400);
            }
        }
        finally
        {
            Marshal.FreeHGlobal(frame);
        }
    }

    public void BeginCapture()
    {
        CaptureGeneration++;
        SetPhase("idle", "Starting the scanner. Keep your finger off the glass.");
    }

    void SetPhase(string phase, string message)
    {
        Phase = phase;
        PhaseMessage = message;
    }

    int LastError()
    {
        return _getLastError == null ? 0 : _getLastError();
    }

    void CloseDevice()
    {
        if (_device != IntPtr.Zero && _closeDevice != null)
        {
            _closeDevice(_device);
        }
        _device = IntPtr.Zero;
        _liveFingerDetection = false;
    }

    static T? GetDelegate<T>(IntPtr module, string name) where T : Delegate
    {
        if (module == IntPtr.Zero)
        {
            return null;
        }
        var address = GetProcAddress(module, name);
        if (address == IntPtr.Zero)
        {
            return null;
        }
        return Marshal.GetDelegateForFunctionPointer<T>(address);
    }

    [DllImport("kernel32", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern IntPtr LoadLibrary(string path);

    [DllImport("kernel32", CharSet = CharSet.Ansi, SetLastError = true)]
    static extern IntPtr GetProcAddress(IntPtr module, string name);

    [DllImport("kernel32", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool SetDllDirectory(string path);

    [StructLayout(LayoutKind.Sequential)]
    struct FtrImageSize
    {
        public int Width;
        public int Height;
        public int ImageSize;
    }

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate IntPtr OpenDeviceDelegate();

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate void CloseDeviceDelegate(IntPtr device);

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int GetImageSizeDelegate(IntPtr device, ref FtrImageSize size);

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int SetOptionsDelegate(IntPtr device, int mask, int flags);

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int GetLastErrorDelegate();

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int IsFingerPresentDelegate(IntPtr device, IntPtr frameParameters);

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int GetFrameDelegate(IntPtr device, IntPtr buffer, IntPtr frameParameters);

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int SetDiodesDelegate(IntPtr device, byte green, byte red);

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int CaptureImageDelegate(IntPtr device, IntPtr buffer);

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int GetImageDelegate(IntPtr device, int dose, IntPtr buffer);

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int GetMaxTemplateSizeDelegate();

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int CreateTemplateDelegate(IntPtr device, byte finger, IntPtr image, IntPtr template, ref int templateSize);

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int CreateFromBufferDelegate(IntPtr device, byte finger, IntPtr image, int width, int height, IntPtr template, ref int templateSize);

    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    delegate int MatchTemplatesDelegate(IntPtr left, IntPtr right, ref float score);
}
