const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');
const adminDir = path.join(srcDir, 'pages', 'admin');
const authDir = path.join(srcDir, 'pages', 'auth');
const commonDir = path.join(srcDir, 'pages', 'common');

// 1. Rename Profile to Home in admin
const profileDir = path.join(adminDir, 'Profile');
const homeDir = path.join(adminDir, 'Home');

if (fs.existsSync(profileDir)) {
  fs.renameSync(profileDir, homeDir);
  console.log('Renamed Profile to Home');
}

// 2. Move stripe/success to common
if (!fs.existsSync(commonDir)) {
  fs.mkdirSync(commonDir, { recursive: true });
}

const commonFiles = ['StripePayment.jsx', 'Success.jsx', 'CardDetails.jsx'];
commonFiles.forEach(file => {
  const oldPath = path.join(authDir, file);
  const newPath = path.join(commonDir, file);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${file} to common`);
  }
});

// 3. Update AppRoutes.jsx
const appRoutesPath = path.join(srcDir, 'components', 'AppRoutes.jsx');
if (fs.existsSync(appRoutesPath)) {
  let content = fs.readFileSync(appRoutesPath, 'utf8');
  
  // Replace admin/Profile with admin/Home
  content = content.replace(/pages\/admin\/Profile\//g, 'pages/admin/Home/');
  
  // Replace auth/StripePayment, auth/Success with common/
  content = content.replace(/pages\/auth\/StripePayment/g, 'pages/common/StripePayment');
  content = content.replace(/pages\/auth\/Success/g, 'pages/common/Success');
  
  fs.writeFileSync(appRoutesPath, content, 'utf8');
  console.log('Updated AppRoutes.jsx');
}

// 4. Also update Registration.jsx which might import CardDetails.jsx
// Or DrivingDetails.jsx or FillDetails.jsx
const updateAuthImports = () => {
  const files = fs.readdirSync(authDir);
  files.forEach(file => {
    if (file.endsWith('.jsx')) {
      const filePath = path.join(authDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      // Update CardDetails, StripePayment imports
      content = content.replace(/from\s+['"]\.\/CardDetails['"]/g, "from '../common/CardDetails'");
      content = content.replace(/from\s+['"]\.\/StripePayment['"]/g, "from '../common/StripePayment'");
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated imports in auth/${file}`);
      }
    }
  });
};
updateAuthImports();

