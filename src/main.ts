const { QRCodeStyling } = require('qr-code-styling/lib/qr-code-styling.common.js');
const nodeCanvas = require('canvas');
const { JSDOM } = require('jsdom');
const fs = require('fs');

// Function to create a bordered image with text
async function createBorderedImage(qrImageBuffer, fileName, width, height) {
    const canvas = nodeCanvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw the black border
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Draw the QR code in the center
    const qrWidth = 1000; // QR code dimensions
    const qrHeight = 1000; // QR code dimensions
    const qrX = (width - qrWidth) / 2;
    const qrY = (height - qrHeight) / 2;

    const qrImage = await nodeCanvas.loadImage(qrImageBuffer);
    ctx.drawImage(qrImage, qrX, qrY, qrWidth, qrHeight);

    // Set font and draw the upper text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial'; // Adjust font size and style as needed
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Kom igang - scan QR Koden', width / 2, 50); // Position text at the top center

    // Set font and draw the lower text "Tribe"
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial'; // Adjust font size and style as needed
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Tribe', width / 2, height / 2 + qrHeight / 2 + 30); // Position text below the QR code

    // Save the final image
    const finalBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(fileName, finalBuffer);
}

const options = {
    width: 1000,
    height: 1000,
    data: "https://app.tribehappiness.com/",
    image: "src/Logo-symbol-white_NEW_IF.svg",
    dotsOptions: {
        color: "#fff",
        type: "rounded"
    },
    cornerSquareOptions: {
        color: "#00000",
        type: "dot"
    },
    cornerDotsOptions: {
        color: "#00000",
        type: "dot"
    },
    backgroundOptions: {
        color: "#00000",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
    }
};

// For canvas type
const qrCodeImage = new QRCodeStyling({
    jsdom: JSDOM, // this is required
    nodeCanvas, // this is required,
    ...options,
    imageOptions: {
        saveAsBlob: true,
        crossOrigin: "anonymous",
        margin: 20
    },
});

qrCodeImage.getRawData("png").then((buffer) => {
    createBorderedImage(buffer, "test.png", 1200, 1200); // Adjusted size for border
});

// For svg type
const qrCodeSvg = new QRCodeStyling({
    jsdom: JSDOM, // this is required
    type: "svg",
    ...options
});

qrCodeSvg.getRawData("svg").then((buffer) => {
    createBorderedImage(buffer, "test.svg", 1200, 1200); // Adjusted size for border
});

// For svg type with the inner-image saved as a blob
const qrCodeSvgWithBlobImage = new QRCodeStyling({
    jsdom: JSDOM, // this is required
    nodeCanvas, // this is required
    type: "svg",
    ...options,
    imageOptions: {
        saveAsBlob: true,
        crossOrigin: "anonymous",
        margin: 20
    }
});

qrCodeSvgWithBlobImage.getRawData("svg").then((buffer) => {
    createBorderedImage(buffer, "test_blob.svg", 1200, 1200); // Adjusted size for border
});
