# PDF Pro Editor - Browser Extension

A powerful browser extension that enables local editing of PDF files directly on your computer. Edit text, add images, create annotations, and manipulate pages - all without uploading your files to any server.

## 🌟 Features

### Text Editing
- ✏️ Edit existing text while maintaining original formatting
- 📝 Add new text with customizable fonts, sizes, and colors
- 🎨 Apply text styling (bold, italic, underline)
- ↔️ Multiple text alignment options (left, center, right)

### Image Manipulation
- 🖼️ Replace existing images
- ➕ Insert new images from local storage
- 🔄 Rotate, resize, and position images
- 📐 Maintain aspect ratios and document flow

### Annotations & Highlighting
- 🎯 Highlight text with customizable colors and opacity
- ✍️ Freehand drawing tool
- 📊 Add shapes (rectangles, circles, lines, arrows)
- 🎨 Customizable colors and stroke widths

### Page Tools
- ➕ Add new pages
- 🗑️ Delete pages
- 🔄 Rotate pages
- 📄 Page thumbnails for easy navigation

### Advanced Features
- ↩️ Undo/Redo functionality
- 🔍 Zoom controls (50% - 300%)
- ⌨️ Keyboard shortcuts
- 💾 Local storage - all editing done offline
- 🔒 Complete privacy - no data uploaded
- 📥 Download edited PDFs

## 🚀 Installation

### From Source
1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension directory
6. The PDF Pro Editor icon should appear in your extensions

### From Chrome Web Store
*(Coming soon)*

## 📖 How to Use

1. **Open Extension**: Click the PDF Pro Editor icon in your browser toolbar
2. **Load PDF**: Click "Open PDF File" or drag and drop a PDF file
3. **Edit**: Use the toolbar to select editing tools:
   - **V**: Select tool
   - **T**: Text edit tool
   - **I**: Image tool
   - **H**: Highlight tool
   - **D**: Draw tool
   - **S**: Shape tool
4. **Save**: Click the "Save" button to download your edited PDF

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `V` | Select tool |
| `T` | Text tool |
| `I` | Image tool |
| `H` | Highlight tool |
| `D` | Draw tool |
| `S` | Shape tool |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + +` | Zoom in |
| `Ctrl/Cmd + -` | Zoom out |

## 🎨 User Interface

The extension features a modern, beautiful dark-themed interface with:
- Gradient backgrounds and glassmorphism effects
- Smooth animations and transitions
- Intuitive toolbar with clearly labeled tools
- Side panel with context-sensitive properties
- Page thumbnail navigation
- Responsive design that works on all screen sizes

## 🔒 Privacy & Security

- **100% Local**: All PDF editing is performed locally on your device
- **No Uploads**: Your files never leave your computer
- **No Tracking**: We don't collect any data about you or your files
- **Secure**: Works with password-protected PDFs (with valid password)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **PDF Rendering**: PDF.js
- **PDF Manipulation**: PDF-lib
- **Storage**: Chrome Storage API
- **Drawing**: HTML5 Canvas API

## 📋 Requirements

- Chrome 88+ or Edge 88+ (Manifest V3 compatible browser)
- Minimum 4GB RAM recommended
- Modern processor for smooth PDF rendering

## 🐛 Known Limitations

- Flattening annotations into the PDF is currently in development
- OCR for scanned PDFs is planned for future release
- Some complex PDF forms may not be fully supported
- Very large PDF files (>100MB) may have performance issues

## 🔮 Planned Features

- [ ] OCR for text recognition in scanned PDFs
- [ ] Export to DOCX, PNG, JPEG formats
- [ ] Advanced text editing (find & replace)
- [ ] PDF form filling and creation
- [ ] Digital signatures
- [ ] Cloud storage integration (optional)
- [ ] Collaborative editing
- [ ] PDF compression tools
- [ ] Batch processing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT in - see the LICENSE file for details.

## 💡 Support

If you encounter any issues or have suggestions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include your browser version and OS

## 🙏 Acknowledgments

- PDF.js by Mozilla
- PDF-lib by Andrew Dillon
- Inter font by Rasmus Andersson
- Icons from Heroicons

---

Made with ❤️ for privacy-conscious PDF editing

