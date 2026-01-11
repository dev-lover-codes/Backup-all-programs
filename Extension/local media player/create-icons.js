// Simple script to create PNG icon files programmatically
// Run this with Node.js: node create-icons.js

const fs = require('fs');
const { createCanvas } = require('canvas');

const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');

    // Rounded rectangle
    const radius = size / 8;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Play triangle
    const centerX = size / 2;
    const centerY = size / 2;
    const triangleSize = size * 0.35;

    ctx.shadowColor = 'rgba(0, 113, 227, 0.6)';
    ctx.shadowBlur = size * 0.1;
    ctx.fillStyle = '#0071e3';

    ctx.beginPath();
    ctx.moveTo(centerX - triangleSize * 0.3, centerY - triangleSize * 0.5);
    ctx.lineTo(centerX - triangleSize * 0.3, centerY + triangleSize * 0.5);
    ctx.lineTo(centerX + triangleSize * 0.5, centerY);
    ctx.closePath();
    ctx.fill();

    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./icons/icon${size}.png`, buffer);
    console.log(`Created icon${size}.png`);
});

console.log('All icons created successfully!');
