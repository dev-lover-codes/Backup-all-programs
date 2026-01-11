// Main Export Orchestrator
// Coordinates all export formats and handles conversation preprocessing

class Exporter {
    constructor() {
        this.formats = {
            pdf: null,      // Will be loaded dynamically
            word: null,     // Will be loaded dynamically
            markdown: null,
            txt: null,
            html: null
        };
    }

    // Main export function
    async export(conversation, format, options = {}) {
        console.log(`Exporting conversation as ${format}`, options);

        if (!conversation || !conversation.messages || conversation.messages.length === 0) {
            throw new Error('No conversation data provided');
        }

        // Merge with default options
        const exportOptions = {
            theme: 'light',
            includeTimestamps: true,
            includeLabels: true,
            includeCoverPage: true,
            fontSize: 12,
            fontFamily: 'Inter',
            ...options
        };

        // Preprocess conversation
        const processedConv = this.preprocessConversation(conversation, exportOptions);

        // Route to appropriate exporter
        let result;

        switch (format.toLowerCase()) {
            case 'pdf':
                result = await this.exportToPDF(processedConv, exportOptions);
                break;
            case 'word':
            case 'docx':
                result = await this.exportToWord(processedConv, exportOptions);
                break;
            case 'markdown':
            case 'md':
                result = await this.exportToMarkdown(processedConv, exportOptions);
                break;
            case 'txt':
            case 'text':
                result = await this.exportToText(processedConv, exportOptions);
                break;
            case 'html':
                result = await this.exportToHTML(processedConv, exportOptions);
                break;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }

        return result;
    }

    // Preprocess conversation
    preprocessConversation(conversation, options) {
        const processed = {
            ...conversation,
            messages: conversation.messages.map(msg => ({
                ...msg,
                cleanContent: this.cleanHTML(msg.content),
                timestamp: msg.timestamp || Date.now()
            }))
        };

        // Filter out system messages if needed
        if (!options.includeSystemMessages) {
            processed.messages = processed.messages.filter(msg =>
                msg.role !== 'system'
            );
        }

        return processed;
    }

    // Clean HTML content
    cleanHTML(html) {
        if (!html) return '';

        // Convert to plain text while preserving structure
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Remove scripts and styles
        temp.querySelectorAll('script, style').forEach(el => el.remove());

        return temp.textContent || temp.innerText || '';
    }

    // Export to PDF
    async exportToPDF(conversation, options) {
        // Dynamically import jsPDF and html2canvas
        if (!window.jsPDF) {
            throw new Error('PDF library not loaded. Please ensure jsPDF is included.');
        }

        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF();

        const isDark = options.theme === 'dark';
        const bgColor = isDark ? '#1f2937' : '#ffffff';
        const textColor = isDark ? '#e5e7eb' : '#111827';
        const accentColor = '#667eea';

        let yPosition = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // Helper to add new page if needed
        const checkPageBreak = (requiredSpace = 20) => {
            if (yPosition + requiredSpace > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
                return true;
            }
            return false;
        };

        // Cover page
        if (options.includeCoverPage) {
            // Background
            if (isDark) {
                doc.setFillColor(31, 41, 55);
                doc.rect(0, 0, pageWidth, pageHeight, 'F');
            }

            // Gradient simulation (using rectangles)
            doc.setFillColor(102, 126, 234);
            doc.rect(0, 0, pageWidth, 80, 'F');

            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(32);
            doc.setFont(undefined, 'bold');
            doc.text(conversation.title || 'ChatGPT Conversation', margin, 40);

            // Metadata
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`${conversation.messages.length} messages`, margin, 55);
            doc.text(new Date().toLocaleDateString(), margin, 65);

            // Reset
            doc.addPage();
            yPosition = margin;
        }

        // Set background for content pages
        if (isDark) {
            doc.setFillColor(31, 41, 55);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
        }

        // Messages
        doc.setTextColor(textColor);

        conversation.messages.forEach((message, index) => {
            checkPageBreak(30);

            // Role label
            if (options.includeLabels) {
                const roleLabel = message.role === 'user' ? 'You' : 'ChatGPT';
                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');

                if (message.role === 'user') {
                    doc.setTextColor(102, 126, 234);
                } else {
                    doc.setTextColor(16, 185, 129);
                }

                doc.text(roleLabel, margin, yPosition);
                yPosition += 7;

                doc.setTextColor(textColor);
            }

            // Timestamp
            if (options.includeTimestamps && message.timestamp) {
                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(156, 163, 175);
                doc.text(new Date(message.timestamp).toLocaleString(), margin, yPosition);
                yPosition += 5;
                doc.setTextColor(textColor);
            }

            // Message content
            doc.setFontSize(options.fontSize || 11);
            doc.setFont(undefined, 'normal');

            const content = message.cleanContent || message.content;
            const lines = doc.splitTextToSize(content, contentWidth);

            lines.forEach(line => {
                checkPageBreak();
                doc.text(line, margin, yPosition);
                yPosition += 6;
            });

            yPosition += 10; // Space between messages
        });

        // Save the PDF
        const filename = `${conversation.title || 'ChatGPT-Export'}-${Date.now()}.pdf`;
        doc.save(filename);

        return { success: true, filename };
    }

    // Export to Word
    async exportToWord(conversation, options) {
        // This would require the docx library
        // For now, we'll create a simplified version
        throw new Error('Word export requires the docx library. Please use PDF, Markdown, or HTML instead.');
    }

    // Export to Markdown
    async exportToMarkdown(conversation, options) {
        let markdown = '';

        // Title
        if (conversation.title) {
            markdown += `# ${conversation.title}\n\n`;
        }

        // Metadata
        markdown += `**Messages:** ${conversation.messages.length}  \n`;
        markdown += `**Exported:** ${new Date().toLocaleDateString()}  \n\n`;
        markdown += '---\n\n';

        // Messages
        conversation.messages.forEach((message, index) => {
            // Role
            if (options.includeLabels) {
                const roleLabel = message.role === 'user' ? '👤 **You**' : '🤖 **ChatGPT**';
                markdown += `${roleLabel}\n\n`;
            }

            // Timestamp
            if (options.includeTimestamps && message.timestamp) {
                markdown += `*${new Date(message.timestamp).toLocaleString()}*\n\n`;
            }

            // Content - try to preserve markdown if it exists
            const content = this.htmlToMarkdown(message.html || message.content);
            markdown += `${content}\n\n`;

            markdown += '---\n\n';
        });

        // Download
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const filename = `${conversation.title || 'ChatGPT-Export'}-${Date.now()}.md`;
        this.downloadBlob(blob, filename);

        return { success: true, filename };
    }

    // Export to Text
    async exportToText(conversation, options) {
        let text = '';

        // Title
        if (conversation.title) {
            text += `${conversation.title}\n`;
            text += '='.repeat(conversation.title.length) + '\n\n';
        }

        // Metadata
        text += `Messages: ${conversation.messages.length}\n`;
        text += `Exported: ${new Date().toLocaleDateString()}\n\n`;
        text += '-'.repeat(50) + '\n\n';

        // Messages
        conversation.messages.forEach((message, index) => {
            // Role
            if (options.includeLabels) {
                const roleLabel = message.role === 'user' ? 'YOU' : 'ChatGPT';
                text += `${roleLabel}\n`;
            }

            // Timestamp
            if (options.includeTimestamps && message.timestamp) {
                text += `${new Date(message.timestamp).toLocaleString()}\n`;
            }

            // Content
            const content = message.cleanContent || this.stripHTML(message.content);
            text += `\n${content}\n\n`;

            text += '-'.repeat(50) + '\n\n';
        });

        // Download
        const blob = new Blob([text], { type: 'text/plain' });
        const filename = `${conversation.title || 'ChatGPT-Export'}-${Date.now()}.txt`;
        this.downloadBlob(blob, filename);

        return { success: true, filename };
    }

    // Export to HTML
    async exportToHTML(conversation, options) {
        const isDark = options.theme === 'dark';

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${conversation.title || 'ChatGPT Conversation'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: ${isDark ? '#1f2937' : '#f9fafb'};
      color: ${isDark ? '#e5e7eb' : '#111827'};
      padding: 40px 20px;
      line-height: 1.6;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: ${isDark ? '#111827' : '#ffffff'};
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, ${isDark ? '0.3' : '0.1'});
    }
    
    h1 {
      font-size: 32px;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .metadata {
      font-size: 14px;
      color: ${isDark ? '#9ca3af' : '#6b7280'};
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid ${isDark ? '#374151' : '#e5e7eb'};
    }
    
    .message {
      margin-bottom: 30px;
      padding: 20px;
      border-radius: 12px;
      background: ${isDark ? '#1f2937' : '#f9fafb'};
    }
    
    .message.user {
      border-left: 4px solid #667eea;
    }
    
    .message.assistant {
      border-left: 4px solid #10b981;
    }
    
    .role {
      font-weight: 700;
      margin-bottom: 8px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .message.user .role {
      color: #667eea;
    }
    
    .message.assistant .role {
      color: #10b981;
    }
    
    .timestamp {
      font-size: 12px;
      color: ${isDark ? '#9ca3af' : '#9ca3af'};
      margin-bottom: 10px;
    }
    
    .content {
      font-size: 15px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    .content code {
      background: ${isDark ? '#374151' : '#f3f4f6'};
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 13px;
    }
    
    .content pre {
      background: ${isDark ? '#374151' : '#f3f4f6'};
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 10px 0;
    }
    
    @media print {
      body {
        background: white;
      }
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${conversation.title || 'ChatGPT Conversation'}</h1>
    
    <div class="metadata">
      <div><strong>Messages:</strong> ${conversation.messages.length}</div>
      <div><strong>Exported:</strong> ${new Date().toLocaleDateString()}</div>
    </div>
    
    ${conversation.messages.map((msg, idx) => `
      <div class="message ${msg.role}">
        ${options.includeLabels ? `<div class="role">${msg.role === 'user' ? 'You' : 'ChatGPT'}</div>` : ''}
        ${options.includeTimestamps && msg.timestamp ? `<div class="timestamp">${new Date(msg.timestamp).toLocaleString()}</div>` : ''}
        <div class="content">${msg.html || msg.content}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

        // Download
        const blob = new Blob([html], { type: 'text/html' });
        const filename = `${conversation.title || 'ChatGPT-Export'}-${Date.now()}.html`;
        this.downloadBlob(blob, filename);

        return { success: true, filename };
    }

    // HTML to Markdown converter
    htmlToMarkdown(html) {
        if (!html) return '';

        // Basic HTML to Markdown conversion
        let text = html;

        // Code blocks
        text = text.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '```\n$1\n```');

        // Inline code
        text = text.replace(/<code>(.*?)<\/code>/g, '`$1`');

        // Bold
        text = text.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
        text = text.replace(/<b>(.*?)<\/b>/g, '**$1**');

        // Italic
        text = text.replace(/<em>(.*?)<\/em>/g, '*$1*');
        text = text.replace(/<i>(.*?)<\/i>/g, '*$1*');

        // Links
        text = text.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');

        // Headers
        text = text.replace(/<h1>(.*?)<\/h1>/g, '# $1\n');
        text = text.replace(/<h2>(.*?)<\/h2>/g, '## $1\n');
        text = text.replace(/<h3>(.*?)<\/h3>/g, '### $1\n');

        // Lists
        text = text.replace(/<li>(.*?)<\/li>/g, '- $1\n');

        // Paragraphs
        text = text.replace(/<p>(.*?)<\/p>/g, '$1\n\n');

        // Line breaks
        text = text.replace(/<br\s*\/?>/g, '\n');

        // Remove remaining HTML tags
        text = text.replace(/<[^>]+>/g, '');

        // Decode HTML entities
        const temp = document.createElement('textarea');
        temp.innerHTML = text;
        text = temp.value;

        return text.trim();
    }

    // Strip all HTML
    stripHTML(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    }

    // Download blob helper
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Create global instance  
window.exporterInstance = new Exporter();

// Export conversation function
async function exportConversation(conversation, format, options) {
    return await window.exporterInstance.export(conversation, format, options);
}

// Make it available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Exporter, exportConversation };
}
