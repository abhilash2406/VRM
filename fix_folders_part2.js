const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'frontend', 'src', 'pages', 'admin');
const authDir = path.join(__dirname, 'frontend', 'src', 'pages', 'auth');

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
};

// 1. Remove index dir
const indexDir = path.join(adminDir, 'index');
if (fs.existsSync(indexDir)) {
  fs.rmdirSync(indexDir, { recursive: true });
}

// 2. Update imports in the feature folders
const folders = fs.readdirSync(adminDir).filter(f => fs.statSync(path.join(adminDir, f)).isDirectory());
folders.forEach(folder => {
  const folderPath = path.join(adminDir, folder);
  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const filePath = path.join(folderPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      // Add one more level of ../ to imports that are going up
      content = content.replace(/(from\s+['"])\.\.\/\.\.\//g, "$1../../../");
      
      // Wait! If they import things from their OWN folder now (like Graph.jsx from Dashboard.jsx), it was originally:
      // import Graph from './Graph';
      // This remains correct because both files were moved to the Dashboard/ folder together!
      
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
