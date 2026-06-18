import permissions from '../../models/permission.js';
import designations from '../../models/designation.js';
import permissionSetting from '../../models/permissionSetting.js';

export const getAllPermissionsService = async () => {
  return await permissions.findAll({});
};

export const grantPermissionsService = async (id, data, socket) => {
  await permissionSetting.destroy({ where: { designation_id: id } });

  let desId;
  for (const item of data) {
    let a = await permissionSetting.create({
      designation_id: item.designation_id,
      permissionId: item.permissionId,
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

export const getUserDataService = async (id) => {
  const allowed = await permissionSetting.findAll({
    where: { designation_id: id },
  });

  return allowed.map((item) => ({
    permissionId: item.permissionId,
    designation_id: item.designation_id,
  }));
};
