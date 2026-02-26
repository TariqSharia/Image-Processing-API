import path from 'path';
import sharp, { FormatEnum } from 'sharp';
import fs from 'fs';

const fullPath = path.join(__dirname, '../../images/full/');
const thumbPath = path.join(__dirname, '../../images/thumb/');

export const processImage = async (
  filename: string,
  width: number,
  height: number,
  format: keyof FormatEnum,
): Promise<string> => {
  const inputPath = path.join(fullPath, filename);
  filename = path.parse(filename).name;
  const outputFilename = `${filename}_${width}_${height}.${format}`;
  const outputPath = path.join(thumbPath, outputFilename);
  if (!fs.existsSync(inputPath)) {
    throw new Error('Input file does not exist');
  } else {
    await sharp(inputPath)
      .resize(width, height)
      .toFormat(format)
      .toFile(outputPath);
    return outputPath;
  }
};
