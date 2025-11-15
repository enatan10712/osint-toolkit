const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../app/globals.css');
const text = fs.readFileSync(file, 'utf8');
const lines = text.split(/\r?\n/);
const start = 236-1; // zero-based
const end = 256-1;
for (let i = start; i <= end && i < lines.length; i++) {
  console.log(String(i+1).padStart(4) + '  ' + lines[i]);
}
