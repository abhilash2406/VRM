import permissions from '../../models/permission.js';
import designations from '../../models/designation.js';
import permissionSetting from '../../models/permissionSetting.js';

export const getAllPermissionsService = async () => {
  return await permissions.findAll({});
};

export const grantPermissionsService = async (id, data, socket) => {
  await permissionSetting.destroy({ where: { designationId: id } });

  let desId;
  for (const item of data) {
    let a = await permissionSetting.create({
      designationId: item.designationId,
      permissionId: item.permissionId,
    });
    desId = a.designationId;
  }

  const permission_data = await permissionSetting.findAll({
    where: { designationId: desId },
    include: permissions,
  });

  const role = await designations.findByPk(id);

  const permissionArray = permission_data.map((item) => ({
    menu: item.permission.menu,
    subMenu: item.permission.subMenu,
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
    where: { designationId: id },
  });

  return allowed.map((item) => ({
    permissionId: item.permissionId,
    designationId: item.designationId,
  }));
};
