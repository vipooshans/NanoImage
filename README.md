# 🖼️ NanoImage — Advanced Image Optimizer

[![React Native](https://img.shields.io/badge/React%20Native-0.86.0-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/) [![Built With](https://img.shields.io/badge/Built%20With-JavaScript-yellowgreen)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  

![NanoImage Preview](assets/preview-animated.gif)

<p align="center">
  <em>Fast • Beautiful • Intuitive</em>
</p>

---

## ✨ Overview

NanoImage is a production-ready React Native mobile app focused on high-quality image optimization with a modern glassmorphic UI and motion-rich interactions. It's designed for power users and casual users alike who want fast batch compression, resizing, format conversion, and a delightful UI experience.

**Developed by vipooshan**

---

## 🎯 Highlights

- Colorful, futuristic UI with neon accents and glassmorphism cards
- Smooth, physics-driven animations across the app (spring, fade, scale)
- Real-time per-image progress with animated neon progress bars
- Batch processing up to 20 images with queue control and pause/resume
- Lossy and lossless compression options, plus format conversion to WebP for best size savings

---

## ✨ Features (Expanded)

| Feature | What it does | Visuals & Animation |
|---|---:|---|
| 🗜️ Compress | Reduce file size with a quality slider (1–100) and presets (Low/Med/High) | Animated live preview + before/after size animation |
| 📐 Resize | Custom width × height, aspect-ratio lock, and device-friendly presets | Smooth input transitions + live canvas preview |
| 🔁 Convert | JPEG, PNG, WebP — pick output quality and metadata keep/remove options | Format badge animation when converting |
| 📚 Batch | Queue up to 20 images with per-item retries, concurrent worker pool | Per-item animated progress and overall progress timeline |
| 🔍 Before/After | Side-by-side and swipe comparison with detailed stats | Animated percentage counter and color-coded reduction indicator |
| 💾 Save to Gallery | Save to Pictures/NanoImage and optionally overwrite or version | Toast + share sheet animations |

---

## 🎨 Design & Motion System

- Theme: Deep navy background with neon cyan, purple, green, and orange accents.  
- Glassmorphism: Frosted translucent cards with soft blur and glow borders.  
- Motion: Reanimated v3 drives spring-based interactions, staggered list enters, ripple buttons, and progress micro-animations.  
- Feedback: Color-coded reduction badges (green/cyan/orange/red) and haptic feedback on mobile.

Animation examples used in-app:
- Lottie-powered loader for global operations
- Reanimated-driven progress bars and parallax card headers

---

## 🗂️ Project Structure

```
NanoImage/
├── src/
│   ├── components/
│   │   ├── GlassCard.jsx        # Glassmorphism card container
│   │   ├── Header.jsx           # Shared screen header with back button + animated title
│   │   ├── ActionButton.jsx     # Gradient CTA with press ripple animation
│   │   ├── QualitySlider.jsx    # Custom touch-driven slider with value bubble
│   │   ├── ProgressBar.jsx      # Animated neon progress bar (reanimated)
│   │   ├── StatBadge.jsx        # Before/After stat pill (color-coded)
│   │   └── ImagePreview.jsx     # Image thumbnail with size overlay and touch-to-preview
│   ├── screens/
│   │   ├── HomeScreen.jsx       # Feature dashboard with animated 2×2 card grid
│   │   ├── CompressScreen.jsx   # Quality slider + single image compression
│   │   ├── ResizeScreen.jsx     # Dimension inputs + aspect lock + presets
│   │   ├── ConvertScreen.jsx    # Format flow diagram + selector
│   │   ├── BatchScreen.jsx      # Multi-image queue + batch processor UI
│   │   └── ResultScreen.jsx     # Before/After comparison + save/share
│   ├── services/
│   │   ├── compressionService.js   # react-native-compressor wrapper (pure functions)
│   │   ├── resizeService.js        # react-native-image-resizer wrapper
│   │   ├── convertService.js       # Format conversion logic
│   │   ├── batchService.js         # Sequential / concurrent batch processor
│   │   └── fileService.js          # RNFS file ops, gallery save, cache clean
│   ├── navigation/
│   │   └── AppNavigator.jsx        # Stack navigator setup, animated transitions
│   ├── theme/
│   │   └── theme.js                # Design tokens (colors, typography, spacing)
│   └── utils/
│       ├── formatSize.js           # Bytes → KB/MB, reduction calculations
│       └── permissionsHelper.js    # Android/iOS storage permission helper
├── App.jsx                         # Root component
└── package.json
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---|---:|---|
| `react-native` | 0.86.0 | Core framework |
| `@react-navigation/native` | ^7 | Navigation & animated transitions |
| `react-native-image-picker` | ^7 | Gallery / camera picker |
| `react-native-compressor` | ^1.9 | Image compression primitives |
| `react-native-image-resizer` | ^3 | Resize & format conversion |
| `react-native-fs` | ^2.20 | File system, save to gallery |
| `react-native-linear-gradient` | ^2.8 | Gradient UI backgrounds |
| `react-native-gesture-handler` | ^2.20 | Touch gesture foundation |
| `react-native-reanimated` | ^3 | Smooth animations & gestures |
| `lottie-react-native` | ^5 | Animated illustrations & loaders |

---

## 🔧 Getting Started (Developer)

Prerequisites:
- Node.js ≥ 18
- Java JDK 17 (Android)
- Android Studio with SDK / emulator (or device)
- macOS + Xcode for iOS

Install:
```bash
cd NanoImage
npm install --legacy-peer-deps
```

Run (Android):
```bash
npm start       # Metro
npm run android # build & run
```

Run (iOS):
```bash
cd ios && pod install && cd ..
npm run ios
```

---

## 🔐 Android Permissions

Manifest entries (modern handling + runtime checks):
- `READ_MEDIA_IMAGES` (Android 13+)
- `READ_EXTERNAL_STORAGE` (Android <13)
- `WRITE_EXTERNAL_STORAGE` (Android <10)
- `CAMERA`

Runtime permission helper is available at `src/utils/permissionsHelper.js` with friendly prompts and fallback handling.

---

## 🏗️ Architecture

User Action → Screen (UI + state) → Service (pure logic) → Native libs (compress/resize/RNFS) → ResultScreen

Services are intentionally pure and testable with minimal side-effects.

---

## 🖼️ Screenshots & Demos

Add screenshots or animated previews to `assets/` and reference them like:

```markdown
![Home Screen](assets/home.png)
![Compress Demo](assets/preview-animated.gif)
```

If you'd like, I can add example images or a GIF to the repo in a follow-up change.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing`
3. Commit: `git commit -m "feat: add amazing feature"`
4. Push: `git push origin feature/amazing`
5. Open a Pull Request

Please follow the code style in `src/` and include unit tests for services where applicable.

---

## 📝 Changelog

- v0.1.0 — Initial public prototype (UI + core compress/resize/convert flows)

---

## 🚀 Want me to add assets?

I can add a demo GIF and a couple of screenshots to `assets/` and update the README to link them. Tell me which images you'd like included or upload them and I'll commit them for you.
