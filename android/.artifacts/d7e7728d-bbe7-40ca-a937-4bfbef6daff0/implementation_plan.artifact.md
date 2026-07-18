# Implementation Plan - Change App Logo

The user wants to change the default app logo to a provided PNG file (`Company logo.png`). This involves updating both legacy and adaptive icon resources in the Android project.

## User Review Required

> [!IMPORTANT]
> The new logo will replace the existing `ic_launcher` and `ic_launcher_round` icons. I will use the provided `Company logo.png` for all resolutions.
> I will also update the adaptive icon background color to black (`#000000`) to match the new logo's background.

## Proposed Changes

### Android Resources

#### [MODIFY] [ic_launcher_background.xml](file:///D:/All Projects/Ai Smart Notebook/Mentora/android/app/src/main/res/values/ic_launcher_background.xml)
- Update the background color to `#000000`.

#### [MODIFY] Multiple mipmap PNGs
Replace the following files with `Company logo.png`:
- `app/src/main/res/mipmap-hdpi/ic_launcher.png`
- `app/src/main/res/mipmap-mdpi/ic_launcher.png`
- `app/src/main/res/mipmap-xhdpi/ic_launcher.png`
- `app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
- `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`
- `app/src/main/res/mipmap-hdpi/ic_launcher_round.png`
- `app/src/main/res/mipmap-mdpi/ic_launcher_round.png`
- `app/src/main/res/mipmap-xhdpi/ic_launcher_round.png`
- `app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png`
- `app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png`
- `app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png`
- `app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png`
- `app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png`
- `app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png`
- `app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png`

> [!NOTE]
> Since I only have one source image, I will copy it to all resolutions. Ideally, these should be resized, but using a high-resolution source for all is a functional fallback.

## Verification Plan

### Manual Verification
- Deploy the app to a device/emulator and verify the new logo appears on the home screen and in the app drawer.
- Check both square and round icon variants.
