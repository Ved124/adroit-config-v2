"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var mongodb_1 = require("mongodb");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// Let's just use ts-node to require them natively if we run via tsx
var monoModels_1 = require("../src/data/monoModels");
var abaModels_1 = require("../src/data/abaModels");
var threeLayerModels_1 = require("../src/data/threeLayerModels");
var extruders = __importStar(require("../src/data/extruders"));
var bubbleCages = __importStar(require("../src/data/bubbleCages"));
var hauloffs = __importStar(require("../src/data/hauloffs"));
var dies = __importStar(require("../src/data/dies"));
var winders = __importStar(require("../src/data/winders"));
var airRing = __importStar(require("../src/data/airRing"));
var collapsingFrame = __importStar(require("../src/data/collapsingFrame"));
var tower = __importStar(require("../src/data/tower"));
var electricalPanel = __importStar(require("../src/data/electricalPanel"));
var materialHandling = __importStar(require("../src/data/materialHandling"));
var optionalFeatures = __importStar(require("../src/data/optionalFeatures"));
var gauge = __importStar(require("../src/data/gauge"));
var corona = __importStar(require("../src/data/corona"));
var ibc = __importStar(require("../src/data/ibc"));
var epc = __importStar(require("../src/data/epc"));
var mdo = __importStar(require("../src/data/mdo"));
var chiller = __importStar(require("../src/data/chiller"));
var heatExchanger = __importStar(require("../src/data/heatExchanger"));
var trim = __importStar(require("../src/data/trim"));
var webGuide = __importStar(require("../src/data/webGuide"));
var hydraulicUnloader = __importStar(require("../src/data/hydraulicUnloader"));
var printer = __importStar(require("../src/data/printer"));
var bimetallic = __importStar(require("../src/data/bimetallic"));
var dieAddons = __importStar(require("../src/data/dieAddons"));
var extruderAddons = __importStar(require("../src/data/extruderAddons"));
var winderAddons = __importStar(require("../src/data/winderAddons"));
var modelPresets_1 = require("../src/data/modelPresets");
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var uri, dbName, client, db, modelsData, presetsCollection, presetsDocs, modules, componentsData, _i, _a, _b, key, mod, arr, publicAdminDataPath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
                    dbName = process.env.MONGODB_DB || 'adroit_configurator';
                    client = new mongodb_1.MongoClient(uri);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _c.sent();
                    db = client.db(dbName);
                    console.log('Seeding models...');
                    modelsData = { mono: monoModels_1.MONO_MODELS, aba: abaModels_1.ABA_MODELS, threeLayer: threeLayerModels_1.THREE_LAYER_MODELS };
                    return [4 /*yield*/, db.collection('models').updateOne({ _id: 'all_models' }, { $set: __assign({ _id: 'all_models' }, modelsData) }, { upsert: true })];
                case 2:
                    _c.sent();
                    console.log('Seeding presets...');
                    presetsCollection = db.collection('presets');
                    return [4 /*yield*/, presetsCollection.deleteMany({})];
                case 3:
                    _c.sent();
                    presetsDocs = Object.keys(modelPresets_1.MODEL_PRESETS || {}).map(function (key) { return (__assign({ _id: key }, modelPresets_1.MODEL_PRESETS[key])); });
                    if (!(presetsDocs.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, presetsCollection.insertMany(presetsDocs)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    console.log('Seeding components...');
                    modules = {
                        extruders: extruders,
                        bubbleCages: bubbleCages,
                        hauloffs: hauloffs,
                        dies: dies,
                        winders: winders,
                        airRing: airRing,
                        collapsingFrame: collapsingFrame,
                        tower: tower,
                        electricalPanel: electricalPanel,
                        materialHandling: materialHandling,
                        optionalFeatures: optionalFeatures,
                        gauge: gauge,
                        corona: corona,
                        ibc: ibc,
                        epc: epc,
                        mdo: mdo,
                        chiller: chiller,
                        heatExchanger: heatExchanger,
                        trim: trim,
                        webGuide: webGuide,
                        hydraulicUnloader: hydraulicUnloader,
                        printer: printer,
                        bimetallic: bimetallic,
                        dieAddons: dieAddons,
                        extruderAddons: extruderAddons,
                        winderAddons: winderAddons
                    };
                    componentsData = {};
                    for (_i = 0, _a = Object.entries(modules); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], mod = _b[1];
                        arr = Object.values(mod).find(function (v) { return Array.isArray(v); }) || [];
                        componentsData[key] = arr;
                    }
                    return [4 /*yield*/, db.collection('components').updateOne({ _id: 'all_components' }, { $set: __assign({ _id: 'all_components' }, componentsData) }, { upsert: true })];
                case 6:
                    _c.sent();
                    publicAdminDataPath = path_1.default.join(process.cwd(), 'public', 'admin-data');
                    if (!fs_1.default.existsSync(publicAdminDataPath))
                        fs_1.default.mkdirSync(publicAdminDataPath, { recursive: true });
                    fs_1.default.writeFileSync(path_1.default.join(publicAdminDataPath, 'models.json'), JSON.stringify(modelsData, null, 2));
                    fs_1.default.writeFileSync(path_1.default.join(publicAdminDataPath, 'presets.json'), JSON.stringify(modelPresets_1.MODEL_PRESETS, null, 2));
                    fs_1.default.writeFileSync(path_1.default.join(publicAdminDataPath, 'components.json'), JSON.stringify(componentsData, null, 2));
                    console.log('Successfully seeded everything and saved local JSONs!');
                    return [4 /*yield*/, client.close()];
                case 7:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(console.error);
