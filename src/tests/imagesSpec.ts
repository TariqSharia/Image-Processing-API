import request from 'supertest';
import server from '../server';
import path from 'path';
import fs from 'fs';

const resolvedThumbPath = path.join(__dirname, '../../images/thumb/');

describe('Resizing Image route', () => {
  it('should return 400 if filename is missing', async () => {
    const res = await request(server)
      .get('/images')
      .query({ width: 200, height: 200, format: 'png' });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Filename is required');
  });

  it('should return 400 if width is missing', async () => {
    const res = await request(server)
      .get('/images')
      .query({ filename: 'fjord.jpg', height: 200, format: 'png' });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain(
      'Width is required and must be a number',
    );
  });

  it('should return 400 if height is missing', async () => {
    const res = await request(server)
      .get('/images')
      .query({ filename: 'fjord.jpg', width: 200, format: 'png' });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain(
      'Height is required and must be a number',
    );
  });

  it('should return 404 if file does not exist', async () => {
    const res = await request(server).get('/images').query({
      filename: 'nonexistent.jpg',
      width: 200,
      height: 200,
      format: 'png',
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toContain('File not found');
  });

  it('should return 200 and the processed image if all parameters are valid', async () => {
    const res = await request(server)
      .get('/images')
      .query({ filename: 'fjord.jpg', width: 200, height: 200, format: 'png' });
    expect(res.status).toBe(200);
    expect(res.body.imageUrl).toBeDefined();
  });

  it('should create a thumbnail if it does not exist and return it', async () => {
    const testimage = 'fjord.jpg';
    const width = 200;
    const height = 200;
    const format = 'png';
    const thumbFile = path.join(
      resolvedThumbPath,
      `${path.parse(testimage).name}_${width}_${height}.${format}`,
    );
    if (fs.existsSync(thumbFile)) {
      fs.unlinkSync(thumbFile);
    }
    expect(fs.existsSync(thumbFile)).toBeFalse();
    const res = await request(server)
      .get('/images')
      .query({ filename: 'fjord.jpg', width: 200, height: 200, format: 'png' });
    expect(res.status).toBe(200);
    expect(fs.existsSync(thumbFile)).toBeTrue();
  });

  it('should return the existing thumbnail if it already exists', async () => {
    const testimage = 'fjord.jpg';
    const imageName = path.parse(testimage).name;
    const width = 200;
    const height = 200;
    const format = 'png';
    const thumbFile = path.join(
      resolvedThumbPath,
      `${imageName}_${width}_${height}.${format}`,
    );
    expect(fs.existsSync(thumbFile)).toBeTrue();
    const res = await request(server)
      .get('/images')
      .query({ filename: 'fjord.jpg', width: 200, height: 200, format: 'png' });
    expect(res.status).toBe(200);
  });
});
