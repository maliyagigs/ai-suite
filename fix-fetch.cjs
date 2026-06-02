const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// Insert API_BASE_URL near the top imports
content = content.replace(
  'import {',
  'const API_BASE_URL = typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_API_URL ? (import.meta as any).env.VITE_API_URL : "";\nimport {' 
);

// We need to replace fetch("/api/..." to fetch(API_BASE_URL + "/api/..."
content = content.replace(/fetch\("\/api\//g, 'fetch(API_BASE_URL + "/api/');

// And fetch(`/api/...` to fetch(`${API_BASE_URL}/api/...`
content = content.replace(/fetch\(`\/api\//g, 'fetch(`${API_BASE_URL}/api/');

fs.writeFileSync('src/context/AppContext.tsx', content);

console.log("Updated AppContext.tsx");
