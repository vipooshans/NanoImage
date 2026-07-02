# 🖼️ NanoImage — Advanced Image Optimizer

A production-ready React Native mobile app for compressing, resizing, converting, and batch processing images with a stunning dark glassmorphic UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Compress** | Reduce image file size with an adjustable quality slider (1–100) |
| **Resize** | Custom width × height with aspect-ratio lock and dimension presets |
| **Convert** | Convert between JPEG, PNG, and WebP formats |
| **Batch** | Queue up to 20 images, compress with real-time per-item progress |
| **Before/After** | Visual comparison with file size stats and reduction percentage |
| **Save to Gallery** | Export optimized images to device's Pictures/NanoImage folder |

---

## 🎨 Design

- **Dark futuristic theme** — deep navy backgrounds with neon cyan/purple/green/orange accents
- **Glassmorphism cards** — frosted semi-transparent panels with glow borders
- **Smooth animations** — spring animations on card press, animated progress bars
- **Color-coded feedback** — green (>60% reduction), cyan (30–60%), orange (10–30%), red (<10%)

---

## 🗂️ Project Structure

```
NanoImage/
├── src/
│   ├── components/
│   │   ├── GlassCard.jsx        # Glassmorphism card container
│   │   ├── Header.jsx           # Shared screen header with back button
│   │   ├── ActionButton.jsx     # Gradient CTA button
│   │   ├── QualitySlider.jsx    # Custom touch-driven slider
│   │   ├── ProgressBar.jsx      # Animated neon progress bar
│   │   ├── StatBadge.jsx        # Before/After stat pill
│   │   └── ImagePreview.jsx     # Image thumbnail with size overlay
│   ├── screens/
│   │   ├── HomeScreen.jsx       # Feature dashboard with 2×2 card grid
│   │   ├── CompressScreen.jsx   # Quality slider + single image compression
│   │   ├── ResizeScreen.jsx     # Dimension inputs + aspect lock + presets
│   │   ├── ConvertScreen.jsx    # Format flow diagram + selector
│   │   ├── BatchScreen.jsx      # Multi-image queue + batch processing
│   │   └── ResultScreen.jsx     # Before/After comparison + save/share
│   ├── services/
│   │   ├── compressionService.js   # react-native-compressor wrapper
│   │   ├── resizeService.js        # react-native-image-resizer wrapper
│   │   ├── convertService.js       # Format conversion logic
│   │   ├── batchService.js         # Sequential batch processor
│   │   └── fileService.js          # RNFS file ops, gallery save, cache clean
│   ├── navigation/
│   │   └── AppNavigator.jsx        # Stack navigator setup
│   ├── theme/
│   │   └── theme.js                # Design tokens (colors, typography, spacing)
│   └── utils/
│       ├── formatSize.js           # Bytes → KB/MB, reduction calculations
│       └── permissionsHelper.js    # Android/iOS storage permission helper
├── App.jsx                         # Root component
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Java JDK** 17 (for Android)
- **Android Studio** with Android SDK and an emulator (or physical device)
- **React Native environment** set up: https://reactnative.dev/docs/environment-setup

### 1. Install Dependencies

```bash
cd NanoImage
npm install --legacy-peer-deps
```

### 2. Android Setup

Make sure an emulator is running or a device is connected via USB.

```bash
# Start Metro bundler
npm start

# In a new terminal — build and run on Android
npm run android
```

### 3. iOS Setup (macOS only)

```bash
cd ios && pod install && cd ..
npm run ios
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react-native` | 0.86.0 | Core framework |
| `@react-navigation/native` | ^7 | Navigation |
| `react-native-image-picker` | ^7 | Gallery image selection |
| `react-native-compressor` | ^1.9 | Image compression |
| `react-native-image-resizer` | ^3 | Resize & format conversion |
| `react-native-fs` | ^2.20 | File system, save to gallery |
| `react-native-linear-gradient` | ^2.8 | Gradient UI backgrounds |
| `react-native-gesture-handler` | ^2.20 | Touch gesture foundation |
| `react-native-reanimated` | ^3 | Smooth animations |

---

## 🔐 Android Permissions

Added automatically in `AndroidManifest.xml`:
- `READ_MEDIA_IMAGES` (Android 13+)
- `READ_EXTERNAL_STORAGE` (Android < 13)
- `WRITE_EXTERNAL_STORAGE` (Android < 10)
- `CAMERA`

---

## 🏗️ Architecture

```
User Action
    ↓
Screen (UI + state)
    ↓
Service (pure logic, no UI)
    ↓
react-native-compressor / image-resizer / RNFS
    ↓
Result → ResultScreen (navigate with params)
```

Services are pure functions — no React state, no UI dependencies — making them easy to test and reuse.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing`
5. Open a Pull Request
