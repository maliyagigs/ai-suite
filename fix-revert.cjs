const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');
content = content.replace(/const API_BASE_URL = [^\n]+\n/g, '');
content = content.replace(/API_BASE_URL \+ "\/api\//g, '"/api/');
content = content.replace(/\$\{API_BASE_URL\}\/api\//g, '/api/');
fs.writeFileSync('src/context/AppContext.tsx', content);
console.log("reverted API_BASE_URL");
