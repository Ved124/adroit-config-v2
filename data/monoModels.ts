// app/data/monoModels.js

export const MONO_MODELS = [
  {
    code: "UNOFLEX-450",
    family: "Unoflex Monolayer",
    label: "Unoflex 450",
    machineType: "mono",

    screwDiameter: "35 mm",
    layflatWidthMm: 450,
    layflatWidthText: "450 mm",

    thicknessRange: "15–50 µ",
    maxOutputKgHr: "25–30 KG/HR",
    screwLdRatio: "30:1",

    extruderMotorKw: "7.5",
    extruderHeaterKw: "4.1",

    dieSizeHmLd: "50/100",
    dieHeaterKw: "5.1",
    airRingBlowerKw: "1",

    nipRollSizeMm: 500,
    lineSpeed: "10–50 MPM",
    mainNipKw: "0.75",

    winderType: "Compact",
    winderMotorKw: "0.75",

    totalHeatingLoadKw: "9.2",
    totalConnectedLoadKw: "19.2",
    specificPowerConsumption: "0.34 kW/KG/HR",

    spaceRequired: "2.0 × 2.0 × 2.8 m",

  },

  {
    code: "UNOFLEX-750_900",
    family: "Unoflex Monolayer",
    label: "Unoflex 750/900",
    machineType: "mono",

    screwDiameter: "45 mm",
    layflatWidthMm: 750, // primary
    layflatWidthText: "750 / 900 mm",

    thicknessRange: "20–80 µ",
    maxOutputKgHr: "50–60 KG/HR",
    screwLdRatio: "30:1",

    extruderMotorKw: "15",
    extruderHeaterKw: "9.7",

    dieSizeHmLd: "90/175",
    dieHeaterKw: "6.7",
    airRingBlowerKw: "2.25",

    nipRollSizeMm: 800, // /1000 option in text
    nipRollSizeText: "800 / 1000 mm",

    lineSpeed: "10–50 MPM",
    mainNipKw: "0.75",

    winderType: "Compact",
    winderMotorKw: "0.75",

    totalHeatingLoadKw: "16.4",
    totalConnectedLoadKw: "35.15",
    specificPowerConsumption: "0.37 kW/KG/HR",

    spaceRequired: "2.5 × 2.5 × 4.2 m",

  },

  {
    code: "UNOFLEX-1000_1250",
    family: "Unoflex Monolayer",
    label: "Unoflex 1000/1250",
    machineType: "mono",

    screwDiameter: "55 mm",
    layflatWidthMm: 1000, // primary
    layflatWidthText: "1000 / 1250 mm",

    thicknessRange: "20–100 µ",
    maxOutputKgHr: "75–85 KG/HR",
    screwLdRatio: "30:1",

    extruderMotorKw: "22.5",
    extruderHeaterKw: "10.2",

    dieSizeHmLd: "150/275",
    dieHeaterKw: "8.8",
    airRingBlowerKw: "3.75",

    nipRollSizeMm: 1100,
    nipRollSizeText: "1100 / 1370 mm",

    lineSpeed: "6–60 MPM",
    mainNipKw: "1.12",

    winderType: "Separate",
    winderMotorKw: "1.12",

    totalHeatingLoadKw: "19",
    totalConnectedLoadKw: "47.49",
    specificPowerConsumption: "0.35 kW/KG/HR",

    spaceRequired: "4.0 × 3.5 × 5.1 m",

  },

  {
    code: "UNOFLEX-1250_1500",
    family: "Unoflex Monolayer",
    label: "Unoflex 1250/1500",
    machineType: "mono",

    screwDiameter: "60 mm",
    layflatWidthMm: 1250,
    layflatWidthText: "1250 / 1500 mm",

    thicknessRange: "20–120 µ",
    maxOutputKgHr: "110–120 KG/HR",
    screwLdRatio: "30:1",

    extruderMotorKw: "30",
    extruderHeaterKw: "15",

    dieSizeHmLd: "200/325",
    dieHeaterKw: "11.5",
    airRingBlowerKw: "5",

    nipRollSizeMm: 1370,
    nipRollSizeText: "1370 / 1625 mm",

    lineSpeed: "6–60 MPM",
    mainNipKw: "1.5",

    winderType: "Separate",
    winderMotorKw: "1",

    totalHeatingLoadKw: "26.5",
    totalConnectedLoadKw: "64",
    specificPowerConsumption: "0.35 kW/KG/HR",

    spaceRequired: "6.1 × 6.1 × 7.2 m",

  },

  {
    code: "UNOFLEX-2000",
    family: "Unoflex Monolayer",
    label: "Unoflex 2000",
    machineType: "mono",

    screwDiameter: "75 mm",
    layflatWidthMm: 2000,

    thicknessRange: "20–150 µ",
    maxOutputKgHr: "160–180 KG/HR",
    screwLdRatio: "30:1",

    extruderMotorKw: "45",
    extruderHeaterKw: "22.4",

    dieSizeHmLd: "300/475",
    dieHeaterKw: "15.3",
    airRingBlowerKw: "7.5",

    nipRollSizeMm: 2100,
    lineSpeed: "6–70 MPM",
    mainNipKw: "2",

    winderType: "Separate",
    winderMotorKw: "1.5",

    totalHeatingLoadKw: "37.7",
    totalConnectedLoadKw: "93.7",
    specificPowerConsumption: "0.35 kW/KG/HR",

    spaceRequired: "6.5 × 6.5 × 8.2 m",

  },

  {
    code: "UNOFLEX-2500",
    family: "Unoflex Monolayer",
    label: "Unoflex 2500",
    machineType: "mono",

    screwDiameter: "90 mm",
    layflatWidthMm: 2500,

    thicknessRange: "20–150 µ",
    maxOutputKgHr: "220–230 KG/HR",
    screwLdRatio: "30:1",

    extruderMotorKw: "50",
    extruderHeaterKw: "29.5",

    dieSizeHmLd: "400/600",
    dieHeaterKw: "18.7",
    airRingBlowerKw: "10",

    nipRollSizeMm: 2650,
    lineSpeed: "6–70 MPM",
    mainNipKw: "3",

    winderType: "Separate",
    winderMotorKw: "2",

    totalHeatingLoadKw: "48.2",
    totalConnectedLoadKw: "113.2",
    specificPowerConsumption: "0.33 kW/KG/HR",

    spaceRequired: "7.5 × 6.5 × 8.7 m",

  },

  {
    code: "UNOFLEX-3000",
    family: "Unoflex Monolayer",
    label: "Unoflex 3000",
    machineType: "mono",

    screwDiameter: "100 mm",
    layflatWidthMm: 3000,

    thicknessRange: "20–200 µ",
    maxOutputKgHr: "250–280 KG/HR",
    screwLdRatio: "30:1",

    extruderMotorKw: "60",
    extruderHeaterKw: "31.5",

    dieSizeHmLd: "450/700",
    dieHeaterKw: "22.8",
    airRingBlowerKw: "11.5",

    nipRollSizeMm: 3150,
    lineSpeed: "6–70 MPM",
    mainNipKw: "3",

    winderType: "Separate",
    winderMotorKw: "2",

    totalHeatingLoadKw: "54.3",
    totalConnectedLoadKw: "130.8",
    specificPowerConsumption: "0.33 kW/KG/HR",

    spaceRequired: "7.5 × 6.5 × 9.5 m",

  },
];

