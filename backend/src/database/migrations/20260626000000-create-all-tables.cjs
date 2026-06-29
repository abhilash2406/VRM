'use strict';

/**
 * Fresh consolidated migration – creates all tables to match current Sequelize models.
 *
 * Tables (in dependency order):
 *   designations → users → login_histories
 *   permissions → permissionSettings
 *   drivers → vehicles → routes → trips → transactions
 *   contacts, galleries, bookings
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ── 1. designations ────────────────────────────────────────────────────────
    await queryInterface.createTable('designations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      designation: { type: Sequelize.STRING, allowNull: false },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // ── 2. users ───────────────────────────────────────────────────────────────
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      first_name:    { type: Sequelize.STRING, allowNull: false },
      last_name:     { type: Sequelize.STRING, allowNull: true },
      phone_number:  { type: Sequelize.STRING, allowNull: true },
      country_code:  { type: Sequelize.STRING, allowNull: true },
      email:         { type: Sequelize.STRING, allowNull: false },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      designation_id: { type: Sequelize.UUID,  allowNull: true },
      email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phone_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'INACTIVE',
      },
      last_login:  { type: Sequelize.DATE,   allowNull: true },
      photo:       { type: Sequelize.STRING, allowNull: true },
      blood_group: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('users', {
      fields: ['designation_id'],
      type: 'foreign key',
      name: 'users_designation_id_fkey',
      references: { table: 'designations', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // ── 3. login_histories ─────────────────────────────────────────────────────
    await queryInterface.createTable('login_histories', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id:      { type: Sequelize.UUID,   allowNull: false },
      login_time:   { type: Sequelize.DATE,   defaultValue: Sequelize.NOW },
      login_status: {
        type: Sequelize.ENUM('SUCCESS', 'FAILED'),
        defaultValue: 'SUCCESS',
      },
      ip_address: { type: Sequelize.STRING, allowNull: true },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('login_histories', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'login_histories_user_id_fkey',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ── 4. permissions ─────────────────────────────────────────────────────────
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      menu:     { type: Sequelize.STRING, allowNull: false },
      sub_menu: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // ── 5. permissionSettings ──────────────────────────────────────────────────
    await queryInterface.createTable('permissionSettings', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      designation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      permission_id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('permissionSettings', {
      fields: ['designation_id'],
      type: 'foreign key',
      name: 'permSettings_designation_id_fkey',
      references: { table: 'designations', field: 'id' },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('permissionSettings', {
      fields: ['permission_id'],
      type: 'foreign key',
      name: 'permSettings_permission_id_fkey',
      references: { table: 'permissions', field: 'id' },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    // ── 6. drivers ─────────────────────────────────────────────────────────────
    await queryInterface.createTable('drivers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      license_no:    { type: Sequelize.STRING, allowNull: false },
      license_photo: { type: Sequelize.STRING, allowNull: false },
      license_type:  { type: Sequelize.STRING, allowNull: false },
      shift:         { type: Sequelize.STRING, allowNull: true },
      daily_wage:    { type: Sequelize.STRING, allowNull: true },
      bata:          { type: Sequelize.STRING, allowNull: true },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      license_expiry_date:       { type: Sequelize.DATEONLY, allowNull: true },
      experience_years:          { type: Sequelize.INTEGER,  allowNull: true },
      aadhar_no:                 { type: Sequelize.STRING,   allowNull: true },
      emergency_contact_name:    { type: Sequelize.STRING,   allowNull: true },
      emergency_contact_number:  { type: Sequelize.STRING,   allowNull: true },
      availability_status: {
        type: Sequelize.ENUM('AVAILABLE', 'ON_TRIP', 'ON_LEAVE', 'SICK'),
        allowNull: true,
        defaultValue: 'AVAILABLE',
      },
      rating:  { type: Sequelize.FLOAT, allowNull: true },
      user_id: { type: Sequelize.UUID,  allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('drivers', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'drivers_user_id_fkey',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // ── 7. vehicles ────────────────────────────────────────────────────────────
    await queryInterface.createTable('vehicles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      registration_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      manufacturer:       { type: Sequelize.STRING,  allowNull: false },
      model_name:         { type: Sequelize.STRING,  allowNull: false },
      manufacturing_year: { type: Sequelize.INTEGER, allowNull: false },
      availability_status: {
        type: Sequelize.ENUM('available', 'booked', 'maintenance'),
        allowNull: false,
        defaultValue: 'available',
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      vehicle_type: {
        type: Sequelize.ENUM('two-wheeler', 'four-wheeler', 'heavy-vehicle'),
        allowNull: false,
        defaultValue: 'four-wheeler',
      },
      vehicle_subtype: {
        type: Sequelize.ENUM(
          'motorcycle', 'scooter',
          'sedan', 'suv', 'mpv', 'hatchback',
          'truck', 'mini-bus', 'full-bus', 'tempo'
        ),
        allowNull: true,
      },
      seating_capacity:  { type: Sequelize.INTEGER,  allowNull: true },
      rc_number:         { type: Sequelize.STRING,   allowNull: true },
      insurance_expiry:  { type: Sequelize.DATEONLY, allowNull: true },
      last_service_date: { type: Sequelize.DATEONLY, allowNull: true },
      next_service_date: { type: Sequelize.DATEONLY, allowNull: true },
      vehicle_photo:     { type: Sequelize.STRING,   allowNull: true },
      rc_photo:          { type: Sequelize.STRING,   allowNull: true },
      created_by:        { type: Sequelize.UUID,     allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('vehicles', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'vehicles_created_by_fkey',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // ── 8. routes ──────────────────────────────────────────────────────────────
    await queryInterface.createTable('routes', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      title:     { type: Sequelize.STRING, allowNull: false },
      from:      { type: Sequelize.STRING, allowNull: false },
      to:        { type: Sequelize.STRING, allowNull: false },
      country:   { type: Sequelize.STRING, allowNull: false },
      state:     { type: Sequelize.STRING, allowNull: false },
      locations: { type: Sequelize.ARRAY(Sequelize.JSON), allowNull: false },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // ── 9. trips ───────────────────────────────────────────────────────────────
    await queryInterface.createTable('trips', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      date:      { type: Sequelize.DATE, allowNull: false },
      driver_id: { type: Sequelize.UUID, allowNull: true },
      truck_id:  { type: Sequelize.UUID, allowNull: true },
      route_id:  { type: Sequelize.UUID, allowNull: true },
      trip_status: {
        type: Sequelize.ENUM('scheduled', 'ongoing', 'cancelled', 'completed'),
        allowNull: true,
        defaultValue: 'scheduled',
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('trips', {
      fields: ['driver_id'],
      type: 'foreign key',
      name: 'trips_driver_id_fkey',
      references: { table: 'drivers', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('trips', {
      fields: ['truck_id'],
      type: 'foreign key',
      name: 'trips_truck_id_fkey',
      references: { table: 'vehicles', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('trips', {
      fields: ['route_id'],
      type: 'foreign key',
      name: 'trips_route_id_fkey',
      references: { table: 'routes', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // ── 10. transactions ───────────────────────────────────────────────────────
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name:      { type: Sequelize.STRING, allowNull: false },
      email:     { type: Sequelize.STRING, allowNull: false },
      amount:    { type: Sequelize.STRING, allowNull: false },
      type:      { type: Sequelize.STRING, allowNull: false },
      date:      { type: Sequelize.DATE,   allowNull: true },
      driver_id: { type: Sequelize.UUID,   allowNull: true },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('transactions', {
      fields: ['driver_id'],
      type: 'foreign key',
      name: 'transactions_driver_id_fkey',
      references: { table: 'drivers', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // ── 11. contacts ───────────────────────────────────────────────────────────
    await queryInterface.createTable('contacts', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name:         { type: Sequelize.STRING, allowNull: false },
      email:        { type: Sequelize.STRING, allowNull: false },
      phone_number: { type: Sequelize.STRING, allowNull: false },
      message:      { type: Sequelize.STRING, allowNull: false },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // ── 12. galleries ──────────────────────────────────────────────────────────
    await queryInterface.createTable('galleries', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      image: { type: Sequelize.STRING, allowNull: false },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // ── 13. bookings ───────────────────────────────────────────────────────────
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      envelope_id: { type: Sequelize.STRING, allowNull: true },
      signed:      { type: Sequelize.STRING, allowNull: true },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'INACTIVE', 'DELETED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    // Drop in reverse dependency order
    await queryInterface.dropTable('bookings',          { cascade: true });
    await queryInterface.dropTable('galleries',         { cascade: true });
    await queryInterface.dropTable('contacts',          { cascade: true });
    await queryInterface.dropTable('transactions',      { cascade: true });
    await queryInterface.dropTable('trips',             { cascade: true });
    await queryInterface.dropTable('routes',            { cascade: true });
    await queryInterface.dropTable('vehicles',          { cascade: true });
    await queryInterface.dropTable('drivers',           { cascade: true });
    await queryInterface.dropTable('permissionSettings',{ cascade: true });
    await queryInterface.dropTable('permissions',       { cascade: true });
    await queryInterface.dropTable('login_histories',   { cascade: true });
    await queryInterface.dropTable('users',             { cascade: true });
    await queryInterface.dropTable('designations',      { cascade: true });
  },
};
