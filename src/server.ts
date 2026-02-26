import express from 'express';
import images from './routes/api/images';
import expressLayout from 'express-ejs-layouts';
import path from 'node:path';
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(expressLayout);
app.set('views', path.join(__dirname, './views'));
app.use('/images', images);
app.set('layout', 'layout');
app.get('/', (req, res) => {
  res.render('index', { title: 'Image Processing API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
