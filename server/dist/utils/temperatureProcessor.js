"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTemperatureFile = processTemperatureFile;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const BINARY_DIMENSION_X = 36000;
const BINARY_DIMENSION_Y = 18000;
function processTemperatureFile(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Читання бінарного файлу
        const temperatures = [];
        for (let i = 0; i < data.length; i++) {
            temperatures.push(data.readInt8(i));
        }
        // Завантаження порожньої карти світу
        const emptyMapPath = path_1.default.resolve(__dirname, "../../../temperature/public/empty-map.jpg");
        const mapImage = yield (0, sharp_1.default)(emptyMapPath)
            .resize(BINARY_DIMENSION_X, BINARY_DIMENSION_Y) // Масштабування карти до розміру
            .raw()
            .toBuffer();
        // Застосування температурних даних до зображення карти
        const coloredImage = applyTemperatureDataToImage(mapImage, temperatures);
        // Використання sharp для збереження нового зображення
        const output = yield (0, sharp_1.default)(coloredImage, {
            raw: {
                width: BINARY_DIMENSION_X,
                height: BINARY_DIMENSION_Y,
                channels: 3,
            },
        })
            .png()
            .toBuffer();
        return output;
    });
}
function applyTemperatureDataToImage(mapImage, temperatures) {
    const width = BINARY_DIMENSION_X;
    const height = BINARY_DIMENSION_Y;
    // Ініціалізувати буфер для нових пікселів (RGB)
    const newImage = Buffer.from(mapImage);
    // Обробка кожного пікселя
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 3; // Індекс у буфері зображення
            const temp = temperatures[y * width + x];
            // Перетворення температури на колір
            const color = temperatureToColor(temp);
            // Застосувати колір до нового зображення
            newImage[idx] = color.r; // Red
            newImage[idx + 1] = color.g; // Green
            newImage[idx + 2] = color.b; // Blue
        }
    }
    return newImage;
}
function temperatureToColor(temp) {
    if (temp < 50) {
        return { r: 0, g: 0, b: 255 }; // Синій для холодних температур
    }
    else if (temp < 70) {
        return { r: 0, g: 255, b: 0 }; // Зелений для помірних температур
    }
    else {
        return { r: 255, g: 0, b: 0 }; // Червоний для теплих температур
    }
}
