# PDF Pro Editor - Complete User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Interface Overview](#interface-overview)
3. [Tools & Features](#tools--features)
4. [Keyboard Shortcuts](#keyboard-shortcuts)
5. [Advanced Features](#advanced-features)
6. [Tips & Tricks](#tips--tricks)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Installation
1. Open Chrome/Edge browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select the extension folder
6. Click the PDF Pro Editor icon to begin

### Opening a PDF
1. Click the extension icon in your toolbar
2. Click "Open PDF File" or drag-and-drop a PDF
3. The editor will open in a new tab

---

## Interface Overview

### Toolbar (Top)
- **File Name**: Shows the current PDF name
- **Tool Group**: Select editing tools
- **Undo/Redo**: Reverse or repeat actions
- **Zoom Controls**: Adjust view size (50%-300%)
- **Save Button**: Download edited PDF

### Side Panel (Right)
- **Text Properties**: Font, size, color, alignment
- **Image Settings**: Dimensions, rotation
- **Shape Settings**: Type, colors, stroke width
- **Highlight Settings**: Color presets, opacity
- **Page Tools**: Add, delete, rotate pages

### Canvas Area (Center)
- **Main Canvas**: PDF editing workspace
- **Page Thumbnails** (Left): Quick page navigation

---

## Tools & Features

### 1. Select Tool (V)
- **Purpose**: Default selection and navigation
- **Usage**: Click to select, pan around document
- **Tip**: Use this when not actively editing

### 2. Text Tool (T)
- **Purpose**: Add text annotations
- **Usage**:
  1. Click where you want text
  2. Enter text in the prompt
  3. Adjust properties in side panel
- **Properties**:
  - Font Family (Helvetica, Times, Courier, Arial)
  - Font Size (8-72 pt)
  - Color (any hex color)
  - Alignment (Left, Center, Right)

### 3. Image Tool (I)
- **Purpose**: Insert images into PDF
- **Usage**:
  1. Select Image tool
  2. Click "Replace Image" in sidebar
  3. Choose PNG or JPEG file
  - Image appears at center of page
- **Properties**:
  - Width & Height (adjustable)
  - Rotation (0-360°)
- **Supported Formats**: PNG, JPEG

### 4. Highlight Tool (H)
- **Purpose**: Highlight text or areas
- **Usage**:
  1. Select Highlight tool
  2. Drag over area to highlight
  3. Release to apply
- **Properties**:
  - 5 color presets (yellow, green, blue, red, purple)
  - Custom color picker
  - Opacity slider (0-100%)

### 5. Draw Tool (D)
- **Purpose**: Freehand drawing/annotations
- **Usage**:
  1. Select Draw tool
  2. Click and drag to draw
  3. Release to finish
- **Use Cases**:
  - Signatures
  - Diagrams
  - Custom annotations
  - Arrows and pointers

### 6. Shape Tool (S)
- **Purpose**: Add geometric shapes
- **Usage**:
  1. Select Shape tool
  2. Choose shape type in sidebar
  3. Drag on canvas to create
- **Shape Types**:
  - **Rectangle**: Boxes, borders
  - **Circle**: Ovals, circles
  - **Line**: Straight lines
  - **Arrow**: Directional pointers (coming soon)
- **Properties**:
  - Stroke Color
  - Fill Color
  - Stroke Width (1-20 pt)

---

## Keyboard Shortcuts

### Tools
| Key | Tool |
|-----|------|
| `V` | Select Tool |
| `T` | Text Tool |
| `I` | Image Tool |
| `H` | Highlight Tool |
| `D` | Draw Tool |
| `S` | Shape Tool |

### Actions
| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Shift+Z` / `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl++` / `Cmd++` | Zoom In |
| `Ctrl+-` / `Cmd+-` | Zoom Out |

### Navigation (Coming Soon)
| Shortcut | Action |
|----------|--------|
| `Page Up` | Previous Page |
| `Page Down` | Next Page |
| `Home` | First Page |
| `End` | Last Page |

---

## Advanced Features

### Page Manipulation

#### Add Page
- **Button**: "Add Page" in side panel
- **Action**: Adds blank page at end of document
- **Use Case**: Extending documents, adding appendices

#### Delete Page
- **Button**: "Delete Page" in side panel
- **Action**: Removes current page
- **Confirmation**: Asks for confirmation before deleting
- **Note**: Cannot delete if only one page remains

#### Rotate Page
- **Button**: "Rotate Page" in side panel
- **Action**: Rotates current page 90° clockwise
- **Use Cases**:
  - Fixing orientation
  - Landscape/portrait conversion
  - Scanned document corrections

### Zoom Controls
- **Range**: 50% - 300%
- **Increment**: 20% per click
- **Display**: Shows current zoom level
- **Tip**: Use 100% for actual size, 150% for comfortable editing

### Undo/Redo System
- **Unlimited History**: Every action is saved
- **Annotations Only**: Page modifications cannot be undone
- **Keyboard Shortcuts**: Fastest way to undo/redo

---

## Tips & Tricks

### Efficiency Tips
1. **Use Keyboard Shortcuts**: Much faster than clicking tools
2. **Highlight Presets**: Click color presets for quick color changes
3. **Zoom for Precision**: Zoom in (200%+) for precise text placement
4. **Page Thumbnails**: Click thumbnails for quick page navigation
5. **Side Panel**: Auto-opens with context-relevant properties

### Best Practices
1. **Save Frequently**: Download edited versions regularly
2. **Test on Copy**: Work on PDF copies for important documents
3. **Check Before Deleting**: Page deletion cannot be undone
4. **Image Formats**: Use PNG for graphics, JPEG for photos
5. **Font Matching**: Choose fonts that match original document

### Common Workflows

#### Adding Signature
1. Press `D` for Draw tool
2. Zoom to signature area
3. Draw signature with mouse/trackpad
4. Download PDF

#### Highlighting Document
1. Press `H` for Highlight tool
2. Select color preset
3. Drag over text to highlight
4. Repeat for all sections
5. Save with `Save` button

#### Adding Context
1. Press `T` for Text tool
2. Click where comment should go
3. Type annotation text
4. Adjust font/size if needed
5. Press `V` to finish

---

## Troubleshooting

### Common Issues

#### PDF Won't Load
- **Check File Size**: Very large PDFs (>100MB) may be slow
- **Verify Format**: Must be valid PDF file
- **Try Different PDF**: Test with a simpler PDF first
- **Browser Console**: Press F12 to check for errors

#### Annotations Not Showing
- **Check Page**: Annotations are page-specific
- **Refresh View**: Change zoom or page and return
- **Clear Cache**: Browser may need refresh

#### Save Not Working
- **Check Permissions**: Browser needs download permission
- **Disk Space**: Ensure enough free space
- **Pop-up Blocker**: May block download - allow pop-ups

#### Performance Issues
- **Close Other Tabs**: Free up memory
- **Reduce Zoom**: Lower zoom levels perform better
- **Simpler Annotations**: Freehand drawing can be intensive
- **Page Count**: Documents with 100+ pages may be slower

### Error Messages

#### "No PDF file found"
- **Solution**: Open extension popup and select PDF first

#### "Failed to load PDF"
- **Causes**: Corrupted file, unsupported encryption
- **Solution**: Try re-downloading PDF or use different version

#### "Cannot delete the only page"
- **Explanation**: PDFs must have at least one page
- **Solution**: Add a new page before deleting if needed

#### "Failed to insert image"
- **Causes**: Unsupported format, file too large, corrupted image
- **Solution**: Convert to PNG/JPEG, reduce size, try different image

### Getting Help
1. Check this guide first
2. View browser console (F12) for error details
3. Try with a simple test PDF
4. Check GitHub issues for similar problems
5. Create new issue with:
   - Browser version
   - PDF details (size, source)
   - Steps to reproduce
   - Error messages

---

## Known Limitations

### Current Version
- ❌ Freehand drawings NOT flattened to PDF (canvas overlay only)
- ❌ No form field editing
- ❌ No OCR for scanned PDFs
- ❌ No password-protected PDF support
- ❌ No collaborative editing

### Coming Soon
- ✅ DOCX export
- ✅ Batch processing
- ✅ Cloud storage integration (optional)
- ✅ Advanced text editing (find & replace)
- ✅ Digital signatures
- ✅ Form filling

---

## Privacy & Security

### Data Storage
- **All Local**: Editing happens on your device
- **No Upload**: Files never sent to external servers
- **Chrome Storage**: Recent files list stored locally
- **Temporary**: Data cleared when extension is removed

### Permissions
- **Storage**: For saving recent files list
- **Active Tab**: To open editor page
- **Scripting**: For extension functionality

### Security
- **No Tracking**: We don't collect any data
- **No Analytics**: No usage statistics
- **Open Source**: Code is fully transparent
- **No Network**: Extension works completely offline

---

## Appendix

### File Naming Convention
- **Edited Files**: Adds "_edited" suffix
- **Example**: `document.pdf` → `document_edited.pdf`
- **Page Exports**: `document_page1.png`

### Browser Compatibility
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave (Chromium-based)
- ✅ Opera (Chromium-based)
- ❌ Firefox (different extension API)
- ❌ Safari (different extension format)

### Performance Guidelines
| PDF Size | Pages | Performance | Recommendation |
|----------|-------|-------------|----------------|
| < 5MB | < 20 | Excellent | Full features |
| 5-20MB | 20-50 | Good | All features work well |
| 20-50MB | 50-100 | Fair | May be slower |
| > 50MB | > 100 | Poor | Consider splitting PDF |

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**License**: MIT

For more information, visit the [GitHub Repository](#) or check the [README.md](README.md) file.
