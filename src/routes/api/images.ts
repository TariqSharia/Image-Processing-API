import express from 'express';
import path from 'path';
import fs from 'fs';
import { processImage } from '../../imageFunctions/imageServices';
import multer from 'multer';
import { FormatEnum } from 'sharp';

const images = express.Router();
const resolvedFullPath = path.join(__dirname, '../../../images/full/');
const resolvedThumbPath = path.join(__dirname, '../../../images/thumb/');

images.use('/full', express.static(resolvedFullPath));
images.use('/thumb', express.static(resolvedThumbPath));

[resolvedFullPath, resolvedThumbPath].forEach((folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

images.get('/full', async (req, res) => {
  const images = await fs
    .readdirSync(resolvedFullPath)
    .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
  res.json({ images });
});

images.get('/thumb', async (req, res) => {
  const images = await fs
    .readdirSync(resolvedThumbPath)
    .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
  res.json({ images });
});
images.get('/fullView', async (req, res) => {
  const images = await fs.readdirSync(resolvedFullPath);
  const imageList = images.map((file) => ({
    name: file,
    url: `/images/full/${file}`,
  }));
  res.render('list', { title: 'Full Images', images: imageList });
});

images.get('/thumbView', async (req, res) => {
  const images = await fs.readdirSync(resolvedThumbPath);
  const imageList = images.map((file) => ({
    name: file,
    url: `/images/thumb/${file}`,
  }));
  res.render('list', { title: 'Thumbnails', images: imageList });
});
images.get('/', (req, res) => {
  const { filename, width, height, format, source } = req.query as {
    filename?: string;
    width?: string;
    height?: string;
    format?: string;
    source?: string;
  };
  if (!filename) {
    return res
      .status(400)
      .json({ message: 'Filename is required', title: 'Image Processing API' });
  }
  if (!width || isNaN(Number(width))) {
    return res.status(400).json({
      message: 'Width is required and must be a number',
      title: 'Image Processing API',
    });
  }
  if (!height || isNaN(Number(height))) {
    return res.status(400).json({
      message: 'Height is required and must be a number',
      title: 'Image Processing API',
    });
  }
  const correctFile = path.join(resolvedFullPath, filename);
  if (!fs.existsSync(correctFile)) {
    return res
      .status(404)
      .json({ message: 'File not found', title: 'Image Processing API' });
  } else {
    const parsedFilename = path.parse(filename).name;
    const thumbFile = path.join(
      resolvedThumbPath,
      `${parsedFilename}_${width}_${height}.${format || 'jpg'}`,
    );
    if (fs.existsSync(thumbFile)) {
      if (source !== 'view') {
        res.type(`image/${format}`);
        return res.status(200).sendFile(thumbFile);
      } else {
        return res
          .status(200)
          .json({ imageUrl: `/images/thumb/${path.basename(thumbFile)}` });
      }
    } else {
      processImage(
        filename,
        Number(width),
        Number(height),
        format as keyof FormatEnum,
      )
        .then((outputPath) => {
          if (source !== 'view') {
            res.type(`image/${format}`);
            return res.status(200).sendFile(outputPath);
          } else {
          return res
            .status(200)
            .json({ imageUrl: `/images/thumb/${path.basename(outputPath)}` });
          }
        })
        .catch((err) => {
          return res.status(500).send(err.message);
        });
    }
  }
});

images.post('/upload', (req, res) => {
  const image = req.query as { image?: Express.Multer.File };
  if (!image) {
    return res
      .status(400)
      .json({ message: 'No image uploaded', title: 'Image Processing API' });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolvedFullPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage }).single('image');

  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Error uploading image',
        title: 'Image Processing API',
      });
    }
    return res.status(200).json({
      message: 'Image uploaded successfully',
      title: 'Image Processing API',
    });
  });
});

images.delete('/deleteThumb', (req, res) => {
  fs.readdir(resolvedThumbPath, (err, files) => {
    if (err) {
      return res.status(500).json({
        message: 'Error reading thumbnail directory',
        title: 'Image Processing API',
      });
    }
    files.forEach((file) => {
      fs.unlink(path.join(resolvedThumbPath, file), (err) => {
        if (err) {
          console.error(`Error deleting file ${file}:`, err);
        }
      });
    });
    return res.status(200).json({
      message: 'All thumbnails deleted successfully',
      title: 'Image Processing API',
    });
  });
});

export default images;
