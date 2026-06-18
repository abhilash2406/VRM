/**
 * Vehicle status enum values.
 */
export const VehicleStatus = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  MAINTENANCE: 'maintenance',
};

/**
 * Vehicle type enum values.
 */
export const VehicleType = {
  TWO_WHEELER: 'two-wheeler',
  FOUR_WHEELER: 'four-wheeler',
  HEAVY_VEHICLE: 'heavy-vehicle',
};

/**
 * Vehicle subtype enum values grouped by vehicle type.
 * two-wheeler   → motorcycle | scooter
 * four-wheeler  → sedan | suv | mpv | hatchback
 * heavy-vehicle → truck | mini-bus | full-bus | tempo
 */
export const VehicleSubtype = {
  // Two-wheeler
  MOTORCYCLE: 'motorcycle',
  SCOOTER: 'scooter',
  // Four-wheeler
  SEDAN: 'sedan',
  SUV: 'suv',
  MPV: 'mpv',
  HATCHBACK: 'hatchback',
  // Heavy vehicle
  TRUCK: 'truck',
  MINI_BUS: 'mini-bus',
  FULL_BUS: 'full-bus',
  TEMPO: 'tempo',
};
