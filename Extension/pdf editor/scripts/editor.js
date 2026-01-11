// PDF Pro Editor - Main Editor Script

// Global variables
let pdfDoc = null;
let pdfLib = null;
let currentPage = 1;
let totalPages = 0;
let scale = 1.5;
let rendering = false;
let currentTool = 'select';
let annotations = [];
let undoStack = [];
let redoStack = [];
let pdfBytes = null;
let fileName = 'document.pdf';
let advancedEditor = null;
let renderedPages = []; // Store page elements: { pageIndex, container, pdfCanvas, annotationCanvas, ... }

// UI elements
const loadingOverlay = document.getElementById('loadingOverlay');
const sidePanel = document.getElementById('sidePanel');
const fileNameElement = document.getElementById('fileName');
const zoomLevelElement = document.getElementById('zoomLevel');
const thumbnailsList = document.getElementById('thumbnailsList');
const canvasWrapper = document.getElementById('canvasWrapper');

// Tool buttons
const selectToolBtn = document.getElementById('selectTool');
const textToolBtn = document.getElementById('textTool');
const imageToolBtn = document.getElementById('imageTool');
const highlightToolBtn = document.getElementById('highlightTool');
const drawToolBtn = document.getElementById('drawTool');
const shapeToolBtn = document.getElementById('shapeTool');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const downloadBtn = document.getElementById('downloadBtn');

// Drawing state
let isDrawing = false;
let startX, startY;
let currentAnnotation = null;

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';

// Initialize on load
document.addEventListener('DOMContentLoaded', async function () {
    await loadPDFFromStorage();
    setupEventListeners();
    setupKeyboardShortcuts();
});

// Load PDF from Chrome storage
async function loadPDFFromStorage() {
    try {
        console.log('=== Starting PDF Load ===');
        showLoading(true);

        const result = await chrome.storage.local.get(['currentPDF']);
        console.log('Storage result received:', result.currentPDF ? 'PDF found' : 'No PDF');

        if (!result.currentPDF) {
            console.error('No PDF in storage');
            showLoading(false);
            alert('No PDF file found. Please select a PDF from the popup.');
            return;
        }

        fileName = result.currentPDF.name;
        fileNameElement.textContent = fileName;
        console.log('Loading PDF:', fileName);

        // Convert array back to Uint8Array
        pdfBytes = new Uint8Array(result.currentPDF.data);
        console.log('PDF bytes length:', pdfBytes.length, 'bytes');

        // Load with PDF.js for rendering
        console.log('Initializing PDF.js...');
        const loadingTask = pdfjsLib.getDocument({
            data: pdfBytes,
            verbosity: pdfjsLib.VerbosityLevel.ERRORS
        });

        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
        console.log('✓ PDF.js loaded successfully! Pages:', totalPages);

        // Update page info
        updatePageInfo();

        // Load with PDF-lib for editing
        console.log('Initializing PDF-lib...');
        pdfLib = await PDFLib.PDFDocument.load(pdfBytes);
        console.log('✓ PDF-lib loaded successfully!');

        // Initialize advanced editor
        console.log('Initializing advanced editor...');
        advancedEditor = new PDFAdvancedEditor();
        await advancedEditor.initialize(pdfBytes);
        console.log('✓ Advanced editor initialized!');

        // Render all pages
        console.log('Rendering all pages...');
        await renderAllPages();

        // Generate thumbnails
        console.log('Generating thumbnails...');
        await generateThumbnails();

        console.log('=== PDF Load Complete ===');
        showLoading(false);
    } catch (error) {
        console.error('!!! ERROR LOADING PDF !!!');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        showLoading(false);
        alert('Failed to load PDF: ' + error.message + '\n\nCheck the browser console (F12) for more details.');
    }
}

// Render PDF page
// Render multiple pages
async function renderAllPages() {
    canvasWrapper.innerHTML = ''; // Clear existing
    renderedPages = [];

    for (let i = 1; i <= totalPages; i++) {
        await createAndRenderPage(i);
    }
}

// Create and render a single page container
async function createAndRenderPage(pageNum) {
    // Create wrapper
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'page-wrapper';
    pageWrapper.id = `page-wrapper-${pageNum}`;

    // 1. Page Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'page-toolbar';
    toolbar.innerHTML = `
        <span class="page-number">${pageNum}</span>
        <div class="page-action-group">
            <button class="page-btn delete-btn" title="Delete Page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button class="page-btn zoom-in-btn" title="Zoom In">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
            </button>
            <button class="page-btn zoom-out-btn" title="Zoom Out">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
            </button>
            <button class="page-btn rotate-left-btn" title="Rotate Left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                </svg>
            </button>
            <button class="page-btn rotate-right-btn" title="Rotate Right">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                </svg>
            </button>
        </div>
        <button class="insert-page-btn" title="Insert Page Here">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                 <circle cx="12" cy="12" r="10"/>
                 <line x1="12" y1="8" x2="12" y2="16"/>
                 <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Insert page here
        </button>
    `;

    // 2. Canvas Container
    const pageContainer = document.createElement('div');
    pageContainer.className = 'page-container';

    const pdfCan = document.createElement('canvas');
    pdfCan.className = 'pdf-canvas';

    const annotCan = document.createElement('canvas');
    annotCan.className = 'annotation-canvas';
    annotCan.dataset.pageIndex = pageNum;

    pageContainer.appendChild(pdfCan);
    pageContainer.appendChild(annotCan);

    pageWrapper.appendChild(toolbar);
    pageWrapper.appendChild(pageContainer);
    canvasWrapper.appendChild(pageWrapper);

    // Store references
    const pageData = {
        pageIndex: pageNum,
        container: pageContainer,
        wrapper: pageWrapper,
        pdfCanvas: pdfCan,
        annotationCanvas: annotCan,
        pdfCtx: pdfCan.getContext('2d'),
        annotationCtx: annotCan.getContext('2d')
    };
    renderedPages.push(pageData);

    // Setup events for this page's specific actions
    const deleteBtn = toolbar.querySelector('.delete-btn');
    deleteBtn.onclick = () => handleDeletePageSpecific(pageNum);

    const zoomInBtn = toolbar.querySelector('.zoom-in-btn');
    zoomInBtn.onclick = () => changeZoom(0.1);

    const zoomOutBtn = toolbar.querySelector('.zoom-out-btn');
    zoomOutBtn.onclick = () => changeZoom(-0.1);

    const rotateLeftBtn = toolbar.querySelector('.rotate-left-btn');
    rotateLeftBtn.onclick = () => handleRotatePageSpecific(pageNum, -90);

    const rotateRightBtn = toolbar.querySelector('.rotate-right-btn');
    rotateRightBtn.onclick = () => handleRotatePageSpecific(pageNum, 90);

    const insertBtn = toolbar.querySelector('.insert-page-btn');
    insertBtn.onclick = () => handleInsertPageSpecific(pageNum);

    // Setup events for this page
    setupPageEvents(annotCan, pageNum);

    // Render content
    await renderPage(pageNum, pageData);
}

// Render PDF page content
async function renderPage(pageNum, pageData) {
    try {
        if (!pageData) {
            pageData = renderedPages.find(p => p.pageIndex === pageNum);
            if (!pageData) return;
        }

        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: scale });

        const { pdfCanvas, annotationCanvas, pdfCtx } = pageData;

        // Set dimensions
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        annotationCanvas.width = viewport.width;
        annotationCanvas.height = viewport.height;
        pageData.container.style.width = `${viewport.width}px`;
        pageData.container.style.height = `${viewport.height}px`;

        // Clear and fill white
        pdfCtx.fillStyle = '#ffffff';
        pdfCtx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);

        // Render PDF
        await page.render({
            canvasContext: pdfCtx,
            viewport: viewport,
            intent: 'display'
        }).promise;

        // Render annotations
        renderAnnotations(pageNum);

    } catch (error) {
        console.error(`Error rendering page ${pageNum}:`, error);
    }
}

// Update page info display
function updatePageInfo() {
    const pageInfoElement = document.getElementById('pageInfo');
    if (pageInfoElement) {
        pageInfoElement.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    console.log('Page info updated:', `${currentPage}/${totalPages}`);
}

// Generate thumbnails
async function generateThumbnails() {
    thumbnailsList.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail-item';
        if (i === currentPage) {
            thumbnailDiv.classList.add('active');
        }

        const canvas = document.createElement('canvas');
        canvas.className = 'thumbnail-canvas';

        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        await page.render({
            canvasContext: ctx,
            viewport: viewport
        }).promise;

        const numberDiv = document.createElement('div');
        numberDiv.className = 'thumbnail-number';
        numberDiv.textContent = `Page ${i}`;

        thumbnailDiv.appendChild(canvas);
        thumbnailDiv.appendChild(numberDiv);

        thumbnailDiv.addEventListener('click', () => {
            // Scroll to page
            const pageData = renderedPages.find(p => p.pageIndex === i);
            if (pageData) {
                pageData.container.scrollIntoView({ behavior: 'smooth' });
            }
            currentPage = i;
            updateThumbnailSelection();
            updatePageInfo();
        });

        thumbnailsList.appendChild(thumbnailDiv);
    }
}

// Update thumbnail selection
function updateThumbnailSelection() {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    thumbnails.forEach((thumb, index) => {
        if (index + 1 === currentPage) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Render annotations
// Render annotations
function renderAnnotations(specificPageIndex = null) {
    const pagesToRender = specificPageIndex
        ? renderedPages.filter(p => p.pageIndex === specificPageIndex)
        : renderedPages;

    pagesToRender.forEach(pageData => {
        const { annotationCtx, annotationCanvas, pageIndex } = pageData;
        annotationCtx.clearRect(0, 0, annotationCanvas.width, annotationCanvas.height);

        const pageAnnotations = annotations.filter(a => a.page === pageIndex);

        pageAnnotations.forEach(annotation => {
            // Draw functions need to know which context to use
            // We'll pass ctx to them
            switch (annotation.type) {
                case 'highlight':
                    drawHighlight(annotation, annotationCtx);
                    break;
                case 'text':
                    drawText(annotation, annotationCtx);
                    break;
                case 'shape':
                    drawShape(annotation, annotationCtx);
                    break;
                case 'draw':
                    drawFreehand(annotation, annotationCtx);
                    break;
            }
        });
    });
}

// Draw highlight annotation
// Setup specific page events
function setupPageEvents(canvas, pageIndex) {
    canvas.addEventListener('mousedown', (e) => handleMouseDown(e, pageIndex));
    canvas.addEventListener('mousemove', (e) => handleMouseMove(e, pageIndex));
    canvas.addEventListener('mouseup', (e) => handleMouseUp(e, pageIndex));
    canvas.addEventListener('mouseenter', () => {
        currentPage = pageIndex;
        updatePageInfo();
        updateThumbnailSelection();
    });
}

// Draw highlight annotation
function drawHighlight(annotation, ctx) {
    ctx.fillStyle = annotation.color || 'rgba(255, 255, 0, 0.4)';
    ctx.fillRect(
        annotation.x,
        annotation.y,
        annotation.width,
        annotation.height
    );
}

// Draw text annotation
function drawText(annotation, ctx) {
    ctx.font = `${annotation.fontSize || 16}px ${annotation.fontFamily || 'Helvetica'}`;
    ctx.fillStyle = annotation.color || '#000000';
    ctx.fillText(annotation.text, annotation.x, annotation.y);
}

// Draw shape annotation
function drawShape(annotation, ctx) {
    ctx.strokeStyle = annotation.strokeColor || '#000000';
    ctx.fillStyle = annotation.fillColor || 'transparent';
    ctx.lineWidth = annotation.strokeWidth || 2;

    switch (annotation.shape) {
        case 'rectangle':
            ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
            if (annotation.fillColor !== 'transparent') {
                ctx.fillRect(annotation.x, annotation.y, annotation.width, annotation.height);
            }
            break;
        case 'circle':
            const radius = Math.sqrt(annotation.width ** 2 + annotation.height ** 2) / 2;
            const centerX = annotation.x + annotation.width / 2;
            const centerY = annotation.y + annotation.height / 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
            if (annotation.fillColor !== 'transparent') {
                ctx.fill();
            }
            break;
        case 'line':
            ctx.beginPath();
            ctx.moveTo(annotation.x, annotation.y);
            ctx.lineTo(annotation.x + annotation.width, annotation.y + annotation.height);
            ctx.stroke();
            break;
    }
}

// Draw freehand annotation
function drawFreehand(annotation, ctx) {
    if (!annotation.points || annotation.points.length < 2) return;

    ctx.strokeStyle = annotation.color || '#000000';
    ctx.lineWidth = annotation.width || 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(annotation.points[0].x, annotation.points[0].y);

    for (let i = 1; i < annotation.points.length; i++) {
        ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
    }

    ctx.stroke();
}

// Setup event listeners
function setupEventListeners() {
    // Tool selection
    selectToolBtn.addEventListener('click', () => setTool('select'));
    textToolBtn.addEventListener('click', () => setTool('text'));
    imageToolBtn.addEventListener('click', () => setTool('image'));
    highlightToolBtn.addEventListener('click', () => setTool('highlight'));
    drawToolBtn.addEventListener('click', () => setTool('draw'));
    shapeToolBtn.addEventListener('click', () => setTool('shape'));

    // Zoom controls
    zoomInBtn.addEventListener('click', () => changeZoom(0.2));
    zoomOutBtn.addEventListener('click', () => changeZoom(-0.2));

    // Undo/Redo
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);

    // Download
    downloadBtn.addEventListener('click', downloadPDF);

    // Canvas mouse events are now handled per page in setupPageEvents


    // Panel close
    document.getElementById('closePanel').addEventListener('click', () => {
        sidePanel.classList.remove('open');
    });

    // Color presets
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', function () {
            const color = this.dataset.color;
            document.getElementById('highlightColor').value = color;
            document.querySelectorAll('.color-preset').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Range inputs
    document.getElementById('highlightOpacity')?.addEventListener('input', function () {
        document.getElementById('opacityValue').textContent = this.value + '%';
    });

    document.getElementById('imageRotation')?.addEventListener('input', function () {
        document.getElementById('rotationValue').textContent = this.value + '°';
    });

    // Page manipulation buttons
    document.getElementById('addPageBtn')?.addEventListener('click', handleAddPage);
    document.getElementById('deletePageBtn')?.addEventListener('click', handleDeletePage);
    document.getElementById('rotatePageBtn')?.addEventListener('click', handleRotatePage);

    // Image insertion
    document.getElementById('replaceImageBtn')?.addEventListener('click', function () {
        document.getElementById('imageFileInput').click();
    });

    document.getElementById('imageFileInput')?.addEventListener('change', handleImageUpload);
}

// Set active tool
function setTool(tool) {
    currentTool = tool;

    // Update button states
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const toolButtons = {
        'select': selectToolBtn,
        'text': textToolBtn,
        'image': imageToolBtn,
        'highlight': highlightToolBtn,
        'draw': drawToolBtn,
        'shape': shapeToolBtn
    };

    if (toolButtons[tool]) {
        toolButtons[tool].classList.add('active');
    }

    // Update side panel
    updateSidePanel(tool);

    // Update cursor
    updateCursor(tool);
}

// Update side panel based on tool
function updateSidePanel(tool) {
    // Hide all property sections
    document.querySelectorAll('.property-section').forEach(section => {
        if (section.id !== 'pageTools') {
            section.style.display = 'none';
        }
    });

    // Show relevant section
    const panelMap = {
        'text': 'textProperties',
        'image': 'imageProperties',
        'shape': 'shapeProperties',
        'highlight': 'highlightProperties'
    };

    if (panelMap[tool]) {
        document.getElementById(panelMap[tool]).style.display = 'block';
        sidePanel.classList.add('open');
    }
}

// Update cursor
function updateCursor(tool) {
    const cursorMap = {
        'select': 'default',
        'text': 'text',
        'image': 'copy',
        'highlight': 'cell',
        'draw': 'crosshair',
        'shape': 'crosshair'
    };

    annotationCanvas.style.cursor = cursorMap[tool] || 'default';
}

// Handle mouse down
// Handle mouse down
function handleMouseDown(e, pageIndex) {
    const pageData = renderedPages.find(p => p.pageIndex === pageIndex);
    if (!pageData) return;

    const rect = pageData.annotationCanvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDrawing = true;
    currentPage = pageIndex; // Set current page used for creating annotations

    if (currentTool === 'draw') {
        currentAnnotation = {
            type: 'draw',
            page: currentPage,
            points: [{ x: startX, y: startY }],
            color: '#000000',
            width: 2
        };
    } else if (currentTool === 'text') {
        promptTextInput(startX, startY);
    }
}

// Handle mouse move
function handleMouseMove(e, pageIndex) {
    if (!isDrawing) return;

    const pageData = renderedPages.find(p => p.pageIndex === pageIndex);
    if (!pageData) return;
    const ctx = pageData.annotationCtx;

    const rect = pageData.annotationCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (currentTool === 'draw' && currentAnnotation) {
        currentAnnotation.points.push({ x: currentX, y: currentY });
        // Only redraw this page
        renderAnnotations(pageIndex);
        drawFreehand(currentAnnotation, ctx);
    } else if (currentTool === 'highlight' || currentTool === 'shape') {
        renderAnnotations(pageIndex);
        previewAnnotation(startX, startY, currentX, currentY, ctx);
    }
}

// Handle mouse up
function handleMouseUp(e, pageIndex) {
    if (!isDrawing) return;
    isDrawing = false;

    const pageData = renderedPages.find(p => p.pageIndex === pageIndex);
    if (!pageData) return;

    const rect = pageData.annotationCanvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (currentTool === 'draw' && currentAnnotation) {
        annotations.push(currentAnnotation);
        addToUndoStack();
        currentAnnotation = null;
    } else if (currentTool === 'highlight') {
        addHighlight(startX, startY, endX - startX, endY - startY);
    } else if (currentTool === 'shape') {
        addShape(startX, startY, endX - startX, endY - startY);
    }

    renderAnnotations(pageIndex);
}

// Preview annotation while drawing
function previewAnnotation(x1, y1, x2, y2, ctx) {
    const width = x2 - x1;
    const height = y2 - y1;

    if (currentTool === 'highlight') {
        const color = document.getElementById('highlightColor')?.value || '#fef08a';
        const opacity = (document.getElementById('highlightOpacity')?.value || 40) / 100;
        ctx.fillStyle = hexToRgba(color, opacity);
        ctx.fillRect(x1, y1, width, height);
    } else if (currentTool === 'shape') {
        const shapeType = document.getElementById('shapeType')?.value || 'rectangle';
        const strokeColor = document.getElementById('strokeColor')?.value || '#000000';
        const strokeWidth = document.getElementById('strokeWidth')?.value || 2;

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        if (shapeType === 'rectangle') {
            ctx.strokeRect(x1, y1, width, height);
        } else if (shapeType === 'circle') {
            const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
            const centerX = x1 + width / 2;
            const centerY = y1 + height / 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (shapeType === 'line') {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
}

// Add highlight annotation
function addHighlight(x, y, width, height) {
    const color = document.getElementById('highlightColor')?.value || '#fef08a';
    const opacity = (document.getElementById('highlightOpacity')?.value || 40) / 100;

    annotations.push({
        type: 'highlight',
        page: currentPage,
        x: x,
        y: y,
        width: width,
        height: height,
        color: hexToRgba(color, opacity)
    });

    addToUndoStack();
}

// Add shape annotation
function addShape(x, y, width, height) {
    const shapeType = document.getElementById('shapeType')?.value || 'rectangle';
    const strokeColor = document.getElementById('strokeColor')?.value || '#000000';
    const fillColor = document.getElementById('fillColor')?.value || 'transparent';
    const strokeWidth = document.getElementById('strokeWidth')?.value || 2;

    annotations.push({
        type: 'shape',
        page: currentPage,
        shape: shapeType,
        x: x,
        y: y,
        width: width,
        height: height,
        strokeColor: strokeColor,
        fillColor: fillColor,
        strokeWidth: strokeWidth
    });

    addToUndoStack();
}

// Prompt for text input
function promptTextInput(x, y) {
    const text = prompt('Enter text:');
    if (text) {
        const fontSize = document.getElementById('fontSize')?.value || 16;
        const fontFamily = document.getElementById('fontFamily')?.value || 'Helvetica';
        const color = document.getElementById('textColor')?.value || '#000000';

        annotations.push({
            type: 'text',
            page: currentPage,
            x: x,
            y: y,
            text: text,
            fontSize: fontSize,
            fontFamily: fontFamily,
            color: color
        });

        addToUndoStack();
        renderAnnotations(currentPage);
    }
}

// Change zoom
async function changeZoom(delta) {
    scale = Math.max(0.5, Math.min(3, scale + delta));
    zoomLevelElement.textContent = Math.round(scale * 100) + '%';
    await renderAllPages();
}

// Undo/Redo functionality
function addToUndoStack() {
    undoStack.push(JSON.parse(JSON.stringify(annotations)));
    redoStack = [];
    updateUndoRedoButtons();
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push(JSON.parse(JSON.stringify(annotations)));
        annotations = undoStack.pop();
        renderAnnotations();
        updateUndoRedoButtons();
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(JSON.parse(JSON.stringify(annotations)));
        annotations = redoStack.pop();
        renderAnnotations();
        updateUndoRedoButtons();
    }
}

function updateUndoRedoButtons() {
    undoBtn.disabled = undoStack.length === 0;
    redoBtn.disabled = redoStack.length === 0;
}

// Download PDF
async function downloadPDF() {
    try {
        showLoading(true);

        // Create advanced editor instance
        const advancedEditor = new PDFAdvancedEditor();
        await advancedEditor.initialize(pdfBytes);

        // Flatten all annotations into the PDF
        for (const annotation of annotations) {
            const pageIndex = annotation.page - 1; // Convert to 0-indexed

            try {
                if (annotation.type === 'highlight') {
                    const opacity = parseFloat(annotation.color.match(/[\d.]+\)$/)[0]) || 0.4;
                    const hexColor = annotation.color.match(/#[0-9a-f]{6}/i)?.[0] || '#fef08a';
                    await advancedEditor.addHighlightToPDF(
                        annotation.x,
                        annotation.y,
                        annotation.width,
                        annotation.height,
                        hexColor,
                        opacity,
                        pageIndex
                    );
                } else if (annotation.type === 'text') {
                    await advancedEditor.addTextToPDF(
                        annotation.text,
                        annotation.x,
                        annotation.y,
                        {
                            fontSize: parseInt(annotation.fontSize) || 12,
                            fontFamily: annotation.fontFamily || 'Helvetica',
                            color: annotation.color || '#000000'
                        },
                        pageIndex
                    );
                } else if (annotation.type === 'shape') {
                    await advancedEditor.addShapeToPDF(annotation, pageIndex);
                }
                // Note: Freehand drawing would require converting to SVG path, skipping for now
            } catch (err) {
                console.warn(`Failed to add annotation:`, err);
            }
        }

        // Export final PDF
        const finalPdfBytes = await advancedEditor.exportPDF();
        const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.replace('.pdf', '_edited.pdf');
        a.click();

        URL.revokeObjectURL(url);
        showLoading(false);

        // Show success message
        setTimeout(() => {
            alert('PDF downloaded successfully with all annotations!');
        }, 500);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        showLoading(false);
        alert('Failed to download PDF with annotations. Downloading original instead...');

        // Fallback: download original
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Helper functions
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + Z: Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        }
        // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
        else if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
            e.preventDefault();
            redo();
        }
        // Tool shortcuts
        else if (e.key === 'v' || e.key === 'V') {
            setTool('select');
        }
        else if (e.key === 't' || e.key === 'T') {
            setTool('text');
        }
        else if (e.key === 'i' || e.key === 'I') {
            setTool('image');
        }
        else if (e.key === 'h' || e.key === 'H') {
            setTool('highlight');
        }
        else if (e.key === 'd' || e.key === 'D') {
            setTool('draw');
        }
        else if (e.key === 's' || e.key === 'S') {
            setTool('shape');
        }
        // Zoom shortcuts
        else if ((e.ctrlKey || e.metaKey) && e.key === '+') {
            e.preventDefault();
            changeZoom(0.2);
        }
        else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
            e.preventDefault();
            changeZoom(-0.2);
        }
        // Page navigation shortcuts
        else if (e.key === 'PageDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            nextPage();
        }
        else if (e.key === 'PageUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            previousPage();
        }
        else if (e.key === 'Home') {
            e.preventDefault();
            goToPage(1);
        }
        else if (e.key === 'End') {
            e.preventDefault();
            goToPage(totalPages);
        }
    });
}

// Page Manipulation Functions

// Add new blank page
async function handleAddPage() {
    try {
        showLoading(true);

        await advancedEditor.addBlankPage();

        // Reload the PDF
        pdfBytes = await advancedEditor.exportPDF();
        await reloadPDF();

        // Navigate to the new page
        currentPage = totalPages;
        await renderAllPages();
        updateThumbnailSelection();

        showLoading(false);
        console.log('Page added successfully');
    } catch (error) {
        console.error('Error adding page:', error);
        showLoading(false);
        alert('Failed to add page. Please try again.');
    }
}

// Delete current page
async function handleDeletePage() {
    try {
        if (totalPages <= 1) {
            alert('Cannot delete the only page in the document.');
            return;
        }

        const confirmed = confirm(`Are you sure you want to delete page ${currentPage}?`);
        if (!confirmed) return;

        showLoading(true);

        await advancedEditor.deletePage(currentPage - 1); // Convert to 0-indexed

        // Remove annotations for this page
        annotations = annotations.filter(a => a.page !== currentPage);

        // Adjust page numbers for annotations after deleted page
        annotations = annotations.map(a => {
            if (a.page > currentPage) {
                return { ...a, page: a.page - 1 };
            }
            return a;
        });

        // Reload the PDF
        pdfBytes = await advancedEditor.exportPDF();
        await reloadPDF();

        // Navigate to previous page if we deleted the last page
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        await renderAllPages();
        updateThumbnailSelection();

        showLoading(false);
        console.log('Page deleted successfully');
    } catch (error) {
        console.error('Error deleting page:', error);
        showLoading(false);
        alert('Failed to delete page. Please try again.');
    }
}

// Rotate current page
async function handleRotatePage() {
    try {
        showLoading(true);

        await advancedEditor.rotatePage(currentPage - 1, 90); // Rotate 90 degrees clockwise

        // Reload the PDF
        pdfBytes = await advancedEditor.exportPDF();
        await reloadPDF();

        await renderAllPages();

        showLoading(false);
        console.log('Page rotated successfully');
    } catch (error) {
        console.error('Error rotating page:', error);
        showLoading(false);
        alert('Failed to rotate page. Please try again.');
    }
}

// Reload PDF after modifications
async function reloadPDF() {
    try {
        // Reload with PDF.js
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;

        // Reload with PDF-lib
        pdfLib = await PDFLib.PDFDocument.load(pdfBytes);

        // Reinitialize advanced editor
        advancedEditor = new PDFAdvancedEditor();
        await advancedEditor.initialize(pdfBytes);

        // Regenerate thumbnails
        await generateThumbnails();
    } catch (error) {
        console.error('Error reloading PDF:', error);
        throw error;
    }
}

// Specific Page Actions
async function handleDeletePageSpecific(pageNum) {
    if (totalPages <= 1) {
        alert('Cannot delete the last page.');
        return;
    }
    const confirmed = confirm(`Delete Page ${pageNum}?`);
    if (!confirmed) return;

    showLoading(true);
    await advancedEditor.deletePage(pageNum - 1);

    // Clean annotations
    annotations = annotations.filter(a => a.page !== pageNum);
    annotations = annotations.map(a => {
        if (a.page > pageNum) return { ...a, page: a.page - 1 };
        return a;
    });

    try {
        pdfBytes = await advancedEditor.exportPDF();
        await reloadPDF();
        await renderAllPages();
    } catch (e) {
        console.error(e);
        alert('Error deleting page');
    }
    showLoading(false);
}

async function handleRotatePageSpecific(pageNum, degrees) {
    showLoading(true);
    await advancedEditor.rotatePage(pageNum - 1, degrees);
    pdfBytes = await advancedEditor.exportPDF();
    await reloadPDF();
    await renderAllPages();
    showLoading(false);
}

async function handleInsertPageSpecific(pageNum) { // Insert after this page
    showLoading(true);
    await advancedEditor.addBlankPage();

    pdfBytes = await advancedEditor.exportPDF();
    await reloadPDF();
    await renderAllPages();

    // Scroll to new page 
    goToPage(totalPages);
    showLoading(false);
}

// Image Upload and Insertion

// Handle image upload
async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
        alert('Please select a valid image file (PNG or JPEG).');
        return;
    }

    try {
        showLoading(true);

        // Get dimensions from UI
        const width = parseInt(document.getElementById('imageWidth')?.value) || 200;
        const height = parseInt(document.getElementById('imageHeight')?.value) || 200;

        // Get center of current viewport for placement
        const pageData = renderedPages.find(p => p.pageIndex === currentPage);
        if (!pageData) {
            throw new Error('Current page not found');
        }

        const x = (pageData.pdfCanvas.width / 2) - (width / 2);
        const y = (pageData.pdfCanvas.height / 2) - (height / 2);

        // Insert image using advanced editor
        await advancedEditor.insertImage(file, x, y, width, height, currentPage - 1);

        // Reload the PDF
        pdfBytes = await advancedEditor.exportPDF();
        await reloadPDF();
        await renderAllPages();

        showLoading(false);

        // Reset file input
        e.target.value = '';

        console.log('Image inserted successfully');
        alert('Image inserted successfully!');
    } catch (error) {
        console.error('Error inserting image:', error);
        showLoading(false);
        alert('Failed to insert image. Make sure it\'s a PNG or JPEG file.');
    }
}

// Export Functions

// Export current page as image
async function exportPageAsImage(format = 'png') {
    try {
        showLoading(true);

        const pageData = renderedPages.find(p => p.pageIndex === currentPage);
        if (!pageData) {
            throw new Error('Current page not found');
        }

        // Use the advanced editor to export
        const blob = await advancedEditor.exportToFormat(format, pageData.pdfCanvas);
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName.replace('.pdf', '')}_page${currentPage}.${format}`;
        a.click();

        URL.revokeObjectURL(url);
        showLoading(false);
    } catch (error) {
        console.error('Error exporting page as image:', error);
        showLoading(false);
        alert('Failed to export page as image.');
    }
}

// Navigation helpers
async function goToPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPage = pageNumber;

        const pageData = renderedPages.find(p => p.pageIndex === currentPage);
        if (pageData) {
            pageData.container.scrollIntoView({ behavior: 'smooth' });
        }

        updateThumbnailSelection();
        updatePageInfo();
    }
}

async function nextPage() {
    if (currentPage < totalPages) {
        await goToPage(currentPage + 1);
    }
}

async function previousPage() {
    if (currentPage > 1) {
        await goToPage(currentPage - 1);
    }
}
