/**
 * Decode a Base64-encoded file payload into a Node.js Buffer.
 */

const fs   = require('fs');
const path = require('path');

const data = fs.readFileSync(path.resolve(__dirname, 'data.txt'), 'utf8');

function decodeBase64ToBuffer(base64Data) {
  return Buffer.from(base64Data, 'base64')
}

const pdfBuffer = decodeBase64ToBuffer(data);
fs.promises.writeFile('output.pdf', pdfBuffer);