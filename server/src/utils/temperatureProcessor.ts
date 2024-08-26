import sharp from "sharp";
import path from "path";

const BINARY_DIMENSION_X = 3600; // Зменшені розміри для зображення
const BINARY_DIMENSION_Y = 1800;

export async function processTemperatureFile(data: Buffer): Promise<Buffer> {
  // Читання бінарного файлу
  const temperatures = [];
  for (let i = 0; i < data.length; i++) {
    temperatures.push(data.readInt8(i));
  }

  // Завантаження порожньої карти світу
  const emptyMapPath = path.resolve(
    __dirname,
    "../../../temperature/public/empty-map.jpg"
  );
  const mapImage = await sharp(emptyMapPath)
    .resize(BINARY_DIMENSION_X, BINARY_DIMENSION_Y) // Масштабування карти до розміру
    .raw()
    .toBuffer();
  // Застосування температурних даних до зображення карти
  const coloredImage = applyTemperatureDataToImage(mapImage, temperatures);

  // Використання sharp для збереження нового зображення
  const output = await sharp(coloredImage, {
    raw: {
      width: BINARY_DIMENSION_X,
      height: BINARY_DIMENSION_Y,
      channels: 3,
    },
  })
    .png()
    .toBuffer();

  return output;
}

function applyTemperatureDataToImage(
  mapImage: Buffer,
  temperatures: number[]
): Buffer {
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

function temperatureToColor(temp: number): { r: number; g: number; b: number } {
  if (temp < 50) {
    return { r: 0, g: 0, b: 255 }; // Синій для холодних температур
  } else if (temp < 70) {
    return { r: 0, g: 255, b: 0 }; // Зелений для помірних температур
  } else {
    return { r: 255, g: 0, b: 0 }; // Червоний для теплих температур
  }
}
