# CGM Flow Image Generation Guide

This document provides detailed instructions for generating AI images for the CGM Flow application.

## Overview

The application requires **13 total images** in WebP format:
- **4 Device product images**: Illustrated product photos for device cards
- **9 Step header images**: Illustrated headers for each flow step

## Image Specifications

- **Format**: WebP
- **Style**: Modern, flat illustration style
- **Color Palette**: Soft purple (#9d7ea7, #d2bed8, #e8dce9)
- **Background**: White/light gray, minimal
- **Aspect Ratios**:
  - Device images: Square (1:1) - 512x512px recommended
  - Step headers: Wide (16:9) - 1792x1024px recommended

---

## Part 1: Device Product Images

Generate 4 illustrated CGM device images. Save them in `public/images/cgm-flow/devices/`

### Device 1: Dexcom G7
**Filename**: `dexcom-g7.webp`

**AI Prompt**:
```
Create a clean, illustrated product image of a Dexcom G7 continuous glucose monitor device. Show the small, circular white sensor with the wearable applicator. The illustration should be in a modern, flat design style with a soft purple accent color (#9d7ea7). White/light gray background. The device should be shown at a slight angle to show dimension. Professional medical device illustration, clean and minimal.
```

### Device 2: Dexcom G6
**Filename**: `dexcom-g6.webp`

**AI Prompt**:
```
Create a clean, illustrated product image of a Dexcom G6 continuous glucose monitor device. Show the sensor unit with transmitter attached, slightly larger and more rectangular than G7. The illustration should be in a modern, flat design style with a soft purple accent color (#9d7ea7). White/light gray background. The device should be shown at a slight angle to show dimension. Professional medical device illustration, clean and minimal.
```

### Device 3: Libre FreeStyle 3
**Filename**: `libre-freestyle-3.webp`

**AI Prompt**:
```
Create a clean, illustrated product image of a FreeStyle Libre 3 continuous glucose monitor sensor. Show the small, round disc-shaped sensor in white with blue accents. The illustration should be in a modern, flat design style with a soft purple accent color (#9d7ea7) integrated subtly. White/light gray background. The device should be shown at a slight angle to show dimension. Professional medical device illustration, clean and minimal.
```

### Device 4: Libre 14 Day
**Filename**: `libre-14-day.webp`

**AI Prompt**:
```
Create a clean, illustrated product image of a FreeStyle Libre 14 Day continuous glucose monitor sensor. Show the circular sensor disc slightly larger than Libre 3, in white with the characteristic curved top. The illustration should be in a modern, flat design style with a soft purple accent color (#9d7ea7) integrated subtly. White/light gray background. The device should be shown at a slight angle to show dimension. Professional medical device illustration, clean and minimal.
```

---

## Part 2: Step Header Images

Generate 9 illustrated header images. Save them in `public/images/cgm-flow/`

### Step 1: Currently Using CGM
**Filename**: `currently-using-cgm.webp`

**AI Prompt**:
```
Create a friendly illustrated image showing a person wearing a continuous glucose monitor sensor on their arm. The person should be smiling and looking confident. Modern flat illustration style with soft purple color palette (#9d7ea7, #d2bed8, #e8dce9). Minimal background. Medical but approachable and friendly aesthetic. Wide aspect ratio suitable for a header image.
```

### Step 2: Current Device
**Filename**: `current-device.webp`

**AI Prompt**:
```
Create an illustrated image showing multiple CGM devices displayed side by side on a clean surface. Modern flat illustration style with soft purple color palette (#9d7ea7, #d2bed8, #e8dce9). The devices should be arranged neatly, suggesting selection and comparison. Minimal background with subtle gradient. Wide aspect ratio suitable for a header image.
```

### Step 3: Last Device Update
**Filename**: `last-device-update.webp`

**AI Prompt**:
```
Create an illustrated image showing a calendar with a highlighted date and a CGM device nearby, suggesting a timeline or schedule. Modern flat illustration style with soft purple color palette (#9d7ea7, #d2bed8, #e8dce9). Include subtle clock or timeline elements. Minimal background. Professional medical aesthetic. Wide aspect ratio suitable for a header image.
```

### Step 4: Last Sensors Ordered
**Filename**: `last-sensors-ordered.webp`

**AI Prompt**:
```
Create an illustrated image showing CGM sensor packages or a delivery box with sensor supplies inside. Modern flat illustration style with soft purple color palette (#9d7ea7, #d2bed8, #e8dce9). Suggest supply management and ordering. Minimal background with soft shadows. Wide aspect ratio suitable for a header image.
```

### Step 5: Device Switch Intention
**Filename**: `device-switch-intention.webp`

**AI Prompt**:
```
Create an illustrated image showing two CGM devices with arrows or paths between them, suggesting switching or upgrading. Modern flat illustration style with soft purple color palette (#9d7ea7, #d2bed8, #e8dce9). Include elements suggesting choice and transition. Minimal background. Wide aspect ratio suitable for a header image.
```

### Step 6: Device Selection
**Filename**: `device-selection.webp`

**AI Prompt**:
```
Create an illustrated image showing a hand selecting or pointing to one CGM device among several options. Modern flat illustration style with soft purple color palette (#9d7ea7, #d2bed8, #e8dce9). Suggest decision-making and choice. Minimal background with subtle radial gradient. Wide aspect ratio suitable for a header image.
```

### Step 7: Last Doctor Visit
**Filename**: `last-doctor-visit.webp`

**AI Prompt**:
```
Create a friendly illustrated image showing a doctor and patient consultation scene in a medical office. Modern flat illustration style with soft purple color palette (#9d7ea7, #d2bed8, #e8dce9). The scene should feel warm and professional. Minimal background. Include subtle medical elements like a stethoscope or clipboard. Wide aspect ratio suitable for a header image.
```

### Step 8: Ineligible Selection
**Filename**: `ineligible-selection.webp`

**AI Prompt**:
```
Create a gentle illustrated image showing a document or form with a neutral indicator (not harsh X or red). Modern flat illustration style with soft purple color palette (#9d7ea7, #d2bed8, #e8dce9). The image should feel informative rather than negative or rejecting. Include supportive elements like a phone or support icon. Minimal background. Wide aspect ratio suitable for a header image.
```

### Step 9: Summary
**Filename**: `summary.webp`

**AI Prompt**:
```
Create an illustrated image showing a checklist or summary document with checkmarks, suggesting completion and review. Modern flat illustration style with soft purple color palette (#9d7ea7, #d2bed8, #e8dce9). Include elements suggesting organization and clarity. Minimal background with subtle geometric accents. Wide aspect ratio suitable for a header image.
```

---

## How to Generate Images

### Option 1: DALL-E (ChatGPT Plus/Pro)
1. Go to https://chat.openai.com (requires Plus or Pro subscription)
2. Copy each prompt above
3. Request: "Generate this image in 1792x1024 resolution" (for step headers) or "Generate this image in 512x512 resolution" (for devices)
4. Download the generated image
5. Convert to WebP using:
   - Online tool: https://cloudconvert.com/png-to-webp
   - Command line: `cwebp input.png -o output.webp`

### Option 2: Microsoft Copilot Designer (Free)
1. Go to https://copilot.microsoft.com/
2. Click on "Designer" or "Image Creator"
3. Copy each prompt above
4. Download generated images
5. Convert to WebP format (see above)

### Option 3: Midjourney (Subscription Required)
1. Use Discord or web interface at https://www.midjourney.com
2. For each prompt:
   - Add `--ar 16:9` for step headers (wide aspect ratio)
   - Add `--ar 1:1` for device images (square aspect ratio)
   - Add `--style raw` for more controlled illustration style
3. Example: `/imagine [prompt above] --ar 16:9 --style raw`
4. Download and convert to WebP

### Converting Images to WebP

**Using Command Line (requires cwebp)**:
```bash
# Install cwebp (macOS)
brew install webp

# Convert single image
cwebp input.png -o output.webp

# Convert all PNG files in a directory
for file in *.png; do cwebp "$file" -o "${file%.png}.webp"; done
```

**Using Online Tools**:
- https://cloudconvert.com/png-to-webp
- https://convertio.co/png-webp/
- https://ezgif.com/png-to-webp

---

## File Structure

After generating all images, your directory structure should look like:

```
public/
└── images/
    └── cgm-flow/
        ├── devices/
        │   ├── dexcom-g7.webp
        │   ├── dexcom-g6.webp
        │   ├── libre-freestyle-3.webp
        │   └── libre-14-day.webp
        ├── currently-using-cgm.webp
        ├── current-device.webp
        ├── last-device-update.webp
        ├── last-sensors-ordered.webp
        ├── device-switch-intention.webp
        ├── device-selection.webp
        ├── last-doctor-visit.webp
        ├── ineligible-selection.webp
        └── summary.webp
```

---

## Code Updates Already Completed

The following code changes have already been implemented:

1. ✅ Created `public/images/cgm-flow/devices/` directory
2. ✅ Updated `Device` interface in `types/cgm-flow.ts` to use `image` instead of `imagePlaceholder`
3. ✅ Updated `DEVICES` array to reference WebP image paths
4. ✅ Updated `DeviceCard` component to display Next.js Image components for device images
5. ✅ Updated `STEP_IMAGES` constant to reference WebP step header images
6. ✅ Updated all tests to work with new image structure
7. ✅ All 223 tests passing

---

## Testing

After placing the generated images in the correct directories:

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Open http://localhost:3000 in your browser

3. Verify that:
   - All step header images display correctly
   - Device card images display correctly (or fall back to emojis for "Other" and "No Preference")
   - Images are responsive and load quickly
   - Images maintain aspect ratios

4. Run tests to ensure everything still works:
   ```bash
   pnpm test
   ```

---

## Notes

- The "Other" and "No Preference" device options will continue to use emoji (❓ and 💡) as fallbacks
- All images use Next.js Image component for automatic optimization
- WebP format provides excellent compression while maintaining quality
- Images are served from the `public/` directory and accessible via `/images/` URL path
