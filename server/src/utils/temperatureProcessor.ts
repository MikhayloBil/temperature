import sharp from "sharp";
import path from "path";

const BINARY_DIMENSION_X = 3600;
const BINARY_DIMENSION_Y = 1800;

export async function processTemperatureFile(data: Buffer): Promise<Buffer> {
  const temperatures = [];
  for (let i = 0; i < data.length; i++) {
    temperatures.push(data.readInt8(i));
  }

  const emptyMapPath = path.resolve(
    __dirname,
    "../../../temperature/public/empty-map.jpg"
  );
  const mapImage = await sharp(emptyMapPath)
    .resize(BINARY_DIMENSION_X, BINARY_DIMENSION_Y)
    .raw()
    .toBuffer();

  const coloredImage = applyTemperatureDataToImage(mapImage, temperatures);

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

  const newImage = Buffer.from(mapImage);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;

      const temp = temperatures[y * width + x];

      const color = temperatureToColor(temp);

      newImage[idx] = color.r;
      newImage[idx + 1] = color.g;
      newImage[idx + 2] = color.b;
    }
  }

  return newImage;
}

function temperatureToColor(temp: number): { r: number; g: number; b: number } {
  if (temp < 50) {
    return { r: 0, g: 0, b: 255 };
  } else if (temp < 70) {
    return { r: 0, g: 255, b: 0 };
  } else {
    return { r: 255, g: 0, b: 0 };
  }
}
