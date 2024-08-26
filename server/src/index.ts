import express from "express";
import fileUpload from "express-fileupload";
import { processTemperatureFile } from "./utils/temperatureProcessor";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Сервер працює!");
});

app.post("/upload", async (req, res) => {
  try {
    console.log("File upload request received");
    if (!req.files || !req.files.temperatureFile) {
      console.log("No file found in request");
      return res.status(400).send("No file uploaded.");
    }

    const file = req.files.temperatureFile as fileUpload.UploadedFile;
    console.log("File received: ", file.name);
    const processedImage = await processTemperatureFile(file.data);

    res.setHeader("Content-Type", "image/png");
    res.send(processedImage);
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
