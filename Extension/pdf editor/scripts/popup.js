// Popup script for PDF Pro Editor
document.addEventListener('DOMContentLoaded', function () {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const recentSection = document.getElementById('recentSection');
    const recentFiles = document.getElementById('recentFiles');

    // Initialize - load recent files
    loadRecentFiles();

    // Upload button click
    uploadBtn.addEventListener('click', function () {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', async function (e) {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            await openPDFInEditor(file);
        }
    });

    // Drag and drop functionality
    const uploadSection = document.querySelector('.upload-section');

    uploadSection.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadSection.style.opacity = '0.7';
        uploadSection.style.transform = 'scale(0.98)';
    });

    uploadSection.addEventListener('dragleave', function (e) {
        e.preventDefault();
        uploadSection.style.opacity = '1';
        uploadSection.style.transform = 'scale(1)';
    });

    uploadSection.addEventListener('drop', async function (e) {
        e.preventDefault();
        uploadSection.style.opacity = '1';
        uploadSection.style.transform = 'scale(1)';

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            fileInput.files = e.dataTransfer.files;
            await openPDFInEditor(file);
        }
    });

    // Open PDF in editor
    async function openPDFInEditor(file) {
        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.onload = async function (e) {
                const arrayBuffer = e.target.result;
                const uint8Array = new Uint8Array(arrayBuffer);

                // Validate PDF Header
                const header = String.fromCharCode.apply(null, uint8Array.slice(0, 5));
                if (header !== '%PDF-') {
                    alert('Invalid PDF file selected (No PDF header found). Please select a valid PDF.');
                    return;
                }

                // Save to storage
                await chrome.storage.local.set({
                    currentPDF: {
                        name: file.name,
                        data: Array.from(uint8Array),
                        timestamp: Date.now()
                    }
                });

                // Update recent files
                await addToRecentFiles(file.name, Date.now());

                // Open NEW simplified editor in new tab
                const editorUrl = chrome.runtime.getURL('editor-simple.html');
                chrome.tabs.create({ url: editorUrl });
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error opening PDF:', error);
            alert('Failed to open PDF file. Please try again.');
        }
    }

    // Load recent files from storage
    async function loadRecentFiles() {
        try {
            const result = await chrome.storage.local.get(['recentFiles']);
            const files = result.recentFiles || [];

            if (files.length > 0) {
                recentSection.style.display = 'block';
                recentFiles.innerHTML = '';

                files.slice(0, 5).forEach(file => {
                    const fileElement = createRecentFileElement(file);
                    recentFiles.appendChild(fileElement);
                });
            }
        } catch (error) {
            console.error('Error loading recent files:', error);
        }
    }

    // Create recent file element
    function createRecentFileElement(file) {
        const div = document.createElement('div');
        div.className = 'recent-file';

        const date = new Date(file.timestamp);
        const dateString = formatDate(date);

        div.innerHTML = `
            <div class="recent-file-icon">📄</div>
            <div class="recent-file-info">
                <div class="recent-file-name">${file.name}</div>
                <div class="recent-file-date">${dateString}</div>
            </div>
        `;

        div.addEventListener('click', () => {
            // Open this file if it's still in storage
            openRecentFile(file.name);
        });

        return div;
    }

    // Format date
    function formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            if (hours === 0) {
                const minutes = Math.floor(diff / (1000 * 60));
                return minutes === 0 ? 'Just now' : `${minutes}m ago`;
            }
            return `${hours}h ago`;
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // Add to recent files
    async function addToRecentFiles(fileName, timestamp) {
        try {
            const result = await chrome.storage.local.get(['recentFiles']);
            let files = result.recentFiles || [];

            // Remove duplicate if exists
            files = files.filter(f => f.name !== fileName);

            // Add new file at the beginning
            files.unshift({ name: fileName, timestamp: timestamp });

            // Keep only last 10 files
            files = files.slice(0, 10);

            await chrome.storage.local.set({ recentFiles: files });
        } catch (error) {
            console.error('Error adding to recent files:', error);
        }
    }

    // Open recent file
    async function openRecentFile(fileName) {
        const editorUrl = chrome.runtime.getURL('editor.html');
        chrome.tabs.create({ url: editorUrl });
    }

    // Feature items click effects
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('click', function () {
            // Add a subtle animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
});
