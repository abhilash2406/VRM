const signup = require('../signup');
const login = require('../login');
const designation = require('../designation');

const hashing = async (password) => {
  const salt = await login.generateSalt();
  let newPassword = await login.hashPassword(password, salt);
  return { salt, newPassword };
};

(async () => {
  try {
    let { salt, newPassword } = await hashing('Admin@123');

    const adminData = {
      name: 'Admin123',
      email: 'Admin123@gmail.com',
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
