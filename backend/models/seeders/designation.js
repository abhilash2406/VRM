const designation = require('../designation');

(async () => {
  try {
    const designationData = ['Admin', 'Driver', 'Manager', 'Sales'];

    designationData.map(async (e) => {
      let existingData = await designation.findOne({
        where: { designation: e },
      });
      if (!existingData) {
        await designation.create({ designation: e });
        console.log('Designation created successfully');
      } else {
        console.log(`Data already exists`);
      }
    });
  } catch (e) {
    console.log('error', e.message);
    process.exit(1);
  }
})();
