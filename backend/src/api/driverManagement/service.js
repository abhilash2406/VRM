import drivers from '../../models/driver.js';
import { UserType } from '../../common/enum/user-type-enum.js';
import vehicle from '../../models/vehicle.js';
import users from '../../models/users.js';
import trips from '../../models/trip.js';
import loginHistory from '../../models/loginHistory.js';
import routes from '../../models/route.js';
import designations from '../../models/designation.js';
import transactions from '../../models/transaction.js';
import sendEmails from '../../utils/sendEmail.js';

/**
 * Retrieves a list of all drivers, including their associated user data and login histories.
 * @returns {Promise<Array>} A list of driver objects.
 */
export const getDriverDatasList = async () => {
  return await drivers.findAll({
    include: [{ model: users, include: [{ model: loginHistory }] }],
  });
};

/**
 * Registers a new driver, creates a user account, and sends an introductory email.
 * @param {Object} data - The driver details (name, phone, email, license_no, etc.).
 * @param {Object} files - The uploaded files (license_photo, userPhoto).
 * @returns {Promise<boolean>} True if successfully created.
 * @throws {Error} If the user email or license number already exists.
 */
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
    blood_group: data.blood_group || null,
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
    license_expiry_date: data.license_expiry_date || null,
    experience_years: data.experience_years || null,
    aadhar_no: data.aadhar_no || null,
    emergency_contact_name: data.emergency_contact_name || null,
    emergency_contact_number: data.emergency_contact_number || null,
    availability_status: data.availability_status || 'AVAILABLE',
    rating: data.rating || null,
  });

  const mailOptions = {
    to: data.email,
    subject: 'Successfully Registered',
    text: `Your username is ${data.name} and password is ${randomPassword} to complete your registration procedures`,
  };
  await sendEmails({ mailOptions });
  return true;
};

/**
 * Updates an existing driver and their associated user account.
 * @param {string} id - The UUID of the driver to update.
 * @param {Object} data - The driver details to update.
 * @param {Object} files - The uploaded files (license_photo, userPhoto).
 * @returns {Promise<boolean>} True if successfully updated.
 * @throws {Error} If the driver does not exist.
 */
export const updateDriverService = async (id, data, files) => {
  const driver_ext = await drivers.findByPk(id);
  if (!driver_ext) {
    throw new Error('this driver not exists');
  }

  const user_ext = await users.findByPk(driver_ext.user_id);
  await user_ext.update({
    first_name: data.name,
    phone_number: data.phone_number,
    blood_group: data.blood_group !== undefined ? data.blood_group : user_ext.blood_group,
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
    license_expiry_date: data.license_expiry_date !== undefined ? data.license_expiry_date : driver_ext.license_expiry_date,
    experience_years: data.experience_years !== undefined ? data.experience_years : driver_ext.experience_years,
    aadhar_no: data.aadhar_no !== undefined ? data.aadhar_no : driver_ext.aadhar_no,
    emergency_contact_name: data.emergency_contact_name !== undefined ? data.emergency_contact_name : driver_ext.emergency_contact_name,
    emergency_contact_number: data.emergency_contact_number !== undefined ? data.emergency_contact_number : driver_ext.emergency_contact_number,
    availability_status: data.availability_status !== undefined ? data.availability_status : driver_ext.availability_status,
    rating: data.rating !== undefined ? data.rating : driver_ext.rating,
  });
  return true;
};

/**
 * Fetches a single driver by their ID, including users, login history, trucks, and routes.
 * @param {string} id - The UUID of the driver.
 * @returns {Promise<Object>} The driver object with associated entities.
 */
export const viewDriverService = async (id) => {
  return await drivers.findOne({
    where: { id },
    include: [
      { model: users, include: [{ model: loginHistory }] },
      { model: vehicle },
      { model: routes },
    ],
  });
};

/**
 * Retrieves a list of all drivers who have an 'approved' status.
 * @returns {Promise<Array>} A list of approved driver objects.
 */
export const fetchActiveDriversService = async () => {
  return await drivers.findAll({
    where: { status: 'approved' },
    include: [{ model: users, include: [{ model: loginHistory }] }],
  });
};

/**
 * Rejects a driver's application by updating their status to 'reject'.
 * @param {string} id - The UUID of the driver to reject.
 * @returns {Promise<boolean>} True if successfully rejected.
 */
export const rejectDriverService = async (id) => {
  await drivers.update({ status: 'reject' }, { where: { id } });
  return true;
};

/**
 * Approves a driver's application, setting wage and shift info, provided they have a transaction.
 * @param {string} id - The UUID of the driver.
 * @param {Object} data - Contains daily_wage, bata, and shift details.
 * @returns {Promise<boolean>} True if successfully approved.
 * @throws {Error} If the driver does not have a recorded transaction (payment).
 */
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

/**
 * Deletes a driver, and cascades the deletion to their user record and associated trips.
 * @param {string} id - The UUID of the driver to delete.
 * @returns {Promise<boolean>} True if successfully deleted.
 * @throws {Error} If the driver does not exist.
 */
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
