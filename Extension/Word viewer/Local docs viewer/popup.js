import { db } from './utils/db.js';

const fileInput = document.getElementById('fileInput');
const importBtn = document.getElementById('importBtn');
const fileList = document.getElementById('fileList');
const searchInput = document.getElementById('searchInput');
const dropZone = document.getElementById('dropZone');

// Format bytes
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Get icon
function getFileIcon(type, name) {
    const n = name.toLowerCase();
    if (n.endsWith('.pdf')) return '📄'; // use SVG if you want, sticking to emoji for now or simpler
    if (n.endsWith('.docx') || n.endsWith('.doc')) return '📝';
    if (n.endsWith('.txt') || n.endsWith('.md')) return '📑';
    return '📄';
}

async function renderFiles(filter = '') {
    try {
        const files = await db.getAllFiles();

        // Filter
        const filtered = files.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()));

        fileList.innerHTML = '';

        if (files.length === 0) {
            fileList.innerHTML = `<div class="empty-state"><p>No documents yet.</p><small>Import .docx, .pdf, .txt to get started.</small></div>`;
            return;
        }

        if (filtered.length === 0) {
            fileList.innerHTML = `<div class="empty-state"><p>No matches found.</p></div>`;
            return;
        }

        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        filtered.forEach(file => {
            const el = document.createElement('div');
            el.className = 'file-card';

            const iconDiv = document.createElement('div');
            iconDiv.className = 'file-icon';
            iconDiv.textContent = getFileIcon(file.type, file.name);
            el.appendChild(iconDiv);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'file-info';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'file-name';
            nameDiv.title = file.name;
            nameDiv.textContent = file.name;
            infoDiv.appendChild(nameDiv);

            const metaDiv = document.createElement('div');
            metaDiv.className = 'file-meta';
            metaDiv.textContent = `${formatBytes(file.size)} • ${new Date(file.date).toLocaleDateString()}`;
            infoDiv.appendChild(metaDiv);

            el.appendChild(infoDiv);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.title = 'Delete';

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '18');
            svg.setAttribute('height', '18');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');

            const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyline.setAttribute('points', '3 6 5 6 21 6');
            svg.appendChild(polyline);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2');
            svg.appendChild(path);

            deleteBtn.appendChild(svg);
            el.appendChild(deleteBtn);

            el.onclick = (e) => {
                if (e.target.closest('.delete-btn')) return;
                chrome.tabs.create({ url: `viewer.html?id=${file.id}` });
            };

            el.querySelector('.delete-btn').onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm(`Delete ${file.name}?`)) {
                    await db.deleteFile(file.id);
                    renderFiles(searchInput.value);
                }
            };

            fileList.appendChild(el);
        });
    } catch (err) {
        console.error(err);
    }
}

async function handleFiles(files) {
    if (!files || !files.length) return;

    // Show some loading state if needed
    for (const file of files) {
        try {
            await db.addFile(file);
        } catch (err) {
            console.error(err);
            alert('Failed to import ' + file.name);
        }
    }
    renderFiles(searchInput.value);
}

async function clearAllFiles() {
    if (!confirm('⚠️ Delete ALL documents?\n\nThis will permanently remove all stored documents. This action cannot be undone.\n\nNote: If you\'re experiencing file corruption errors, clearing all files and re-importing fresh copies will fix the issue.')) {
        return;
    }

    try {
        const files = await db.getAllFiles();
        for (const file of files) {
            await db.deleteFile(file.id);
        }
        renderFiles();
        alert('✅ All documents cleared successfully!\n\nYou can now import fresh copies of your files.');
    } catch (err) {
        console.error(err);
        alert('Failed to clear files: ' + err.message);
    }
}

// Event Listeners
const clearAllBtn = document.getElementById('clearAllBtn');

importBtn.addEventListener('click', () => {
    fileInput.click();
});

clearAllBtn.addEventListener('click', clearAllFiles);

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
    fileInput.value = '';
});

searchInput.addEventListener('input', (e) => {
    renderFiles(e.target.value);
});

// Drag and Drop
document.body.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.remove('hidden');
});

document.body.addEventListener('dragleave', (e) => {
    if (e.relatedTarget === null) {
        dropZone.classList.add('hidden');
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.add('hidden');
    dropZone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
});

renderFiles();
