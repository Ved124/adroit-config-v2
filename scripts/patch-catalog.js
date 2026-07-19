const fs = require('fs');

const data = JSON.parse(fs.readFileSync('public/admin-data/components.json', 'utf8'));

// Hardcoded price maps to inject
const CORONA_PRICES = {
  "U20\"": 70000, "U24\"": 70000, "U32\"": 80000, "U40\"": 90000, "U50\"": 115000, "U72\"": 165000, "U110\"": 360000,
  "D26\"": 85000, "D32\"": 95000, "D40\"": 135000, "D50\"": 160000, "D60\"": 200000,
  "1120": 425000, "1370": 550000, "1450": 625000, "1620": 715000, "1870": 715000, "1970": 785000, "2120": 850000, "2370": 975000, "2620": 1025000
};

const WEB_GUIDE_PRICES = {
  "1120": 190000, "1370": 205000, "1450": 210000, "1620": 235000, "1870": 250000, "1970": 260000,
  "2120": 275000, "2370": 290000, "2620": 325000, "2870": 345000, "3000": 365000
};

const HEAT_EXCHANGER_PRICES = {
  "1120": 250000, "1370": 285000, "1450": 305000, "1620": 335000, "1870": 360000, "1970": 390000,
  "2120": 425000, "2370": 460000, "2620": 490000, "2870": 510000, "3000": 525000
};
const HEAT_EXCHANGER_UNO_PRICES = { "100": 65000, "200": 85000, "300": 105000, "400": 125000, "500": 145000 };
const HEAT_EXCHANGER_DUO_PRICES = { "100": 85000, "200": 105000, "300": 125000, "400": 145000, "500": 165000 };

const HOPPER_LOADER_MULTI = {
  "1120": 195000, "1370": 195000, "1450": 195000, "1620": 195000, "1870": 235000, "1970": 235000,
  "2120": 235000, "2370": 235000, "2620": 235000
};

const CHILLER_PRICES = {
  "5 TR": 85000, "10 TR": 160000, "15 TR": 235000, "20 TR": 310000, "25 TR": 385000
};

const EPC_PRICES = {
  "1120": 850000, "1370": 850000, "1450": 850000, "1620": 850000, "1870": 850000
};

// Patch the data
if (data.corona) {
  data.corona.forEach(c => {
    if (c.isDynamic) {
      c.pricingType = 'size';
      c.prices = CORONA_PRICES;
    }
  });
}

if (data.webGuide) {
  data.webGuide.forEach(w => {
    if (w.isDynamic) {
      w.pricingType = 'size';
      w.prices = WEB_GUIDE_PRICES;
    }
  });
}

if (data.heatExchanger) {
  data.heatExchanger.forEach(h => {
    if (h.isDynamic) {
      h.pricingType = 'size';
      if (h.id === 'heat-exchanger-uno') h.prices = HEAT_EXCHANGER_UNO_PRICES;
      else if (h.id === 'heat-exchanger-duo') h.prices = HEAT_EXCHANGER_DUO_PRICES;
      else h.prices = HEAT_EXCHANGER_PRICES;
    }
  });
}

if (data.materialHandling) {
  data.materialHandling.forEach(m => {
    if (m.isDynamic) {
      m.pricingType = 'size';
      // For Hopper Loader Trio, Duo, etc if they don't have prices
      if (!m.prices || Object.keys(m.prices).length === 0) {
          m.prices = HOPPER_LOADER_MULTI;
      }
    }
  });
}

if (data.chiller) {
  data.chiller.forEach(c => {
    if (c.isDynamic) {
      c.pricingType = 'size';
      c.prices = CHILLER_PRICES;
    }
  });
}

if (data.epc) {
  data.epc.forEach(c => {
    if (c.isDynamic) {
      c.pricingType = 'size';
      if (!c.prices || Object.keys(c.prices).length === 0) {
          c.prices = EPC_PRICES;
      }
    }
  });
}

if (data.optionalFeatures) {
  data.optionalFeatures.forEach(c => {
    if (c.isDynamic) {
      c.pricingType = 'size';
      if (!c.prices || Object.keys(c.prices).length === 0) {
          c.prices = { "default": 0 };
      }
    }
  });
}

// Write back
fs.writeFileSync('public/admin-data/components.json', JSON.stringify(data, null, 2));
console.log('Patched components.json successfully');
