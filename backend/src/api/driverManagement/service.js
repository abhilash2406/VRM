import drivers from '../../models/driver.js';
import { UserType } from '../../common/enum/user-type-enum.js';
import trucks from '../../models/truck.js';
import users from '../../models/users.js';
import trips from '../../models/trip.js';
import loginHistory from '../../models/loginHistory.js';
import routes from '../../models/route.js';
import designations from '../../models/designation.js';
import transactions from '../../models/transaction.js';
import sendEmails from '../../utils/sendEmail.js';

export const getDriverDatasList = async () => {
  return await drivers.findAll({
    include: [{ model: users, include: [{ model: loginHistory }] }],
  });
};

export const addDriversService = async (data, files) => {
  const userExist = await users.findOne({ where: { email: data.email } });
  if (userExist) {
    throw new Error('user already exist with this email');
  }

  const driver_exist = await drivers.findAll({ where: { license_no: data.license_no } });
  if (driver_exist.length !== 0) {
    throw new Error('this license is already submitted');
  }

  const randomPassword = Math.random().toString(36).slice(-8);

  const newDesignation = await designations.findOne({ where: { designation: UserType.DRIVER } });

  const user = await users.create({
    first_name: data.name,
    phone_number: data.phone_number,
    email: data.email,
    password_hash: randomPassword,
    designation_id: newDesignation.id,
  });

  const licenseTypeString = JSON.stringify(data.license_type);
  await drivers.create({
    license_no: data.license_no,
    license_photo: files['license_photo'][0].path.replace(/^public/, ''),
    userPhoto: files['userPhoto'][0].path.replace(/^public/, ''),
    license_type: licenseTypeString,
    shift: data.shift,
    daily_wage: data.daily_wage,
    bata: data.bata,
    user_id: user.id,
    status: 'approved',
  });

  const mailOptions = {
    to: data.email,
    subject: 'Successfully Registered',
    text: `Your username is ${data.name} and password is ${randomPassword} to complete your registration procedures`,
  };
  await sendEmails({ mailOptions });
  return true;
};

export const updateDriverService = async (id, data, files) => {
  const driver_ext = await drivers.findByPk(id);
  if (!driver_ext) {
    throw new Error('this driver not exists');
  }

  const user_ext = await users.findByPk(driver_ext.user_id);
  await user_ext.update({
    first_name: data.name,
    phone_number: data.phone_number,
  });

  const licenseTypeString = JSON.stringify(data.license_type);
  await driver_ext.update({
    license_no: data.license_no,
    license_photo: files['license_photo'][0].path.replace(/^public/, ''),
    userPhoto: files['userPhoto'][0].path.replace(/^public/, ''),
    license_type: licenseTypeString,
    shift: data.shift,
    daily_wage: data.daily_wage,
    bata: data.bata,
  });
  return true;
};

export const viewDriverService = async (id) => {
  return await drivers.findOne({
    where: { id },
    include: [
      { model: users, include: [{ model: loginHistory }] },
      { model: trucks },
      { model: routes },
    ],
  });
};

export const fetchActiveDriversService = async () => {
  return await drivers.findAll({
    where: { status: 'approved' },
    include: [{ model: users, include: [{ model: loginHistory }] }],
  });
};

export const rejectDriverService = async (id) => {
  await drivers.update({ status: 'reject' }, { where: { id } });
  return true;
};

export const approveDriversService = async (id, data) => {
  const transaction = await transactions.findOne({ where: { driver_id: id } });
  if (!transaction) {
    throw new Error('not paid');
  }

  await drivers.update(
    {
      status: 'approved',
      daily_wage: data.daily_wage,
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

  const trip = await trips.findOne({ where: { driver_id: id } });
  const user = await users.findOne({ where: { id: driver.user_id } });

  if (trip) await trip.destroy();
  if (user) await user.destroy(); // Cascade will delete login histories, if configured, or just leave it.
  await driver.destroy();

  return true;
};
