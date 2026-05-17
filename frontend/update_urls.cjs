const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/pages/Books.jsx',
  'src/pages/Reports.jsx',
  'src/pages/Dashboard.jsx',
  'src/pages/Students.jsx',
  'src/components/Header.jsx',
  'src/pages/IssueReturn.jsx',
  'src/pages/AdminSettings.jsx',
  'src/context/AuthContext.jsx'
];

const apiFileContent = `import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001'
});

export default api;
`;

fs.writeFileSync(path.join(__dirname, 'src/api.js'), apiFileContent);

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace axios imports based on folder depth
    const depth = file.split('/').length - 2; // src/pages/Books.jsx -> depth 1
    const importPath = depth === 1 ? '../api' : '../../api';
    
    content = content.replace(/import axios from 'axios';/g, `import axios from '${importPath}';`);
    
    // Replace hardcoded URLs
    content = content.replace(/'http:\/\/localhost:5001\/api/g, "'/api");
    content = content.replace(/`http:\/\/localhost:5001\/api/g, "`/api");
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
