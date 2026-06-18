'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create all tables
    await queryInterface.createTable('brands', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      brandId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('contacts', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('read', 'unread'),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('designations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('drivers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      licenseNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      licensePhoto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userPhoto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      licenseType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shift: {
        type: Sequelize.STRING,
      },
      dailyWage: {
        type: Sequelize.STRING,
      },
      bata: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('approved', 'reject', 'pending'),
        defaultValue: 'pending',
      },
      truckId: {
        type: Sequelize.UUID,
      },
      routeId: {
        type: Sequelize.UUID,
      },
      userId: {
        type: Sequelize.UUID,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('galleries', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('login_histories', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      loginTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      status: {
        type: Sequelize.ENUM('SUCCESS', 'FAILED'),
        defaultValue: 'SUCCESS',
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      menu: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subMenu: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('permissionSettings', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      designationId: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      permissionId: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('routes', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      locations: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('read', 'unread'),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
      },
      driverId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('trips', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      driverId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      truckId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      routeId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'ongoing', 'cancelled', 'completed'),
        defaultValue: 'scheduled',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('trucks', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      variant: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      VIN: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      engineNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chassisNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      RCNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      yrManufacture: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rcPhoto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      truckPhoto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      condition: {
        type: Sequelize.ENUM('working', 'not-working'),
        defaultValue: 'working',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'deactive', 'pending'),
        defaultValue: 'active',
      },
      createdBy: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('truckModels', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      modelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brandId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      designationId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
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
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      signed: {
        type: Sequelize.ENUM('Signed', 'Unsigned'),
        defaultValue: 'Unsigned',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('variants', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      modelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('drivers', {
      fields: ['truckId'],
      type: 'foreign key',
      name: 'drivers_truckId_fkey',
      references: {
        table: 'trucks',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('drivers', {
      fields: ['routeId'],
      type: 'foreign key',
      name: 'drivers_routeId_fkey',
      references: {
        table: 'routes',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('drivers', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'drivers_userId_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('login_histories', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'login_histories_userId_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('permissionSettings', {
      fields: ['designationId'],
      type: 'foreign key',
      name: 'permissionSettings_designationId_fkey',
      references: {
        table: 'designations',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('permissionSettings', {
      fields: ['permissionId'],
      type: 'foreign key',
      name: 'permissionSettings_permissionId_fkey',
      references: {
        table: 'permissions',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('transactions', {
      fields: ['driverId'],
      type: 'foreign key',
      name: 'transactions_driverId_fkey',
      references: {
        table: 'drivers',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('trips', {
      fields: ['driverId'],
      type: 'foreign key',
      name: 'trips_driverId_fkey',
      references: {
        table: 'drivers',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('trips', {
      fields: ['truckId'],
      type: 'foreign key',
      name: 'trips_truckId_fkey',
      references: {
        table: 'trucks',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('trips', {
      fields: ['routeId'],
      type: 'foreign key',
      name: 'trips_routeId_fkey',
      references: {
        table: 'routes',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('trucks', {
      fields: ['createdBy'],
      type: 'foreign key',
      name: 'trucks_createdBy_fkey',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('users', {
      fields: ['designationId'],
      type: 'foreign key',
      name: 'users_designationId_fkey',
      references: {
        table: 'designations',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop all tables
    await queryInterface.dropTable('brands', { cascade: true });
    await queryInterface.dropTable('contacts', { cascade: true });
    await queryInterface.dropTable('designations', { cascade: true });
    await queryInterface.dropTable('drivers', { cascade: true });
    await queryInterface.dropTable('galleries', { cascade: true });
    await queryInterface.dropTable('login_histories', { cascade: true });
    await queryInterface.dropTable('permissions', { cascade: true });
    await queryInterface.dropTable('permissionSettings', { cascade: true });
    await queryInterface.dropTable('routes', { cascade: true });
    await queryInterface.dropTable('transactions', { cascade: true });
    await queryInterface.dropTable('trips', { cascade: true });
    await queryInterface.dropTable('trucks', { cascade: true });
    await queryInterface.dropTable('truckModels', { cascade: true });
    await queryInterface.dropTable('users', { cascade: true });
    await queryInterface.dropTable('variants', { cascade: true });
  },
};
