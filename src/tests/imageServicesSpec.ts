import { processImage } from '../imageFunctions/imageServices';
import path from 'path';
import fs from 'fs';
import { FormatEnum } from 'sharp';

describe('Image Processing API', () => {
  const resolvedThumbPath = path.join(__dirname, '../../images/thumb/');
  beforeAll(() => {
    if (!fs.existsSync(resolvedThumbPath)) {
      fs.mkdirSync(resolvedThumbPath);
    }
  });
  afterAll(() => {
    const files = fs.readdirSync(resolvedThumbPath);
    for (const file of files) {
      fs.unlinkSync(path.join(resolvedThumbPath, file));
    }
  });
  it('should process an image and save it to the thumb directory', async () => {
    const filename = 'fjord.jpg';
    const width = 200;
    const height = 200;
    const format = 'png';
    const outputPath = await processImage(
      filename,
      width,
      height,
      format as keyof FormatEnum,
    );
    expect(fs.existsSync(outputPath)).toBe(true);
  });
  it('should throw an error if the input file does not exist', async () => {
    const filename = 'nonexistent.jpg';
    const width = 200;
    const height = 200;
    const format = 'png';
    await expectAsync(
      processImage(filename, width, height, format as keyof FormatEnum),
    ).toBeRejectedWithError('Input file does not exist');
  });
});
