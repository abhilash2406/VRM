import drivers from '../../models/driver.js';
import trucks from '../../models/truck.js';
import users from '../../models/users.js';
import trips from '../../models/trip.js';
import login from '../../models/login.js';
import routes from '../../models/route.js';
import designations from '../../models/designation.js';
import transactions from '../../models/transaction.js';
import transporter from '../../modules/mail.js';

export const getDriverDatasList = async () => {
  return await drivers.findAll({
    include: [{ model: users, include: [{ model: login }] }],
  });
};

export const addDriversService = async (data, files) => {
  const userExist = await login.findOne({ where: { email: data.email } });
  if (userExist) {
    throw new Error('user already exist with this email');
  }

  const driver_exist = await drivers.findAll({ where: { licenseNo: data.licenseNo } });
  if (driver_exist.length !== 0) {
    throw new Error('this license is already submitted');
  }

  const randomPassword = Math.random().toString(36).slice(-8);
  const salt = await login.generateSalt();
  const hashedPassword = await login.hashPassword(randomPassword, salt);

  const newUser = await designations.findOne({ where: { designation: 'Driver' } });

  const log = await login.create({
    email: data.email,
    password: hashedPassword,
    salt,
    designationId: newUser.id,
  });

  const user = await users.create({
    name: data.name,
    phoneNumber: data.phoneNumber,
    loginId: log.id,
  });

  const licenseTypeString = JSON.stringify(data.licenseType);
  await drivers.create({
    licenseNo: data.licenseNo,
    licensePhoto: files['licensePhoto'][0].path.replace(/^public/, ''),
    userPhoto: files['userPhoto'][0].path.replace(/^public/, ''),
    licenseType: licenseTypeString,
    shift: data.shift,
    dailyWage: data.dailyWage,
    bata: data.bata,
    userId: user.id,
    status: 'approved',
  });

  const mailOptions = {
    to: data.email,
    subject: 'Successfully Registered',
    text: `Your username is ${data.name} and password is ${randomPassword} to complete your registration procedures`,
  };
  await transporter.sendMail(mailOptions);
  return true;
};

export const updateDriverService = async (id, data, files) => {
  const driver_ext = await drivers.findByPk(id);
  if (!driver_ext) {
    throw new Error('this driver not exists');
  }

  const user_ext = await users.findByPk(driver_ext.userId);
  await user_ext.update({
    name: data.name,
    phoneNumber: data.phoneNumber,
  });

  const licenseTypeString = JSON.stringify(data.licenseType);
  await driver_ext.update({
    licenseNo: data.licenseNo,
    licensePhoto: files['licensePhoto'][0].path.replace(/^public/, ''),
    userPhoto: files['userPhoto'][0].path.replace(/^public/, ''),
    licenseType: licenseTypeString,
    shift: data.shift,
    dailyWage: data.dailyWage,
    bata: data.bata,
  });
  return true;
};

export const viewDriverService = async (id) => {
  return await drivers.findOne({
    where: { id },
    include: [
      { model: users, include: [{ model: login }] },
      { model: trucks },
      { model: routes },
    ],
  });
};

export const fetchActiveDriversService = async () => {
  return await drivers.findAll({
    where: { status: 'approved' },
    include: [{ model: users, include: [{ model: login }] }],
  });
};

export const rejectDriverService = async (id) => {
  await drivers.update({ status: 'reject' }, { where: { id } });
  return true;
};

export const approveDriversService = async (id, data) => {
  const transaction = await transactions.findOne({ where: { driverId: id } });
  if (!transaction) {
    throw new Error('not paid');
  }

  await drivers.update(
    {
      status: 'approved',
      dailyWage: data.dailyWage,
      bata: data.bata,
      shift: data.shift,
    },
    { where: { id } }
  );
  return true;
};

export const deleteDriverService = async (id) => {
  const driver = await drivers.findByPk(id, {
    include: [{ model: users, onDelete: 'cascade' }],
  });

  if (!driver) {
    throw new Error('Driver not found');
  }

  const trip = await trips.findOne({ where: { driverId: id } });
  const user = await users.findOne({ where: { id: driver.userId } });
  const loged = await login.findOne({ where: { id: user.loginId } });

  if (trip) await trip.destroy();
  if (user) await user.destroy();
  if (loged) await loged.destroy();
  await driver.destroy();

  return true;
};
