# 🔧 DEBUGGING GUIDE - PDF Not Showing Issue

## Issue: Blank Page When PDF Loads

### Steps to Debug:

#### 1. **Open Browser Console**
   - Press **F12** in Chrome/Edge
   - Go to the **Console** tab
   - Look for error messages

#### 2. **Load the Extension**
   ```
   1. Go to chrome://extensions/
   2. Enable "Developer Mode"
   3. Click "Load unpacked"
   4. Select folder: e:\Programs\Extension\pdf editor
   ```

#### 3. **Test PDF Loading**
   ```
   1. Click extension icon
   2. Select a PDF file
   3. Watch the console for messages
   ```

#### 4. **Expected Console Output**
   ```
   === Starting PDF Load ===
   Storage result received: PDF found
   Loading PDF: filename.pdf
   PDF bytes length: XXXXX bytes
   Initializing PDF.js...
   ✓ PDF.js loaded successfully! Pages: X
   Initializing PDF-lib...
   ✓ PDF-lib loaded successfully!
   Initializing advanced editor...
   ✓ Advanced editor initialized!
   Rendering first page...
   
   --- Rendering Page 1 of X ---
   Got page object successfully
   Viewport dimensions: XXX x XXX
   Canvas dimensions set
   White background applied
   Starting PDF render...
   ✓ Page rendered successfully!
   Page info updated: 1/X
   
   Generating thumbnails...
   === PDF Load Complete ===
   ```

#### 5. **Common Issues & Fixes**

**Issue**: `PDF.js worker not found`
**Fix**: Check internet connection (PDF.js loads from CDN)

**Issue**: `Cannot read property 'getPage' of null`
**Fix**: PDF didn't load. Check file is valid PDF

**Issue**: `Canvas is blank white`
**Fix**: PDF rendered but content not visible. Try different PDF

**Issue**: `Storage is empty`
**Fix**: Must upload PDF through popup first

#### 6. **Quick Test**
   ```javascript
   // Paste in console to check if PDF.js is loaded:
   console.log('PDF.js version:', pdfjsLib.version);
   console.log('PDFDocument:', pdfDoc ? 'Loaded' : 'Not loaded');
   console.log('Total pages:', totalPages);
   ```

#### 7. **Manual Test Steps**
   1. Open popup (click extension icon)
   2. Click "Open PDF File"
   3. Select ANY PDF file
   4. Editor should open in new tab
   5. Watch console for logs
   6. PDF should render within 2-3 seconds

#### 8. **If Still Blank**
   Check these in console:
   ```javascript
   // Check canvas exists
   console.log('PDF Canvas:', document.getElementById('pdfCanvas'));
   
   // Check canvas size
   const canvas = document.getElementById('pdfCanvas');
   console.log('Canvas size:', canvas.width, 'x', canvas.height);
   
   // Check if PDF object exists
   console.log('PDF Document:', pdfDoc);
   ```

#### 9. **Alternative: Direct File Test**
   Open `editor.html` directly and check console errors

#### 10. **Last Resort**
   - Clear browser cache
   - Remove and reload extension
   - Try different browser (Chrome vs Edge)
   - Test with simple PDF (1-2 pages)

---

## Expected Behavior

✅ **Working**: 
- Console shows all loading steps
- PDF renders on white canvas
- Page shows correctly
- Thumbnails appear on left

❌ **Not Working**:
- Console shows errors
- Blank white page
- No thumbnails
- Loading never completes

---

## Need More Help?

1. Copy the **entire console output**
2. Note the **exact error message**
3. Share the **PDF file size** and type
4. Test with a **different PDF**

The console logs will tell us exactly where the problem is!
