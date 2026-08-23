# Image Processing API

A TypeScript + Express REST API for uploading images and generating resized, reformatted versions on the fly. Processed images are cached to disk so repeat requests are served instantly. Includes a simple built-in UI for trying the endpoints.

## Features

- **Upload** images via `multipart/form-data` (Multer)
- **Resize & reformat** images to a requested width, height, and format (JPEG, PNG, WebP, etc.) using [Sharp](https://sharp.pixelplumbing.com/)
- **Caching** — a processed image is written to a `thumb` folder and reused on later requests instead of being regenerated
- **Listing endpoints** for both full-size and thumbnail images (JSON and an EJS-rendered gallery view)
- **Input validation** and error handling for missing files and invalid parameters
- **Full test suite** (Jasmine + Supertest) covering endpoints and the image-processing logic

## Tech Stack

TypeScript · Express · Sharp · Multer · EJS · Jasmine · Supertest · ESLint · Prettier

## Getting Started

```bash
npm install
npm run start        # start dev server (nodemon)
npm run build        # compile TypeScript
npm test             # build + run Jasmine tests
npm run lint         # run eslint
npm run format       # run prettier
```

Then open `http://localhost:3000/` for a simple UI to try the API.

## Endpoints

| Endpoint | Description |
|---|---|
| `GET /images?filename=jford&width=400&height=700&format=jpg` | Resize an image. `filename`, `width`, `height` required; `format` optional (defaults to jpg). Converts format if provided. |
| `GET /images/full` | List full-size image names (JSON) |
| `GET /images/thumb` | List thumbnail image names (JSON) |
| `GET /images/fullView` | Gallery view of full-size images (UI) |
| `GET /images/thumbView` | Gallery view of thumbnails (UI) |
| `POST /images/upload` | Upload a full-size image to the server |
| `GET /images/deleteThumb` | Delete all generated thumbnails |

## Notes

Built as a backend project during the Udacity Full-Stack JavaScript Nanodegree, focused on TypeScript, streaming file handling, image processing, and test-driven API development.
