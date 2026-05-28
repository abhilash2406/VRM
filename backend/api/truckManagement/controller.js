import Brand from '../../models/brand.js';
import TruckModel from '../../models/truckModel.js';
import Variant from '../../models/variant.js';
import trucks from '../../models/truck.js';
import login from '../../models/login.js';
import users from '../../models/users.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

export const getTruckBrands = async (req, res, next) => {
  try {
    const data = await Brand.findAll();
    res.send({
      success: true,
      message: 'brand fetched',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

export const getTruckModels = async (req, res, next) => {
  try {
    const data = await TruckModel.findAll();
    res.send({
      success: true,
      message: 'truck models fetched',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

export const getTruckVariants = async (req, res, next) => {
  try {
    const data = await Variant.findAll();
    res.send({
      success: true,
      message: 'truck variants fetched',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
export const correspondingData = async (req, res, next) => {
  try {
    // console.log(req.body);
    if (!req.body.brandId && !req.body.modelId) {
      console.log('not bid entered');
      const brand_data = await Brand.findAll({});
      res.send({
        success: true,
        brand: brand_data,
      });
    } else if (req.body.brandId && !req.body.modelId) {
      console.log('bid entered', req.body);
      const brand_data = await Brand.findAll({});
      const model_data = await TruckModel.findAll({
        where: {
          brandId: req.body.brandId,
        },
      });
      res.send({
        success: true,
        model: model_data,
        brand: brand_data,
      });
    } else {
      const brand_data = await Brand.findAll({});
      const model_data = await TruckModel.findAll({
        where: {
          brandId: req.body.brandId,
        },
      });
      const variant_data = await Variant.findAll({
        where: {
          modelId: req.body.modelId,
        },
      });
      res.send({
        success: true,
        model: model_data,
        brand: brand_data,
        variant: variant_data,
      });
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

// add truck
export const addTrucks = async (req, res, next) => {
  try {
    console.log(req.body);
    const truck_exist = await trucks.findAll({
      where: {
        [Op.or]: [
          {
            VIN: {
              [Op.like]: `%${req.body.VIN}%`,
            },
          },
          {
            RCNo: {
              [Op.like]: `%${req.body.RCNo}%`,
            },
          },
        ],
      },
    });

    if (truck_exist.length) {
      res.send({
        success: false,
        message: 'this truck is already added',
      });
    } else {
      console.log('req.body', req.body);
      const rcPhotoPath = req.files['rcPhoto'][0].path.replace(/^public/, '');
      const truckPhotoPath = req.files['truckPhoto'][0].path.replace(
        /^public/,
        ''
      );

      const truckBrand = await Brand.findOne({
        where: {
          brandId: req.body.brand,
        },
      });

      const truckModel = await TruckModel.findOne({
        where: {
          modelId: req.body.model,
        },
      });

      const truckVariant = await Variant.findOne({
        where: {
          id: req.body.variant,
        },
      });

      const token = req.header('Authorization')
        ? req.header('Authorization').replace('Bearer ', '')
        : null;
      // console.log('token', token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let who = await login.findByPk(decoded.id);
      let crctUser = await users.findOne({
        where: {
          loginId: who.id,
        },
      });
      // console.log('crctUser', crctUser)

      const data = await trucks.create({
        brand: truckBrand.name,
        model: truckModel.name,
        variant: truckVariant.name,
        VIN: req.body.VIN,
        engineNo: req.body.engineNo,
        chassisNo: req.body.chassisNo,
        RCNo: req.body.RCNo,
        yrManufacture: req.body.yrManufacture,
        rcPhoto: rcPhotoPath,
        truckPhoto: truckPhotoPath,
        condition: req.body.condition,
        status: req.body.status,
        isActive:
          req.body.status === 'active' && req.body.condition === 'working'
            ? true
            : false,

        createdBy: crctUser.id,
      });

      console.log(crctUser);
      res.send({
        success: true,
        message: 'truck added',
      });
    }
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

// get all trucks
export const getAllTruckData = async (req, res, next) => {
  try {
    const data = await trucks.findAll();
    res.send({
      success: true,
      message: 'data retrieved successfully',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};
// get active trucks
export const getActiveTrucks = async (req, res, next) => {
  try {
    const data = await trucks.findAll({
      where: {
        isActive: true,
      },
    });
    res.send({
      success: true,
      message: 'data retrieved successfully',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

// get all trucks
export const truckToEdit = async (req, res, next) => {
  try {
    // console.log('req.params.id', req.params.id);
    const data = await trucks.findByPk(req.params.id);
    res.send({
      success: true,
      message: 'data retrieved successfully',
      data: data,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e.message,
    });
  }
};

//dlt trucks
export const dltTruck = async (req, res) => {
  const id = req.params.id;
  try {
    const feedback = await trucks.findByPk(id);
    if (feedback.length === 0) {
      return res.send({
        success: false,
        message: 'not matching data found to delete',
      });
    } else {
      await feedback.destroy();
      return res.send({
        success: true,
        message: ' deleted successfully',
      });
    }
  } catch (err) {
    return es.send({
      success: false,
      message: err.message,
    });
  }
};
export const updateTruck = async (req, res, next) => {
  console.log('req.body', req.body);
  const id = req.params.id;
  console.log('id', id);
  const truck_exist = await trucks.findByPk(id);
  console.log(truck_exist)
  if(!truck_exist){
    res.send({
      success: false,
      message:'truck not exists'
    })
  }else {
    const rcPhotoPath = req.files['rcPhoto'][0].path.replace(/^public/, '');
    const truckPhotoPath = req.files['truckPhoto'][0].path.replace(
      /^public/,
      ''
    );

    const truckBrand = await Brand.findOne({
      where: {
        brandId: req.body.brand,
      },
    });

    const truckModel = await TruckModel.findOne({
      where: {
        modelId: req.body.model,
      },
    });

    const truckVariant = await Variant.findOne({
      where: {
        id: req.body.variant,
      },
    });

    await truck_exist.update({
      brand: truckBrand.name,
      model: truckModel.name,
      variant: truckVariant.name,
      VIN: req.body.VIN,
      engineNo: req.body.engineNo,
      chassisNo: req.body.chassisNo,
      RCNo: req.body.RCNo,
      yrManufacture: req.body.yrManufacture,
      rcPhoto: rcPhotoPath,
      truckPhoto: truckPhotoPath,
      condition: req.body.condition,
      status: req.body.status,
      isActive:
        req.body.status === 'active' && req.body.condition === 'working'
          ? true
          : false,

     
    });
    res.send({
      success: true,
      message:'updated successfully'
    })
  }
};
