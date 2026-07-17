const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');
const adminHomeDir = path.join(srcDir, 'pages', 'admin', 'Home');
const commonHomeDir = path.join(srcDir, 'pages', 'common', 'Home');

// 1. Move Home to common
if (fs.existsSync(adminHomeDir)) {
  if (!fs.existsSync(path.join(srcDir, 'pages', 'common'))) {
    fs.mkdirSync(path.join(srcDir, 'pages', 'common'));
  }
  fs.renameSync(adminHomeDir, commonHomeDir);
  console.log('Moved Home to common');
}

// 2. Update AppRoutes.jsx
const appRoutesPath = path.join(srcDir, 'components', 'AppRoutes.jsx');
if (fs.existsSync(appRoutesPath)) {
  let content = fs.readFileSync(appRoutesPath, 'utf8');
  
  // Replace admin/Home with common/Home
  content = content.replace(/pages\/admin\/Home\//g, 'pages/common/Home/');
  
  fs.writeFileSync(appRoutesPath, content, 'utf8');
  console.log('Updated AppRoutes.jsx');
}
