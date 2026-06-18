import { logger } from '../../config/winston-config.js';
import Brand from '../brand.js';
import TruckModel from '../truckModel.js';
import Variant from '../variant.js';

const brandsData = [
  { brand_id: 1, name: 'Scania' },
  { brand_id: 2, name: 'Daf' },
  { brand_id: 3, name: 'benz ' },
];

const modelsData = [
  { model_id: 1, name: 'R580 V8 ', brand_id: 1 },
  { model_id: 2, name: 'R500', brand_id: 1 },
  { model_id: 3, name: 'R puller', brand_id: 1 },
  { model_id: 4, name: 'LF', brand_id: 2 },
  { model_id: 5, name: 'CF', brand_id: 2 },
  { model_id: 6, name: 'XDC', brand_id: 2 },
  { model_id: 7, name: 'LG', brand_id: 3 },
  { model_id: 8, name: 'LR', brand_id: 3 },
  { model_id: 9, name: 'UniMog', brand_id: 3 },
];

const variantsData = [
  { name: 'Puller Tractor', model_id: 1 },
  { name: 'LX', model_id: 1 },
  { name: 'LF electric', model_id: 2 },
  { name: 'CF electric', model_id: 2 },
  { name: 'puller c', model_id: 3 },
  { name: 'puller cd', model_id: 3 },
  { name: 'lf electric', model_id: 4 },
  { name: '1015R HE', model_id: 4 },
  { name: '1217C FE', model_id: 5 },
  { name: '1217C HE', model_id: 5 },
  { name: '1617C FE', model_id: 6 },
  { name: '1617C HE', model_id: 6 },
  { name: 'lg Z ', model_id: 7 },
  { name: 'lg Zr Luxury', model_id: 7 },
  { name: ' Xplorer', model_id: 8 },
  { name: ' Xtreme', model_id: 8 },
  { name: ' Cruiser', model_id: 9 },
  { name: ' Toofan', model_id: 9 },
];
Brand.bulkCreate(brandsData)
  .then(() => {
    logger.info('Brands created successfully');
  })
  .catch((err) => {
    logger.error('Error creating brands:', err);
  });
TruckModel.bulkCreate(modelsData)
  .then(() => {
    logger.info('model created successfully');
  })
  .catch((err) => {
    logger.error('Error creating models:', err);
  });
Variant.bulkCreate(variantsData)
  .then(() => {
    logger.info('variant created successfully');
  })
  .catch((err) => {
    logger.error('Error creating variants:', err);
  });
