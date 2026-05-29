import { logger } from '../../config/winston-config.js';
import Brand from '../brand.js';
import TruckModel from '../truckModel.js';
import Variant from '../variant.js';

const brandsData = [
  { brandId: 1, name: 'Scania' },
  { brandId: 2, name: 'Daf' },
  { brandId: 3, name: 'benz ' },
];

const modelsData = [
  { modelId: 1, name: 'R580 V8 ', brandId: 1 },
  { modelId: 2, name: 'R500', brandId: 1 },
  { modelId: 3, name: 'R puller', brandId: 1 },
  { modelId: 4, name: 'LF', brandId: 2 },
  { modelId: 5, name: 'CF', brandId: 2 },
  { modelId: 6, name: 'XDC', brandId: 2 },
  { modelId: 7, name: 'LG', brandId: 3 },
  { modelId: 8, name: 'LR', brandId: 3 },
  { modelId: 9, name: 'UniMog', brandId: 3 },
];

const variantsData = [
  { name: 'Puller Tractor', modelId: 1 },
  { name: 'LX', modelId: 1 },
  { name: 'LF electric', modelId: 2 },
  { name: 'CF electric', modelId: 2 },
  { name: 'puller c', modelId: 3 },
  { name: 'puller cd', modelId: 3 },
  { name: 'lf electric', modelId: 4 },
  { name: '1015R HE', modelId: 4 },
  { name: '1217C FE', modelId: 5 },
  { name: '1217C HE', modelId: 5 },
  { name: '1617C FE', modelId: 6 },
  { name: '1617C HE', modelId: 6 },
  { name: 'lg Z ', modelId: 7 },
  { name: 'lg Zr Luxury', modelId: 7 },
  { name: ' Xplorer', modelId: 8 },
  { name: ' Xtreme', modelId: 8 },
  { name: ' Cruiser', modelId: 9 },
  { name: ' Toofan', modelId: 9 },
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
