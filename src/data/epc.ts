
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
}

// Extracted from user image
export const EPC_PRICES = {
    "Adroit": 1085000,
    "Conair": 1085000,
    "Prasad": 1085000,
};

export const EPC_BRANDS = ["Conair", "Prasad", "Adroit"];

export const EPC_COMPONENTS: EPC[] = [
    {
        id: "epc-dynamic",
        name: "Extrusion Process Control With Trio Loader",
        image: "/images/Acessories/EPC.png",
        cardDesc: "Select Brand to add.",
        price: 0,
        qty: 1,
        isDynamic: true,
        techDesc: {
            "Brand": "Selectable (Conair / Prasad / Adroit)",
            "Type": "Extrusion Process Control With Trio Loader",
        },
        shortDesc: "Extrusion Process Control With Trio Loader."
    }
];
