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
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const temperatureProcessor_1 = require("./utils/temperatureProcessor");
const cors_1 = __importDefault(require("cors")); // Імпортуємо CORS
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)()); // Використовуємо CORS
app.use((0, express_fileupload_1.default)());
app.get("/", (req, res) => {
    res.send("Сервер працює!"); // Або повернути HTML-сторінку чи інший контент
});
app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("File upload request received");
        if (!req.files || !req.files.temperatureFile) {
            console.log("No file found in request");
            return res.status(400).send("No file uploaded.");
        }
        const file = req.files.temperatureFile;
        console.log("File received: ", file.name);
        const processedImage = yield (0, temperatureProcessor_1.processTemperatureFile)(file.data);
        res.setHeader("Content-Type", "image/png");
        res.send(processedImage);
    }
    catch (error) {
        console.error("Error processing file:", error);
        res.status(500).send("Internal Server Error");
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
