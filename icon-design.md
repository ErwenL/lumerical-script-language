# Lumerical Script Language Extension Icon

## Current Icon

**File:** `icon.png`
**Format:** PNG
**Current Size:** User-provided custom icon

The extension currently uses a user-provided PNG icon file (`icon.png`).

## Recommended Icon Sizes

For optimal display across different contexts in VS Code and the marketplace, the following sizes are recommended:

### Required Sizes
- **128×128px** - Standard extension icon size (current file)
- **256×256px** - High resolution for marketplace and retina displays

### Optional Sizes
- **48×48px** - Extension list view
- **32×32px** - Small toolbar icons
- **16×16px** - Activity bar (if applicable)

## Generating Additional Sizes

If your current `icon.png` is not 128×128px, or if you need additional sizes for marketplace publication:

### Option 1: ImageMagick (Command Line)
```bash
# Install ImageMagick first

# Resize to 128x128 (standard)
convert icon.png -resize 128x128 icon-128.png

# Resize to 256x256 (high res for marketplace)
convert icon.png -resize 256x256 icon-256.png

# Generate all recommended sizes
convert icon.png -resize 128x128 icon-128.png
convert icon.png -resize 256x256 icon-256.png
convert icon.png -resize 48x48 icon-48.png
```

### Option 2: Using Node.js (Sharp library)
```javascript
const sharp = require('sharp');
const fs = require('fs');

async function generateIcons() {
  const sizes = [16, 32, 48, 128, 256];
  
  for (const size of sizes) {
    await sharp('icon.png')
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(`icon-${size}.png`);
    
    console.log(`Generated icon-${size}.png`);
  }
}

generateIcons().catch(console.error);
```

Install sharp: `npm install sharp`

### Option 3: Online Tools
- [ResizeImage.net](https://resizeimage.net/)
- [PicResize](https://picresize.com/)
- [iLoveIMG](https://www.iloveimg.com/resize-image)

### Option 4: Photoshop/GIMP
1. Open `icon.png`
2. Image → Image Size
3. Set dimensions to desired size (maintain aspect ratio)
4. Save as PNG

## Icon Requirements

### Technical Specifications
- **Format:** PNG (recommended) or SVG
- **Color Mode:** RGB
- **Transparency:** Supported (use for non-rectangular icons)
- **File Size:** Keep under 1MB for marketplace

### Design Guidelines
- **Simplicity:** Should be recognizable at 16×16px
- **Contrast:** Good visibility on both light and dark themes
- **Branding:** Reflects Lumerical/optics + script/code nature
- **Professional:** Suitable for VS Code marketplace

## Current Configuration

The `package.json` references the icon:

```json
{
  "icon": "icon.png"
}
```

## File Structure

```
lumerical-script-language/
├── icon.png              # Main icon (user-provided)
├── icon-design.md        # This documentation file
└── package.json          # Extension manifest with icon reference
```

## Notes

- VS Code will automatically scale the icon for different contexts
- A single 128×128px PNG is usually sufficient for most use cases
- For marketplace publication, consider providing a 256×256px version for high-DPI displays
- Test the icon appearance in both light and dark VS Code themes

## Updating the Icon

To replace the current icon:
1. Create or obtain your new icon image
2. Ensure it's at least 128×128px
3. Save it as `icon.png` in the project root
4. The `package.json` already references this file
5. Reload VS Code window to see changes: `Ctrl+Shift+P` → "Developer: Reload Window"

---

**Current Status:** Using user-provided `icon.png`