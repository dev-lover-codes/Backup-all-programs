// PDF Advanced Features - Image handling, Page manipulation, Export
// This file extends the main editor functionality

class PDFAdvancedEditor {
    constructor() {
        this.pdfLibDoc = null;
        this.currentPageIndex = 0;
        this.modifications = [];
    }

    // Initialize with PDF-lib document
    async initialize(pdfBytes) {
        this.pdfLibDoc = await PDFLib.PDFDocument.load(pdfBytes);
        return this.pdfLibDoc;
    }

    // Insert image into PDF
    async insertImage(imageFile, x, y, width, height, pageIndex) {
        try {
            const imageBytes = await this.fileToArrayBuffer(imageFile);
            const pageToModify = this.pdfLibDoc.getPages()[pageIndex];

            let image;
            if (imageFile.type === 'image/png') {
                image = await this.pdfLibDoc.embedPng(imageBytes);
            } else if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
                image = await this.pdfLibDoc.embedJpg(imageBytes);
            } else {
                throw new Error('Unsupported image format. Use PNG or JPEG.');
            }

            // Calculate position (PDF coordinates are from bottom-left)
            const pageHeight = pageToModify.getHeight();
            const pdfY = pageHeight - y - height;

            pageToModify.drawImage(image, {
                x: x,
                y: pdfY,
                width: width,
                height: height,
            });

            this.modifications.push({
                type: 'image',
                page: pageIndex,
                x, y, width, height
            });

            return true;
        } catch (error) {
            console.error('Error inserting image:', error);
            throw error;
        }
    }

    // Add text to PDF
    async addTextToPDF(text, x, y, options, pageIndex) {
        try {
            const pageToModify = this.pdfLibDoc.getPages()[pageIndex];
            const pageHeight = pageToModify.getHeight();
            const pdfY = pageHeight - y;

            // Embed font
            let font;
            if (options.fontFamily === 'Courier') {
                font = await this.pdfLibDoc.embedFont(PDFLib.StandardFonts.Courier);
            } else if (options.fontFamily === 'Times-Roman') {
                font = await this.pdfLibDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
            } else {
                font = await this.pdfLibDoc.embedFont(PDFLib.StandardFonts.Helvetica);
            }

            // Convert hex color to RGB
            const { r, g, b } = this.hexToRgb(options.color || '#000000');

            pageToModify.drawText(text, {
                x: x,
                y: pdfY,
                size: options.fontSize || 12,
                font: font,
                color: PDFLib.rgb(r, g, b),
            });

            this.modifications.push({
                type: 'text',
                page: pageIndex,
                text, x, y, options
            });

            return true;
        } catch (error) {
            console.error('Error adding text:', error);
            throw error;
        }
    }

    // Add highlight rectangle to PDF
    async addHighlightToPDF(x, y, width, height, color, opacity, pageIndex) {
        try {
            const pageToModify = this.pdfLibDoc.getPages()[pageIndex];
            const pageHeight = pageToModify.getHeight();
            const pdfY = pageHeight - y - height;

            const { r, g, b } = this.hexToRgb(color);

            pageToModify.drawRectangle({
                x: x,
                y: pdfY,
                width: width,
                height: height,
                color: PDFLib.rgb(r, g, b),
                opacity: opacity,
            });

            return true;
        } catch (error) {
            console.error('Error adding highlight:', error);
            throw error;
        }
    }

    // Add shape to PDF
    async addShapeToPDF(shapeData, pageIndex) {
        try {
            const pageToModify = this.pdfLibDoc.getPages()[pageIndex];
            const pageHeight = pageToModify.getHeight();
            const pdfY = pageHeight - shapeData.y - shapeData.height;

            const { r: strokeR, g: strokeG, b: strokeB } = this.hexToRgb(shapeData.strokeColor);
            const { r: fillR, g: fillG, b: fillB } = this.hexToRgb(shapeData.fillColor || '#ffffff');

            if (shapeData.shape === 'rectangle') {
                pageToModify.drawRectangle({
                    x: shapeData.x,
                    y: pdfY,
                    width: shapeData.width,
                    height: shapeData.height,
                    borderColor: PDFLib.rgb(strokeR, strokeG, strokeB),
                    borderWidth: shapeData.strokeWidth || 2,
                    color: shapeData.fillColor !== 'transparent' ?
                        PDFLib.rgb(fillR, fillG, fillB) : undefined,
                    opacity: shapeData.fillColor !== 'transparent' ? 1 : 0,
                });
            } else if (shapeData.shape === 'circle') {
                const radius = Math.sqrt(shapeData.width ** 2 + shapeData.height ** 2) / 2;
                const centerX = shapeData.x + shapeData.width / 2;
                const centerY = pdfY + shapeData.height / 2;

                pageToModify.drawCircle({
                    x: centerX,
                    y: centerY,
                    size: radius,
                    borderColor: PDFLib.rgb(strokeR, strokeG, strokeB),
                    borderWidth: shapeData.strokeWidth || 2,
                    color: shapeData.fillColor !== 'transparent' ?
                        PDFLib.rgb(fillR, fillG, fillB) : undefined,
                    opacity: shapeData.fillColor !== 'transparent' ? 1 : 0,
                });
            } else if (shapeData.shape === 'line') {
                pageToModify.drawLine({
                    start: { x: shapeData.x, y: pdfY },
                    end: { x: shapeData.x + shapeData.width, y: pdfY + shapeData.height },
                    thickness: shapeData.strokeWidth || 2,
                    color: PDFLib.rgb(strokeR, strokeG, strokeB),
                });
            }

            return true;
        } catch (error) {
            console.error('Error adding shape:', error);
            throw error;
        }
    }

    // Add new blank page
    async addBlankPage() {
        try {
            const page = this.pdfLibDoc.addPage();
            return this.pdfLibDoc.getPageCount();
        } catch (error) {
            console.error('Error adding page:', error);
            throw error;
        }
    }

    // Delete page
    async deletePage(pageIndex) {
        try {
            if (this.pdfLibDoc.getPageCount() <= 1) {
                throw new Error('Cannot delete the only page');
            }
            this.pdfLibDoc.removePage(pageIndex);
            return true;
        } catch (error) {
            console.error('Error deleting page:', error);
            throw error;
        }
    }

    // Rotate page
    async rotatePage(pageIndex, degrees = 90) {
        try {
            const page = this.pdfLibDoc.getPages()[pageIndex];
            const currentRotation = page.getRotation().angle;
            page.setRotation(PDFLib.degrees((currentRotation + degrees) % 360));
            return true;
        } catch (error) {
            console.error('Error rotating page:', error);
            throw error;
        }
    }

    // Export PDF with all annotations
    async exportPDF() {
        try {
            const pdfBytes = await this.pdfLibDoc.save();
            return pdfBytes;
        } catch (error) {
            console.error('Error exporting PDF:', error);
            throw error;
        }
    }

    // Export to different formats
    async exportToFormat(format, currentCanvas) {
        switch (format) {
            case 'png':
                return this.exportToPNG(currentCanvas);
            case 'jpeg':
                return this.exportToJPEG(currentCanvas);
            default:
                throw new Error('Unsupported format');
        }
    }

    // Export current page to PNG
    exportToPNG(canvas) {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    }

    // Export current page to JPEG
    exportToJPEG(canvas) {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.95);
        });
    }

    // Utility: Convert hex color to RGB (0-1 range for PDF-lib)
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
    }

    // Utility: Convert file to ArrayBuffer
    fileToArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // Split PDF into multiple PDFs
    async splitPDF(ranges) {
        try {
            const splitDocs = [];

            for (const range of ranges) {
                const newDoc = await PDFLib.PDFDocument.create();
                const pages = await newDoc.copyPages(this.pdfLibDoc, range);
                pages.forEach(page => newDoc.addPage(page));
                const bytes = await newDoc.save();
                splitDocs.push(bytes);
            }

            return splitDocs;
        } catch (error) {
            console.error('Error splitting PDF:', error);
            throw error;
        }
    }

    // Merge current PDF with another
    async mergePDF(otherPdfBytes) {
        try {
            const otherDoc = await PDFLib.PDFDocument.load(otherPdfBytes);
            const copiedPages = await this.pdfLibDoc.copyPages(
                otherDoc,
                otherDoc.getPageIndices()
            );
            copiedPages.forEach(page => this.pdfLibDoc.addPage(page));
            return true;
        } catch (error) {
            console.error('Error merging PDF:', error);
            throw error;
        }
    }

    // Get PDF metadata
    getMetadata() {
        return {
            pageCount: this.pdfLibDoc.getPageCount(),
            title: this.pdfLibDoc.getTitle() || 'Untitled',
            author: this.pdfLibDoc.getAuthor() || '',
            subject: this.pdfLibDoc.getSubject() || '',
            creator: this.pdfLibDoc.getCreator() || '',
            keywords: this.pdfLibDoc.getKeywords() || '',
        };
    }

    // Set PDF metadata
    setMetadata(metadata) {
        if (metadata.title) this.pdfLibDoc.setTitle(metadata.title);
        if (metadata.author) this.pdfLibDoc.setAuthor(metadata.author);
        if (metadata.subject) this.pdfLibDoc.setSubject(metadata.subject);
        if (metadata.creator) this.pdfLibDoc.setCreator(metadata.creator);
        if (metadata.keywords) this.pdfLibDoc.setKeywords(metadata.keywords);
    }
}

// Export for use in main editor
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFAdvancedEditor;
}
