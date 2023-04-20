const permissions = require('../../models/permission');
const designations = require('../../models/designation');
const permissionSetting = require('../../models/permissionSetting');

// fetch all permissions
exports.getAllPermissions = async (req, res, next) => {
  try {
    const data = await permissions.findAll({});

    res.json({
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
exports.grantPermissions = async (req, res, next) => {
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
    // console.log('permission_data', permission_data)
    let role = await designations.findByPk(req.params.id);
    // console.log(role);
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

exports.getUserData = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    const allowed = await permissionSetting.findAll({
      where: {
        designationId: req.params.id,
      },
    });
    // console.log(allowed);
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
