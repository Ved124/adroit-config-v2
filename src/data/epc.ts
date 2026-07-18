
export interface TechSpecMap { [label: string]: string; }

export interface EPC {
    id: string;
    name: string;
    image: string;
    cardDesc: string;
    price: number;
    techDesc: TechSpecMap;
    qty?: number;
    shortDesc?: string;
    isDynamic?: boolean; // New flag for dropdown-based selection
    category?: string;
    machineTypes?: string[];
    prices?: Record<string, number>;
}

// Extracted from user image
// export const EPC_PRICES = {
//     "Adroit": 1085000,
//     "Conair": 1085000,
//     "Prasad": 1085000,
// };

// export const EPC_BRANDS = ["Conair", "Prasad", "Adroit"];

export const GRAVIMETRIC_PRICES: Record<string, number> = {
    "1350": 1025000,
    "1450": 1025000,
    "1550": 1025000,
    "1625": 1025000,
    "1870": 1025000,
    "1970": 1025000,
    "2125": 1250000,
    "2370": 1250000,
    "2620": 1250000,
};

export const EPC_COMPONENTS: EPC[] = [
    // {
    //     id: "epc-dynamic",
    //     name: "Extrusion Process Control With Trio Loader",
    //     image: "/images/Acessories/EPC.png",
    //     cardDesc: "Select Brand to add.",
    //     price: 0,
    //     qty: 1,
    //     isDynamic: true,
    //     techDesc: {
    //         "Brand": "Selectable (Conair / Prasad / Adroit)",
    //         "Type": "Extrusion Process Control With Trio Loader",
    //     },
    //     shortDesc: "Extrusion Process Control With Trio Loader."
    // },
    {
        id: "optional-gravimetric-system",
        name: "Single Component Gravimetric System",
        category: "EPC",
        machineTypes: ["mono", "aba", "3layer", "5layer"],
        image: "https://res.cloudinary.com/kqver3iv/image/upload/v1784362011/adroit_configurator/Acessories/EPC.png",
        cardDesc: "Gravimetric blending and dosing system for accurate single-component material feeding based on weight, ensuring consistent film quality.",
        price: 0,
        isDynamic: true,
        techDesc: {
            "Type": "Single component loss-in-weight gravimetric feeder.",
            "Accuracy": "Throughput accuracy within ±0.5% of setpoint.",
            "Control": "Microprocessor-based controller with digital display.",
            "Integration": "Syncs with extruder screw speed for closed-loop output control.",
            "Benefit": "Eliminates material waste and ensures consistent film thickness."
        },
        prices: GRAVIMETRIC_PRICES,
    }
];
