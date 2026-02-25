// data/addons/electricalPanel.ts
// Electrical panel, drives & automation packages (optional but typically selected)

export type MachineType = "mono" | "aba" | "3layer" | "5layer";

export interface TechSpecMap {
  [label: string]: string;
}

export interface ElectricalAddon {
  id: string;
  name: string;
  type: "basic-panel" | "ac-drive-panel" | "plc-hmi" | "advanced-plc";
  machineTypes: MachineType[];
  usedInModels?: string[];
  image: string;
  cardDesc: string;
  price: number;
  qty?: number;
  techDesc: TechSpecMap;
  shortDesc?: string;
}

export const ELECTRICAL_ADDONS: ElectricalAddon[] = [
  // ---------------- BASIC PANEL – MONO ----------------
  {
    id: "panel-basic-mono",
    name: "Electrical Control Panel – Basic",
    type: "basic-panel",
    machineTypes: ["mono"],
    usedInModels: ["UNOFLEX-450", "UNOFLEX-750_900"],
    image: "/images/addons/electrical/panel-basic.png",
    cardDesc:
      "Basic control panel with PID temperature controllers and AC drives for monolayer lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Panel Type":
        "Floor mounted MS powder coated enclosure with front door.",
      "Temperature Control":
        "PID temperature controllers for barrel, die and air ring zones.",
      "Drives":
        "AC variable frequency drives for extruder, haul-off and winder motors.",
      "Protection":
        "MCBs, contactors, overload relays and emergency stop circuits.",
      "Indicators":
        "Digital temperature indicators, ammeters and voltmeters as required.",
      "Supply":
        "Suitable for 3 phase, 415 V, 50 Hz AC mains (or as specified).",
    },
    shortDesc: "Basic panel with PID temp control & AC drives for mono lines.",
  },

  // ---------------- STANDARD AC DRIVE PANEL – ABA / 3-LAYER MID SIZE ----------------
  {
    id: "panel-acdrive-standard",
    name: "AC Drive Control Panel – Standard",
    type: "ac-drive-panel",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["DUOFLEX-750", "DUOFLEX-1000", "AE-1125", "AE-1350"],
    image: "/images/addons/electrical/panel-acdrive.png",
    cardDesc:
      "Central AC drive panel with coordinated speed reference for co-ex lines.",
    price: 0,
    qty: 1,
    techDesc: {
      "Panel Type":
        "Floor mounted, compartmentalized panel with segregated power & control wiring.",
      "Drives":
        "Individual AC drives for extruders, haul-off, winder and auxiliary motors.",
      "Speed Reference":
        "Master line speed reference with follower drives for coordinated speed control.",
      "Temperature Control":
        "PID temperature controllers for each heating zone, with digital display.",
      "Interlocks":
        "Safety interlocks for heaters, motors, emergency stop and doors.",
      "Wiring":
        "Numbered wiring, ferruled terminations, cable entry from bottom/top as per layout.",
    },
    shortDesc: "AC drive panel with coordinated speed reference for co-ex lines.",
  },

  // ---------------- PLC + HMI PANEL – 3-LAYER / HIGHER END ----------------
  {
    id: "panel-plc-hmi",
    name: "PLC + HMI Control Panel",
    type: "plc-hmi",
    machineTypes: ["aba", "3layer"],
    usedInModels: ["AE-1350", "AE-1625", "AE-1870"],
    image: "/images/addons/electrical/panel-plc-hmi.png",
    cardDesc:
      "PLC based automation panel with touch screen HMI for recipe and line control.",
    price: 0,
    qty: 1,
    techDesc: {
      "Automation":
        "Central PLC with distributed I/O for machine, temperature and drive control.",
      "HMI":
        "Color touch screen HMI for parameter setting, recipes and alarms.",
      "Drives":
        "Vector / VFD drives with communication (Modbus / Profinet, model dependent).",
      "Recipes":
        "Recipe storage for different film structures (layer ratio, temperatures, speeds).",
      "Diagnostics":
        "Alarm history, event logging and status pages for easy troubleshooting.",
      "Integration":
        "Provision to interface with gravimetric system, gauge control and IBC (where selected).",
    },
    shortDesc: "PLC automation panel with touch HMI for recipe & line control.",
  },

  // ---------------- ADVANCED PLC PANEL – WIDE WEB / FUTURE 5-LAYER ----------------
  {
    id: "panel-advanced-plc",
    name: "Advanced PLC + Drive Panel",
    type: "advanced-plc",
    machineTypes: ["3layer", "5layer"],
    usedInModels: ["AE-2125", "AE-2370", "AE-2625"],
    image: "/images/addons/electrical/panel-advanced.png",
    cardDesc:
      "High-end PLC/drive panel for wide web industrial blown film lines with full integration.",
    price: 0,
    qty: 1,
    techDesc: {
      "System":
        "Central PLC system with integrated motion/drives platform (brand/model as per final offer).",
      "HMI":
        "Large touch panel HMI at main operator station plus remote panels as required.",
      "Networking":
        "Industrial Ethernet network for drives, I/O, gravimetric, gauge system and IBC.",
      "Features":
        "Recipe management, trend logging, production reports and maintenance reminders.",
      "Safety":
        "Emergency stop chain, safety relays, door interlocks and safety category components (as applicable).",
      "Remote Access":
        "Option for remote diagnostics / support via VPN or secure link (if offered).",
    },
    shortDesc: "High-end PLC/drive panel for wide web lines with full integration.",
  },
];
