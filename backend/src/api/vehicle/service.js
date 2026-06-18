import vehicle from '../../models/vehicle.js';
import users from '../../models/users.js';
import jwt from 'jsonwebtoken';
import { VehicleStatus, VehicleType } from '../../common/enum/vehicle-enum.js';

/**
 * Registers a new vehicle in the system.
 * @param {Object} data - The vehicle details payload.
 * @param {Object} files - Uploaded files (vehicle_photo, rc_photo).
 * @param {string} token - The authenticated user's JWT token.
 * @returns {Promise<Object>} The created vehicle record.
 * @throws {Error} If a vehicle with the same registration number already exists.
 */
export const addVehicleService = async (data, files, token) => {
  const existing = await vehicle.findOne({
    where: { registration_number: data.registration_number },
  });

  if (existing) {
    throw new Error('A vehicle with this registration number already exists');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'qwerty');
  const user = await users.findByPk(decoded.id);

  const vehiclePhotoPath =
    files && files['vehicle_photo'] ? files['vehicle_photo'][0].path.replace(/^public/, '') : null;
  const rcPhotoPath =
    files && files['rc_photo'] ? files['rc_photo'][0].path.replace(/^public/, '') : null;

  const created = await vehicle.create({
    registration_number: data.registration_number,
    manufacturer: data.manufacturer,
    model_name: data.model_name,
    manufacturing_year: data.manufacturing_year,
    status: data.status || VehicleStatus.AVAILABLE,
    vehicle_type: data.vehicle_type || VehicleType.FOUR_WHEELER,
    vehicle_subtype: data.vehicle_subtype || null,
    seating_capacity: data.seating_capacity || null,
    rc_number: data.rc_number || null,
    insurance_expiry: data.insurance_expiry || null,
    last_service_date: data.last_service_date || null,
    next_service_date: data.next_service_date || null,
    vehicle_photo: vehiclePhotoPath,
    rc_photo: rcPhotoPath,
    created_by: user ? user.id : null,
  });

  return created;
};

/**
 * Retrieves all registered vehicles.
 * @returns {Promise<Array>} List of all vehicle records.
 */
export const getAllVehiclesService = async () => {
  return await vehicle.findAll({ order: [['createdAt', 'DESC']] });
};

/**
 * Retrieves only vehicles with status 'available'.
 * @returns {Promise<Array>} List of available vehicles.
 */
export const getActiveVehiclesService = async () => {
  return await vehicle.findAll({ where: { status: 'available' } });
};

/**
 * Fetches a single vehicle record by ID.
 * @param {string} id - The vehicle UUID.
 * @returns {Promise<Object>} The vehicle record.
 * @throws {Error} If the vehicle is not found.
 */
export const getVehicleByIdService = async (id) => {
  const found = await vehicle.findByPk(id);
  if (!found) {
    throw new Error('Vehicle not found');
  }
  return found;
};

/**
 * Updates an existing vehicle record.
 * @param {string} id - The vehicle UUID.
 * @param {Object} data - The updated vehicle payload.
 * @param {Object} files - Newly uploaded files (optional).
 * @returns {Promise<Object>} The updated vehicle record.
 * @throws {Error} If the vehicle does not exist.
 */
export const updateVehicleService = async (id, data, files) => {
  const found = await vehicle.findByPk(id);
  if (!found) {
    throw new Error('Vehicle not found');
  }

  const updates = {
    registration_number: data.registration_number ?? found.registration_number,
    manufacturer: data.manufacturer ?? found.manufacturer,
    model_name: data.model_name ?? found.model_name,
    manufacturing_year: data.manufacturing_year ?? found.manufacturing_year,
    status: data.status ?? found.status,
    vehicle_type: data.vehicle_type ?? found.vehicle_type,
    vehicle_subtype: data.vehicle_subtype ?? found.vehicle_subtype,
    seating_capacity: data.seating_capacity ?? found.seating_capacity,
    rc_number: data.rc_number ?? found.rc_number,
    insurance_expiry: data.insurance_expiry ?? found.insurance_expiry,
    last_service_date: data.last_service_date ?? found.last_service_date,
    next_service_date: data.next_service_date ?? found.next_service_date,
  };

  if (files && files['vehicle_photo']) {
    updates.vehicle_photo = files['vehicle_photo'][0].path.replace(/^public/, '');
  }
  if (files && files['rc_photo']) {
    updates.rc_photo = files['rc_photo'][0].path.replace(/^public/, '');
  }

  await found.update(updates);
  return found;
};

/**
 * Deletes a vehicle record.
 * @param {string} id - The vehicle UUID.
 * @returns {Promise<boolean>} True if deleted successfully.
 * @throws {Error} If the vehicle is not found.
 */
export const deleteVehicleService = async (id) => {
  const found = await vehicle.findByPk(id);
  if (!found) {
    throw new Error('Vehicle not found');
  }
  await found.destroy();
  return true;
};
