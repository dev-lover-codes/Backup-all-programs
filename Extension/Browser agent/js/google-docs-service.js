// Google Docs Service - Document automation and management
export class GoogleDocsService {
    constructor() {
        this.accessToken = null;
        this.docsApiUrl = 'https://docs.googleapis.com/v1/documents';
        this.driveApiUrl = 'https://www.googleapis.com/drive/v3/files';
    }

    async authenticate() {
        try {
            const token = await chrome.identity.getAuthToken({ interactive: true });
            this.accessToken = token.token;
            console.log('✅ Google Docs authenticated');
            return true;
        } catch (error) {
            console.error('❌ Google Docs authentication failed:', error);
            return false;
        }
    }

    async createDocument(title, content) {
        if (!this.accessToken) {
            await this.authenticate();
        }

        try {
            // Create new document
            const createResponse = await fetch(this.docsApiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title
                })
            });

            const doc = await createResponse.json();
            const documentId = doc.documentId;

            // Add content to document
            if (content) {
                await this.appendContent(documentId, content);
            }

            return {
                success: true,
                documentId,
                url: `https://docs.google.com/document/d/${documentId}/edit`
            };
        } catch (error) {
            console.error('Error creating document:', error);
            return { success: false, error: error.message };
        }
    }

    async appendContent(documentId, content) {
        const requests = [];

        // Parse content structure
        if (typeof content === 'string') {
            requests.push({
                insertText: {
                    location: { index: 1 },
                    text: content
                }
            });
        } else if (content.sections) {
            // Structured content with sections
            let index = 1;

            for (const section of content.sections) {
                // Add heading
                requests.push({
                    insertText: {
                        location: { index },
                        text: section.title + '\n'
                    }
                });

                // Style as heading
                requests.push({
                    updateParagraphStyle: {
                        range: {
                            startIndex: index,
                            endIndex: index + section.title.length + 1
                        },
                        paragraphStyle: {
                            namedStyleType: 'HEADING_1'
                        },
                        fields: 'namedStyleType'
                    }
                });

                index += section.title.length + 1;

                // Add content
                requests.push({
                    insertText: {
                        location: { index },
                        text: section.content + '\n\n'
                    }
                });

                index += section.content.length + 2;
            }
        }

        try {
            await fetch(`${this.docsApiUrl}/${documentId}:batchUpdate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requests })
            });

            return { success: true };
        } catch (error) {
            console.error('Error appending content:', error);
            return { success: false, error: error.message };
        }
    }

    async formatWikipediaData(wikiData) {
        const sections = [];

        // Title section
        sections.push({
            title: wikiData.title,
            content: wikiData.summary
        });

        // Infobox as a section
        if (wikiData.infobox && Object.keys(wikiData.infobox).length > 0) {
            let infoboxContent = '';
            for (const [key, value] of Object.entries(wikiData.infobox)) {
                infoboxContent += `${key}: ${value}\n`;
            }
            sections.push({
                title: 'Quick Facts',
                content: infoboxContent
            });
        }

        // Add other sections
        if (wikiData.sections) {
            sections.push(...wikiData.sections);
        }

        return { sections };
    }

    async exportToPDF(documentId, fileName) {
        try {
            const response = await fetch(
                `${this.driveApiUrl}/${documentId}/export?mimeType=application/pdf`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            const blob = await response.blob();

            // Download the PDF
            const url = URL.createObjectURL(blob);
            await chrome.downloads.download({
                url: url,
                filename: fileName || 'document.pdf',
                saveAs: true
            });

            return { success: true };
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            return { success: false, error: error.message };
        }
    }

    async listDocuments(maxResults = 10) {
        try {
            const response = await fetch(
                `${this.driveApiUrl}?q=mimeType='application/vnd.google-apps.document'&pageSize=${maxResults}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            const data = await response.json();
            return { success: true, documents: data.files };
        } catch (error) {
            console.error('Error listing documents:', error);
            return { success: false, error: error.message };
        }
    }

    async updateDocument(documentId, updates) {
        try {
            await fetch(`${this.docsApiUrl}/${documentId}:batchUpdate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requests: updates })
            });

            return { success: true };
        } catch (error) {
            console.error('Error updating document:', error);
            return { success: false, error: error.message };
        }
    }

    async shareDocument(documentId, email, role = 'reader') {
        try {
            await fetch(`${this.driveApiUrl}/${documentId}/permissions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'user',
                    role: role,
                    emailAddress: email
                })
            });

            return { success: true };
        } catch (error) {
            console.error('Error sharing document:', error);
            return { success: false, error: error.message };
        }
    }
}

export default GoogleDocsService;
