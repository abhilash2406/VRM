import signup from '../users.js';
import login from '../login.js';
import designation from '../designation.js';

const hashing = async (password) => {
  const salt = await login.generateSalt();
  let newPassword = await login.hashPassword(password, salt);
  return { salt, newPassword };
};

(async () => {
  try {
    let { salt, newPassword } = await hashing('AbhiLash@20');

    const adminData = {
      name: 'Abhilash ',
      email: 'abhilashkumar@spericorn.com',
      phoneNumber: '7012139732',
    };

    const designationDetails = await designation.findOne({
      where: { designation: 'Admin' },
    });

    let existingData = await login.findOne({
      where: { email: adminData.email },
    });

    if (!existingData) {
      const loginDetails = await login.create({
        ...adminData,
        password: newPassword,
        salt,
        designationId: designationDetails.id,
      });
      console.log('Admin created successfully');
      await signup.create({
        ...adminData,
        loginId: loginDetails.id,
      });
    } else {
      console.log(`Data already exists`);
    }
  } catch (e) {
    console.log('error', e.message);
  }
})();
