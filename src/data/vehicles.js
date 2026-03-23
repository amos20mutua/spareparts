export const vehicleCatalog = {
  Toyota: {
    models: {
      Axio: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
      Fielder: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
      Vitz: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
    },
  },
  Nissan: {
    models: {
      'X-Trail': ['2013', '2014', '2015', '2016', '2017', '2018'],
      Note: ['2012', '2013', '2014', '2015', '2016', '2017'],
    },
  },
  Mazda: {
    models: {
      Demio: ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
      'CX-5': ['2013', '2014', '2015', '2016', '2017', '2018', '2019'],
    },
  },
  Subaru: {
    models: {
      Forester: ['2013', '2014', '2015', '2016', '2017', '2018'],
      Impreza: ['2012', '2013', '2014', '2015', '2016', '2017'],
    },
  },
  Honda: {
    models: {
      Fit: ['2013', '2014', '2015', '2016', '2017', '2018', '2019'],
      'CR-V': ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
    },
  },
};

export const vehicleMakes = Object.keys(vehicleCatalog);

export function getVehicleModels(make) {
  if (!make || !vehicleCatalog[make]) return [];
  return Object.keys(vehicleCatalog[make].models);
}

export function getVehicleYears(make, model) {
  if (!make || !model || !vehicleCatalog[make]?.models[model]) return [];
  return vehicleCatalog[make].models[model];
}
