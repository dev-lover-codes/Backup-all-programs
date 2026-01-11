// PDF Editor - Simple Version
console.log('PDF Editor loading...');

// Global variables
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let scale = 1.5;
let rendering = false;
let pdfBytes = null;
let fileName = 'document.pdf';
let advancedEditor = null;
let annotations = [];
let currentTool = 'select';
let isDrawing = false;
let startX, startY;

// Canvas elements
const pdfCanvas = document.getElementById('pdfCanvas');
const annotationCanvas = document.getElementById('annotationCanvas');
const pdfCtx = pdfCanvas.getContext('2d');
const annotationCtx = annotationCanvas.getContext('2d');

// UI elements
const loading = document.getElementById('loading');
const pageInput = document.getElementById('pageInput');
const fileNameElement = document.getElementById('fileName');

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';

// Load PDF when page loads
document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM loaded, initializing...');
    await loadPDFFromStorage();
    setupEventListeners();
});

// Load PDF from Chrome storage
async function loadPDFFromStorage() {
    try {
        console.log('Loading PDF from storage...');
        showLoading(true);

        const result = await chrome.storage.local.get(['currentPDF']);

        if (!result.currentPDF) {
            console.error('No PDF found in storage');
            showLoading(false);
            alert('No PDF file selected. Please open the extension and select a PDF file.');
            return;
        }

        fileName = result.currentPDF.name;
        fileNameElement.textContent = fileName;

        pdfBytes = new Uint8Array(result.currentPDF.data);
        console.log('PDF bytes:', pdfBytes.length);
        if (pdfBytes.length > 0) {
            console.log('First 5 bytes:', pdfBytes.slice(0, 5));
            const header = String.fromCharCode.apply(null, pdfBytes.slice(0, 5));
            console.log('Header string:', header);
            if (header !== '%PDF-') {
                console.error('Invalid PDF header detected!');
                // Clear bad data
                await chrome.storage.local.remove('currentPDF');
                alert('Error: The stored file is corrupted or invalid. Please upload the PDF again from the popup.');
                window.close(); // Close tab to encourage using popup
                return;
            }
        } else {
            console.error('PDF data is empty!');
            // Clear bad data
            await chrome.storage.local.remove('currentPDF');
            alert('Error: Stored PDF data is empty. Please upload again.');
            window.close();
            return;
        }

        // Load with PDF.js
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
        console.log('PDF loaded! Pages:', totalPages);

        // Load with PDF-lib
        const pdfLibDoc = await PDFLib.PDFDocument.load(pdfBytes);

        // Initialize advanced editor
        advancedEditor = new PDFAdvancedEditor();
        await advancedEditor.initialize(pdfBytes);

        // Update page input
        pageInput.max = totalPages;
        pageInput.value = currentPage;

        // Render first page
        await renderPage(currentPage);

        showLoading(false);
        console.log('PDF ready!');
    } catch (error) {
        console.error('Error loading PDF:', error);
        showLoading(false);
        alert('Failed to load PDF: ' + error.message);
    }
}

// Render page
async function renderPage(pageNum) {
    if (rendering || !pdfDoc) return;
    rendering = true;

    try {
        console.log('Rendering page', pageNum);
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        annotationCanvas.width = viewport.width;
        annotationCanvas.height = viewport.height;

        // White background
        pdfCtx.fillStyle = '#ffffff';
        pdfCtx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);

        // Render PDF
        await page.render({
            canvasContext: pdfCtx,
            viewport: viewport
        }).promise;

        // Render annotations
        renderAnnotations();

        rendering = false;
        console.log('Page rendered');
    } catch (error) {
        console.error('Render error:', error);
        rendering = false;
    }
}

// Render annotations
function renderAnnotations() {
    annotationCtx.clearRect(0, 0, annotationCanvas.width, annotationCanvas.height);

    const pageAnnotations = annotations.filter(a => a.page === currentPage);
    pageAnnotations.forEach(annotation => {
        if (annotation.type === 'highlight') {
            annotationCtx.fillStyle = annotation.color || 'rgba(255, 255, 0, 0.3)';
            annotationCtx.fillRect(annotation.x, annotation.y, annotation.width, annotation.height);
        } else if (annotation.type === 'text') {
            annotationCtx.font = `${annotation.fontSize || 16}px Arial`;
            annotationCtx.fillStyle = annotation.color || '#000';
            annotationCtx.fillText(annotation.text, annotation.x, annotation.y);
        } else if (annotation.type === 'draw' && annotation.points) {
            annotationCtx.strokeStyle = annotation.color || '#000';
            annotationCtx.lineWidth = 2;
            annotationCtx.beginPath();
            annotationCtx.moveTo(annotation.points[0].x, annotation.points[0].y);
            annotation.points.forEach(p => annotationCtx.lineTo(p.x, p.y));
            annotationCtx.stroke();
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Page navigation
    document.getElementById('firstPage').addEventListener('click', () => goToPage(1));
    document.getElementById('prevPage').addEventListener('click', () => goToPage(currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => goToPage(currentPage + 1));
    document.getElementById('lastPage').addEventListener('click', () => goToPage(totalPages));

    pageInput.addEventListener('change', (e) => {
        const page = parseInt(e.target.value);
        if (page >= 1 && page <= totalPages) {
            goToPage(page);
        } else {
            e.target.value = currentPage;
        }
    });

    // Zoom
    document.getElementById('zoomInBtn').addEventListener('click', () => changeZoom(0.2));
    document.getElementById('zoomOutBtn').addEventListener('click', () => changeZoom(-0.2));
    document.getElementById('zoomResetBtn').addEventListener('click', () => { scale = 1.5; renderPage(currentPage); });

    // Tools
    document.getElementById('textBtn').addEventListener('click', () => setTool('text'));
    document.getElementById('imageBtn').addEventListener('click', () => document.getElementById('imageFileInput').click());
    document.getElementById('drawBtn').addEventListener('click', () => setTool('draw'));
    document.getElementById('highlightBtn').addEventListener('click', () => setTool('highlight'));
    document.getElementById('shapeBtn').addEventListener('click', () => setTool('shape'));

    // Undo
    document.getElementById('undoBtn').addEventListener('click', () => {
        if (annotations.length > 0) {
            annotations.pop();
            renderAnnotations();
        }
    });

    // Save
    document.getElementById('saveBtn').addEventListener('click', savePDF);

    // Canvas drawing
    annotationCanvas.addEventListener('mousedown', handleMouseDown);
    annotationCanvas.addEventListener('mousemove', handleMouseMove);
    annotationCanvas.addEventListener('mouseup', handleMouseUp);

    // Image upload
    document.getElementById('imageFileInput').addEventListener('change', handleImageUpload);
}

// Go to page
async function goToPage(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
        currentPage = page;
        pageInput.value = page;
        await renderPage(page);
    }
}

// Change zoom
async function changeZoom(delta) {
    scale = Math.max(0.5, Math.min(3, scale + delta));
    await renderPage(currentPage);
}

// Set tool
function setTool(tool) {
    currentTool = tool;
    console.log('Tool:', tool);
}

// Mouse handlers
function handleMouseDown(e) {
    const rect = annotationCanvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDrawing = true;

    if (currentTool === 'text') {
        const text = prompt('Enter text:');
        if (text) {
            annotations.push({
                type: 'text',
                page: currentPage,
                x: startX,
                y: startY,
                text: text,
                fontSize: 16,
                color: '#000'
            });
            renderAnnotations();
        }
        isDrawing = false;
    } else if (currentTool === 'draw') {
        annotations.push({
            type: 'draw',
            page: currentPage,
            points: [{ x: startX, y: startY }],
            color: '#000'
        });
    }
}

function handleMouseMove(e) {
    if (!isDrawing) return;

    const rect = annotationCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'draw') {
        const current = annotations[annotations.length - 1];
        if (current && current.type === 'draw') {
            current.points.push({ x, y });
            renderAnnotations();
        }
    } else if (currentTool === 'highlight') {
        annotationCtx.clearRect(0, 0, annotationCanvas.width, annotationCanvas.height);
        renderAnnotations();
        annotationCtx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        annotationCtx.fillRect(startX, startY, x - startX, y - startY);
    }
}

function handleMouseUp(e) {
    if (!isDrawing) return;
    isDrawing = false;

    const rect = annotationCanvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (currentTool === 'highlight') {
        annotations.push({
            type: 'highlight',
            page: currentPage,
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY,
            color: 'rgba(255, 255, 0, 0.3)'
        });
        renderAnnotations();
    }
}

// Handle image upload
async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        showLoading(true);
        const x = pdfCanvas.width / 2 - 100;
        const y = pdfCanvas.height / 2 - 100;

        await advancedEditor.insertImage(file, x, y, 200, 200, currentPage - 1);
        pdfBytes = await advancedEditor.exportPDF();

        // Reload
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        pdfDoc = await loadingTask.promise;
        await renderPage(currentPage);

        showLoading(false);
        alert('Image inserted!');
    } catch (error) {
        showLoading(false);
        alert('Failed to insert image: ' + error.message);
    }
}

// Save PDF
async function savePDF() {
    try {
        showLoading(true);

        // Create new PDF-lib doc
        const pdfLibDoc = await PDFLib.PDFDocument.load(pdfBytes);

        // Add annotations
        for (const annotation of annotations) {
            const pageIndex = annotation.page - 1;
            const page = pdfLibDoc.getPages()[pageIndex];
            const pageHeight = page.getHeight();

            if (annotation.type === 'text') {
                const font = await pdfLibDoc.embedFont(PDFLib.StandardFonts.Helvetica);
                page.drawText(annotation.text, {
                    x: annotation.x,
                    y: pageHeight - annotation.y,
                    size: annotation.fontSize || 16,
                    font: font,
                    color: PDFLib.rgb(0, 0, 0)
                });
            } else if (annotation.type === 'highlight') {
                page.drawRectangle({
                    x: annotation.x,
                    y: pageHeight - annotation.y - annotation.height,
                    width: annotation.width,
                    height: annotation.height,
                    color: PDFLib.rgb(1, 1, 0),
                    opacity: 0.3
                });
            }
        }

        const savedBytes = await pdfLibDoc.save();
        const blob = new Blob([savedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.replace('.pdf', '_edited.pdf');
        a.click();

        URL.revokeObjectURL(url);
        showLoading(false);
        alert('PDF saved!');
    } catch (error) {
        console.error('Save error:', error);
        showLoading(false);
        alert('Failed to save: ' + error.message);
    }
}

// Show/hide loading
function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
}

console.log('Editor script loaded');
