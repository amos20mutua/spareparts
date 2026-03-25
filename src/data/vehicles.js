function yearRange(start, end) {
  const years = [];
  for (let year = end; year >= start; year -= 1) {
    years.push(String(year));
  }
  return years;
}

function modelYears(start, end) {
  return yearRange(start, end);
}

// Keep this file easy to grow: add a make, then add models with year ranges.
export const vehicleCatalog = {
  Toyota: {
    models: {
      Axio: modelYears(2007, 2024),
      Fielder: modelYears(2007, 2024),
      Vitz: modelYears(2005, 2020),
      Premio: modelYears(2002, 2021),
      Allion: modelYears(2002, 2021),
      Corolla: modelYears(2000, 2024),
      Hilux: modelYears(2000, 2024),
      Probox: modelYears(2002, 2024),
      Wish: modelYears(2003, 2017),
      Noah: modelYears(2001, 2024),
      Harrier: modelYears(2003, 2024),
      'Land Cruiser': modelYears(2000, 2024),
      RAV4: modelYears(2000, 2024),
    },
  },
  Nissan: {
    models: {
      'X-Trail': modelYears(2001, 2024),
      Note: modelYears(2005, 2024),
      Tiida: modelYears(2004, 2019),
      Wingroad: modelYears(2001, 2018),
      March: modelYears(2002, 2022),
      Dualis: modelYears(2007, 2014),
      Juke: modelYears(2010, 2024),
      Navara: modelYears(2005, 2024),
      Patrol: modelYears(2000, 2024),
      Serena: modelYears(2001, 2024),
    },
  },
  Mazda: {
    models: {
      Demio: modelYears(2002, 2024),
      'CX-3': modelYears(2015, 2024),
      'CX-5': modelYears(2012, 2024),
      Atenza: modelYears(2002, 2022),
      Axela: modelYears(2003, 2019),
      Biante: modelYears(2008, 2018),
      'BT-50': modelYears(2006, 2024),
      Premacy: modelYears(2000, 2018),
      Verisa: modelYears(2004, 2016),
    },
  },
  Subaru: {
    models: {
      Forester: modelYears(2000, 2024),
      Impreza: modelYears(2000, 2024),
      Legacy: modelYears(2000, 2024),
      Outback: modelYears(2000, 2024),
      XV: modelYears(2011, 2024),
      Exiga: modelYears(2008, 2018),
    },
  },
  Honda: {
    models: {
      Fit: modelYears(2001, 2024),
      'CR-V': modelYears(2000, 2024),
      Vezel: modelYears(2013, 2024),
      Insight: modelYears(2000, 2024),
      Civic: modelYears(2000, 2024),
      Accord: modelYears(2000, 2024),
      Stream: modelYears(2000, 2014),
      Airwave: modelYears(2005, 2010),
      Stepwgn: modelYears(2001, 2024),
    },
  },
  Mitsubishi: {
    models: {
      Pajero: modelYears(2000, 2021),
      Outlander: modelYears(2001, 2024),
      Lancer: modelYears(2000, 2018),
      ASX: modelYears(2010, 2024),
      Delica: modelYears(2000, 2024),
      Canter: modelYears(2000, 2024),
    },
  },
  Suzuki: {
    models: {
      Swift: modelYears(2004, 2024),
      Alto: modelYears(2000, 2024),
      Escudo: modelYears(2000, 2024),
      Jimny: modelYears(2000, 2024),
      Solio: modelYears(2005, 2024),
      WagonR: modelYears(2000, 2024),
    },
  },
  Isuzu: {
    models: {
      DMax: modelYears(2003, 2024),
      MUX: modelYears(2013, 2024),
      NQR: modelYears(2000, 2024),
      Elf: modelYears(2000, 2024),
    },
  },
  MercedesBenz: {
    models: {
      'C-Class': modelYears(2000, 2024),
      'E-Class': modelYears(2000, 2024),
      MClass: modelYears(2000, 2015),
      GLC: modelYears(2015, 2024),
      Sprinter: modelYears(2000, 2024),
    },
  },
  BMW: {
    models: {
      '1 Series': modelYears(2004, 2024),
      '3 Series': modelYears(2000, 2024),
      '5 Series': modelYears(2000, 2024),
      X1: modelYears(2009, 2024),
      X3: modelYears(2003, 2024),
      X5: modelYears(2000, 2024),
    },
  },
  Volkswagen: {
    models: {
      Golf: modelYears(2000, 2024),
      Passat: modelYears(2000, 2024),
      Tiguan: modelYears(2007, 2024),
      Touareg: modelYears(2002, 2024),
      Polo: modelYears(2000, 2024),
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
