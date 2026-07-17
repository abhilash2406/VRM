const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'frontend', 'src', 'pages', 'admin');
const authDir = path.join(__dirname, 'frontend', 'src', 'pages', 'auth');

// Define mapping of files to their new subfolders
const fileMap = {
  // Dashboard
  'Dashboard.jsx': 'Dashboard',
  'Graph.jsx': 'Dashboard',
  'RevenueGraph.jsx': 'Dashboard',
  // Users
  'AddUser.jsx': 'Users',
  // Vehicles
  'ListVehicle.jsx': 'Vehicles',
  'AddVehicleModal.jsx': 'Vehicles',
  'ViewVehicleModal.jsx': 'Vehicles',
  'ListVehicle.css': 'Vehicles',
  // Profile
  'Profile.jsx': 'Profile',
  'ChangePassword.jsx': 'Profile',
  'Feedbacks.jsx': 'Profile',
  'ViewFeedback.jsx': 'Profile',
  'Gallery.jsx': 'Profile',
  // Routes
  'TripRoutes.jsx': 'Routes',
  'AddRoutes.jsx': 'Routes',
  // Drivers
  'DriverList.jsx': 'Drivers',
  'AddDrivers.jsx': 'Drivers',
  'ViewDriver.jsx': 'Drivers',
  // Trips
  'Trips.jsx': 'Trips',
  'AddTrips.jsx': 'Trips',
  // Transactions
  'Transactions.jsx': 'Transactions',
  // Permissions
  'Permissions.jsx': 'Permissions',
  // System Logs
  'ActivityLogs.jsx': 'SystemLogs',
  // index - maybe delete it? It was created by accident
  'index': null
};

// 1. Create folders and move files
Object.entries(fileMap).forEach(([file, folder]) => {
  if (folder === null) {
    const filePath = path.join(adminDir, file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return;
  }
  
  const targetDir = path.join(adminDir, folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const oldPath = path.join(adminDir, file);
  const newPath = path.join(targetDir, file);
  
  if (fs.existsSync(oldPath)) {
    console.log(`Moving ${file} to ${folder}/`);
    fs.renameSync(oldPath, newPath);
  }
});

// 2. Update imports inside the moved files
// Since they moved one level deeper, we need to add '../' to relative imports that go outside the current folder.
function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replace ../../ with ../../../
  content = content.replace(/(from\s+['"])\.\.\/\.\.\//g, "$1../../../");
  
  // Replace ../components/ with ../../components/ (which was originally ../../components/ before previous replace?)
  // Wait! In the current flat state, they import from '../../components/...', '../../hooks/...', '../../utils/...', etc.
  // We need to carefully replace '../../' with '../../../' for all of these.
  // Let's just globally replace from '../../ to from '../../../
  // and from '../components/ to from '../../components/
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      // It's one of the feature folders
      const files = fs.readdirSync(itemPath);
      files.forEach(file => {
        if (file.endsWith('.jsx') || file.endsWith('.js')) {
          const filePath = path.join(itemPath, file);
          let content = fs.readFileSync(filePath, 'utf8');
          let original = content;
          
          // The files currently have imports like:
          // import logger from '../../utils/logger';
          // import { useFeedbacks } from '../../hooks/queries/useProfileQueries';
          // import AppDataTable from '../../components/Shared/AppDataTable';
          // We need to add one more '../' to these.
          content = content.replace(/(from\s+['"])\.\.\/\.\.\//g, "$1../../../");
          
          if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated imports in ${folder}/${file}`);
          }
        }
      });
    }
  });
}

// Read the adminDir and process its subdirectories
const folders = fs.readdirSync(adminDir).filter(f => fs.statSync(path.join(adminDir, f)).isDirectory());
folders.forEach(folder => {
  const folderPath = path.join(adminDir, folder);
  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const filePath = path.join(folderPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      // Add one more level of ../
      content = content.replace(/(from\s+['"])\.\.\/\.\.\//g, "$1../../../");
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated imports in ${folder}/${file}`);
      }
    }
  });
});

// 3. Update AppRoutes.jsx
const appRoutesPath = path.join(__dirname, 'frontend', 'src', 'components', 'AppRoutes.jsx');
if (fs.existsSync(appRoutesPath)) {
  let content = fs.readFileSync(appRoutesPath, 'utf8');
  
  // Replace flat admin imports with folder admin imports
  Object.entries(fileMap).forEach(([file, folder]) => {
    if (folder && file.endsWith('.jsx')) {
      const baseName = file.replace('.jsx', '');
      const regex = new RegExp(`from\\s+['"]\\.\\.\\/pages\\/admin\\/${baseName}['"]`, 'g');
      content = content.replace(regex, `from '../pages/admin/${folder}/${baseName}'`);
    }
  });

  fs.writeFileSync(appRoutesPath, content, 'utf8');
  console.log('Updated AppRoutes.jsx');
}

console.log('Folder fixing complete!');
