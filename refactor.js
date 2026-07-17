const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');
const componentsDir = path.join(srcDir, 'components');
const pagesDir = path.join(srcDir, 'pages');
const adminPagesDir = path.join(pagesDir, 'admin');
const authPagesDir = path.join(pagesDir, 'auth');

// Create directories
[pagesDir, adminPagesDir, authPagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Define mapping of source directories to destination directories
const moveMap = {
  'AddUsers': adminPagesDir,
  'Dashboard': adminPagesDir,
  'DriverManagement.js': adminPagesDir,
  'PermissionManagement': adminPagesDir,
  'ProfileManagement': adminPagesDir,
  'RouteManagement': adminPagesDir,
  'SystemLogs': adminPagesDir,
  'Transactions': adminPagesDir,
  'TripManagement': adminPagesDir,
  'VehicleManagement': adminPagesDir,
  'Authentication': authPagesDir
};

// 1. Move files
Object.entries(moveMap).forEach(([folder, targetDir]) => {
  const folderPath = path.join(componentsDir, folder);
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      const oldPath = path.join(folderPath, file);
      const newPath = path.join(targetDir, file);
      console.log(`Moving ${oldPath} -> ${newPath}`);
      fs.renameSync(oldPath, newPath);
    });
    // Remove empty directory
    fs.rmdirSync(folderPath);
  }
});

// 2. Update imports in all files in pagesDir
function updateImportsInDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      updateImportsInDir(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      // Update imports that pointed to sibling folders in components (e.g., ../Shared/NavBar)
      // Since the file is now in pages/admin/ or pages/auth/, it needs to go up two levels to src, then down to components.
      // So '../Shared/' becomes '../../components/Shared/'
      content = content.replace(/from\s+['"]\.\.\/Shared\/(.*?)['"]/g, "from '../../components/Shared/$1'");
      
      // Update '../NotFound' to '../../components/NotFound'
      content = content.replace(/from\s+['"]\.\.\/NotFound['"]/g, "from '../../components/NotFound'");

      // Update '../PrivateRouting' to '../../components/PrivateRouting'
      content = content.replace(/from\s+['"]\.\.\/PrivateRouting['"]/g, "from '../../components/PrivateRouting'");

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated imports in ${filePath}`);
      }
    }
  });
}
updateImportsInDir(pagesDir);

// 3. Update AppRoutes.jsx
const appRoutesPath = path.join(componentsDir, 'AppRoutes.jsx');
if (fs.existsSync(appRoutesPath)) {
  let content = fs.readFileSync(appRoutesPath, 'utf8');
  
  // Replace imports for auth pages
  content = content.replace(/from\s+['"]\.\/Authentication\/(.*?)['"]/g, "from '../pages/auth/$1'");
  
  // Replace imports for admin pages
  const adminFolders = Object.keys(moveMap).filter(k => k !== 'Authentication');
  adminFolders.forEach(folder => {
    const regex = new RegExp(`from\\s+['"]\\.\\/${folder.replace('.', '\\.')}\\/(.*?)['"]`, 'g');
    content = content.replace(regex, "from '../pages/admin/$1'");
  });

  fs.writeFileSync(appRoutesPath, content, 'utf8');
  console.log('Updated AppRoutes.jsx');
}

console.log('Refactoring complete!');
