import permissions from '../../models/permission.js';
import designations from '../../models/designation.js';
import permissionSetting from '../../models/permissionSetting.js';

// fetch all permissions
export const getAllPermissions = async (req, res, next) => {
  try {
    const data = await permissions.findAll({});

    res.send({
      success: true,
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e,
    });
  }
};

// post user permissions
export const grantPermissions = async (req, res, next) => {
  try {
    await permissionSetting.destroy({
      where: { designationId: req.params.id },
    });
    for (item of req.body) {
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
    
    let role = await designations.findByPk(req.params.id);
    
    const permissionArray = permission_data.map((data) => {
      return {
        menu: data.permission.menu,
        subMenu: data.permission.subMenu,
      };
    });
    // console.log('mappingArray', mappingArray);
    let { socket } = req.app.locals;
    socket.emit('GetPermissions', {
      data: permissionArray,
      role: role.designation,
    });
    res.send({
      success: true,
      message: 'Updated successfully',
    });
  } catch (e) {
    console.log('error', e.message);
    res.json({
      success: false,
      message: e,
    });
  }
};

export const getUserData = async (req, res, next) => {
  try {
   
    const allowed = await permissionSetting.findAll({
      where: {
        designationId: req.params.id,
      },
    });
    
    let a = allowed.map((item) => ({
      permissionId: item.permissionId,
      designationId: item.designationId,
    }));

    // console.log('newData', a);

    res.send({
      success: true,
      message: 'successfully fetched data',
      data: a,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
