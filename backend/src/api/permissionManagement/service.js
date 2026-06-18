import permissions from '../../models/permission.js';
import designations from '../../models/designation.js';
import permissionSetting from '../../models/permissionSetting.js';

/**
 * Retrieves all defined permissions in the system.
 * @returns {Promise<Array>} A list of permission records.
 */
export const getAllPermissionsService = async () => {
  return await permissions.findAll({});
};

/**
 * Grants permissions to a designation, replacing any existing settings.
 * @param {string} id - The UUID of the designation.
 * @param {Array<Object>} data - The new permissions payload.
 * @param {Object} socket - The Socket.io instance for real-time broadcast.
 * @returns {Promise<boolean>} True if updated successfully.
 */
export const grantPermissionsService = async (id, data, socket) => {
  await permissionSetting.destroy({ where: { designation_id: id } });

  let desId;
  for (const item of data) {
    let a = await permissionSetting.create({
      designation_id: item.designation_id,
      permission_id: item.permission_id || item.permissionId,
    });
    desId = a.designation_id;
  }

  const permission_data = await permissionSetting.findAll({
    where: { designation_id: desId },
    include: permissions,
  });

  const role = await designations.findByPk(id);

  const permissionArray = permission_data.map((item) => ({
    menu: item.permission.menu,
    sub_menu: item.permission.sub_menu,
  }));

  if (socket) {
    socket.emit('GetPermissions', {
      data: permissionArray,
      role: role.designation,
    });
  }

  return true;
};

/**
 * Fetches all active permission settings for a given designation.
 * @param {string} id - The UUID of the designation.
 * @returns {Promise<Array>} List of simplified permission objects.
 */
export const getUserDataService = async (id) => {
  const allowed = await permissionSetting.findAll({
    where: { designation_id: id },
  });

  return allowed.map((item) => ({
    permission_id: item.permission_id,
    designation_id: item.designation_id,
  }));
};
