const permission = require('../permission');

(async () => {
  try {
    let permissionData = [
      { menu: 'Truck', subMenu: 'Add' },
      { menu: 'Truck', subMenu: 'Edit' },
      { menu: 'Truck', subMenu: 'List' },
      { menu: 'Truck', subMenu: 'Delete' },
      { menu: 'Truck', subMenu: 'Status' },
      { menu: 'Driver', subMenu: 'Add' },
      { menu: 'Driver', subMenu: 'Edit' },
      { menu: 'Driver', subMenu: 'List' },
      { menu: 'Driver', subMenu: 'Delete' },
      { menu: 'Driver', subMenu: 'Status' },
      { menu: 'Transaction', subMenu: 'List' },
      { menu: 'Contactus', subMenu: 'List' },
      { menu: 'Gallery', subMenu: 'Add' },
      { menu: 'Gallery', subMenu: 'Edit' },
      { menu: 'Gallery', subMenu: 'Delete' },
      { menu: 'Gallery', subMenu: 'List' },
      { menu: 'Route', subMenu: 'Add' },
      { menu: 'Route', subMenu: 'Edit' },
      { menu: 'Route', subMenu: 'List' },
      { menu: 'Route', subMenu: 'Delete' },
      { menu: 'Trip', subMenu: 'Add' },
      { menu: 'Trip', subMenu: 'Edit' },
      { menu: 'Trip', subMenu: 'List' },
      { menu: 'Trip', subMenu: 'Delete' },
    ];

    await permission.bulkCreate(permissionData);
  } catch (e) {
    console.log('error', e.message);
  }
})();
