# Duality Architecture

Duality is a fullstack application for uploading academic assessment content, processing uploaded images to remove handwritten answers, and making the processed files available through authenticated web workflows. The system is organized into five main layers:

1. Custom data creation and preprocessing for model fine-tuning
2. Fine-tuned image-processing model for handwriting removal
3. Django REST Framework backend
4. React TypeScript Vite frontend
5. Docker, Nginx, AWS EC2, and Cloudflare infrastructure

## 1. Custom Data Created and Preprocessed for Fine-Tuning the ML Model

The machine-learning pipeline starts with a custom object-detection dataset built for identifying handwritten regions in assessment images. The dataset is expected to follow a YOLO-style layout:

```text
dataset/
  images/
    example_1.jpg
    example_2.jpg
  labels/
    example_1.txt
    example_2.txt
```

Each label file corresponds to an image with the same filename stem and contains normalized bounding-box annotations for handwriting regions. The custom dataset is preprocessed by `backend/apps/services/split_dataset.py`, which:

- validates that both `images/` and `labels/` exist;
- matches image and label files by filename stem;
- discards unmatched images or labels;
- shuffles the matched pairs with a deterministic seed;
- splits the data into `train`, `val`, and `test` folders;
- writes the split dataset into the structure expected by YOLO training.

The preprocessing output is:

```text
split-dataset/
  images/
    train/
    val/
    test/
  labels/
    train/
    val/
    test/
```

This creates clean training, validation, and test partitions before model fine-tuning. The fine-tuning workflow is documented in `backend/apps/services/yolo26n_finetune.ipynb`, which imports the preprocessing script, trains a custom Ultralytics YOLO detector, validates the model, and includes ONNX inference utilities.

## 2. Fine-Tuned ML Model for Image Processing and Handwriting Removal

| Original (`test.jpg`) | Processed (`results_test.jpg`) |
| --- | --- |
| <img src="backend/apps/services/test.jpg" alt="Original assessment image sample" width="100%" /> | <img src="backend/apps/services/results_test.jpg" alt="Processed assessment image sample with handwriting removed" width="100%" /> |


The image-processing model is a fine-tuned Ultralytics YOLO detector trained to locate handwriting on uploaded assessment images. The trained artifacts live in `backend/apps/services/`:

- `best.pt`: PyTorch model used by the Django runtime.
- `best.onnx`: ONNX export used by notebook/inference experiments.
- `iou_eval.py`: shared model inference, detection extraction, IoU evaluation, and image redaction utilities.
- `handwriting_detector.py`: lightweight detector wrapper and local testing entrypoint.
- `yolo26n_finetune.ipynb`: training and evaluation notebook.

At runtime, the backend loads `best.pt` through Ultralytics YOLO. The active handwriting-removal behavior is implemented in `IouEvaluate.add_bounding_box()`:

1. Read the uploaded or downloaded image.
2. Run YOLO inference against the image.
3. Convert normalized YOLO bounding boxes to pixel coordinates.
4. Remove the detected handwriting bounding box with a white rectangle.
5. Return the processed image and detection metadata.

In other words, the model does not generate a new image from scratch. It detects handwritten regions and removes them by covering those regions with white rectangles. That makes the behavior deterministic and fast enough to run inside the backend processing flow.

The Crowdmark-specific flow is implemented in `backend/apps/services/crowdmark_processor.py`:

1. Accept a shared Crowdmark URL.
2. Use Playwright to load the page.
3. Parse the HTML with BeautifulSoup.
4. Find image elements under Crowdmark's `m-aspect-img-wrapper` containers.
5. Download each JPEG image through `requests`.
6. Process each image with the fine-tuned YOLO model.
7. Upload the processed image to object storage.
8. Return storage paths and signed URLs for frontend preview or download.

## 3. Backend Architecture

The backend is a Django 6 and Django REST Framework service located in `backend/`. It exposes versioned API routes under `/api/v1/`, connects to Supabase PostgreSQL for persistent data, uses JWT for authentication, and integrates with Supabase Storage as an S3-style object storage bucket for uploaded and processed images.

### Backend Structure

```text
backend/
  config/
    settings.py
    urls.py
    asgi.py
    wsgi.py
  apps/
    accounts/
    uploads/
    services/
    courses/
    questions/
  manage.py
  requirements.txt
  Dockerfile
```

`config/settings.py` configures installed apps, Django REST Framework, Simple JWT, CORS, proxy headers, the Supabase PostgreSQL database, and Supabase Storage settings. Environment variables are loaded with `python-dotenv`, with separate development and production env files used by Docker Compose.

### Authentication and User Account Management

User account management is implemented in `apps/accounts`.

The custom user model extends Django's `AbstractUser` and makes `email` unique:

```text
apps/accounts/models.py
```

The public authentication routes are mounted under:

```text
/api/v1/auth/
```

Main auth endpoints:

- `POST /api/v1/auth/register/`: creates a user with username, email, and password.
- `POST /api/v1/auth/login/`: validates email and password and returns JWT access and refresh tokens.
- `POST /api/v1/auth/refresh/`: refreshes the JWT access token through Simple JWT.
- `GET /api/v1/auth/me/`: returns the authenticated user's id, username, and email.
- `POST /api/v1/auth/logout/`: client-side logout helper.
- `DELETE /api/v1/auth/delete/`: deletes the authenticated user account.
- `GET /api/v1/auth/all/`: simple public test endpoint.

The backend uses `rest_framework_simplejwt.authentication.JWTAuthentication` as the default DRF authentication class. Access tokens are configured for 15 minutes and refresh tokens for 7 days. Protected views require DRF's `IsAuthenticated` permission, while registration and login use `AllowAny`.

Supabase is used as the PostgreSQL database for Django's user table and the backend metadata models. The database settings use:

- `DB_NAME`
- `SUPABASE_USER`
- `SUPABASE_PASSWORD`
- `SUPABASE_HOST`
- `DB_PORT`

### Uploads, Signed URLs, and Image Processing

Upload and ML routes are implemented in `apps/uploads` and mounted under:

```text
/api/v1/uploads/
```

Main upload and ML endpoints:

- `POST /api/v1/uploads/createsignedurls/`: creates signed upload URLs for a list of files.
- `POST /api/v1/uploads/uploadcmurl/`: accepts a Crowdmark URL, extracts assessment images, removes handwriting, uploads processed images, and returns signed image URLs.
- `GET /api/v1/uploads/endpoints`: lists ML endpoint metadata.
- `GET /api/v1/uploads/mlalgorithms`: lists registered ML algorithm metadata.
- `GET /api/v1/uploads/mlalgorithmstatuses`: lists model status records.
- `POST /api/v1/uploads/mlalgorithmstatuses`: creates a new active algorithm status and deactivates older statuses for the same algorithm.
- `GET /api/v1/uploads/mlrequests`: lists ML request records.
- `PATCH/PUT /api/v1/uploads/mlrequests/{id}`: updates ML request feedback fields through the DRF viewset.

Storage is handled through the Supabase Python client. The code uses a configured media bucket and also uploads processed Crowdmark images to the `content` bucket. The flow supports two styles of object publication:

- signed upload URLs, created for controlled client or service uploads;
- signed object URLs, returned so the frontend can display or download processed images without making the bucket fully public.

The `ContentUpload` model stores upload metadata:

- image
- uploader identifier
- class name
- term
- professor
- content type

The ML metadata models are:

- `Endpoint`: logical ML endpoint definition.
- `MLAlgorithm`: model name, description, code, version, owner, and parent endpoint.
- `MLAlgorithmStatus`: active/testing/staging/production-style status history.
- `MLRequest`: input data, full response, response, feedback, created timestamp, and model reference.

These models provide a foundation for tracking deployed algorithms, active model versions, and request feedback, even though the current Crowdmark processing path directly calls the local YOLO artifact.

### Backend Request Flow

The primary processed-image flow is:

```text
React frontend
  -> POST /api/v1/uploads/uploadcmurl/
  -> DRF ProcessCMUrlView
  -> ProcessCMUrlSerializer
  -> CrowdmarkProcessor
  -> Playwright page load
  -> BeautifulSoup image extraction
  -> requests image download
  -> YOLO handwriting detection
  -> OpenCV white-box redaction
  -> Supabase Storage upload
  -> signed image URLs
  -> frontend preview
```

## 4. Frontend Architecture

The frontend is a React TypeScript application built with Vite and located in `frontend/web-ui/`. It provides the user-facing web UI for registration, login, protected dashboards, profile/account pages, uploads, processed image previews, and dashboard navigation.

- Note: 
Currently, the user sopecific page when logged in displays a dummy data that represents the prospected user experience, as there are no active users to populate the database.

### Frontend Structure

```text
frontend/web-ui/
  src/
    main.tsx
    router.tsx
    index.css
    services/
    store/
    hooks/
    components/
    pages/
    types/
    assets/
  index.html
  package.json
  vite.config.ts
  Dockerfile
  nginx.conf
```

The application starts in `src/main.tsx`, which mounts React in strict mode and registers the React Router provider. Routing is centralized in `src/router.tsx`.

### Routing and Page Layout

Primary routes:

- `/`: home page.
- `/login`: login page.
- `/signup`: signup page.
- `/profile`: profile component.
- `/user`: user board component.
- `/admin`: moderator/admin board component.
- `/account`: protected user-management page.
- `/dashboard`: protected dashboard.

Protected routes use `src/components/ProtectedRoute.tsx`. The guard checks the Zustand auth store for either an access token or refresh token. If no token exists, the user is redirected to `/login`.

### Auth State and API Layer

Frontend authentication state is managed with Zustand in `src/store/authStore.ts`. The store persists to `localStorage` and tracks:

- access token
- refresh token
- current user
- `setAuth`
- `setAccessToken`
- `setUser`
- `clearAuth`

The main fetch wrapper is `src/services/api.ts`. It:

- builds requests against `API_BASE_URL/api/v1`;
- attaches `Authorization: Bearer <token>` by default;
- parses JSON responses safely;
- refreshes access tokens on 401 responses by calling `/auth/refresh/`;
- clears local auth state when token refresh fails;
- throws a typed `ApiError` for non-OK responses.

`src/services/config.ts` normalizes `VITE_API_URL`. In local development, it defaults to `http://localhost:8000`; in production behind the reverse proxy, it can use the same origin.

There is also an Axios-based `src/services/auth.service.ts` used by the login and signup screens. It calls:

- `/api/v1/auth/login/`
- `/api/v1/auth/logout/`
- `/api/v1/auth/register/`

### Upload and Processed Image UI

Upload-related API calls live in `src/services/FileUpload.service.ts`. The service calls:

- `/api/v1/uploads/createsignedurls/` for signed upload URL generation.
- `/api/v1/uploads/uploadcmurl/` for Crowdmark URL processing.

The main upload UI is in `src/components/Upload/index.tsx`. It manages:

- Crowdmark URL input;
- class, term, professor, and content type metadata;
- local file selection;
- review and confirmation screens;
- local storage of returned processed image URLs;
- preview rendering for processed images.

When the frontend submits a Crowdmark URL, it calls the backend, receives processed image URLs, stores them in `localStorage` under `imageUrls`, and renders them in the review/preview area.

The dashboard upload screen in `src/pages/Dashboard/components/sections/UploadNewSection.tsx` provides a similar user flow inside the dashboard: enter metadata, attach images/PDFs, review, and mark the upload as complete.

### Dashboard Architecture

The dashboard is implemented under `src/pages/Dashboard/`.

Important pieces:

- `UserDashboard.tsx`: protected dashboard shell; loads `/auth/me/` to validate and hydrate current user state.
- `hooks/useDashboardState.ts`: keeps track of the active dashboard section and selected test detail.
- `components/layout/Sidebar.tsx`: renders dashboard navigation.
- `components/SectionRenderer.tsx`: switches between dashboard sections.
- `components/sections/`: contains page sections for tests, uploads, search, settings, profile, test detail, and new uploads.
- `data/mockData.ts`: supplies the current dashboard test/upload/search placeholder data.
- `types.ts`: central dashboard TypeScript types for tests, files, uploads, search results, and navigation.

The dashboard currently combines live authentication data from the backend with mock dashboard content. The user session is real, while test lists, search results, and upload lists are currently frontend-provided placeholders ready to be replaced by backend-backed endpoints.

### Frontend Build and Runtime

The frontend Dockerfile uses a two-stage build:

1. Node 22 Alpine builds the Vite app with `npm ci` and `npm run build`.
2. Nginx 1.27 Alpine serves the built static assets from `/usr/share/nginx/html`.

The frontend container has its own `nginx.conf` that:

- serves `index.html` for client-side routing with `try_files`;
- caches built `/assets/` files with a long immutable cache header.

## 5. Infrastructure Architecture

The application is containerized with Docker and can run in local development or production-style deployment.

### Local Development Compose

`docker-compose.yml` runs:

- `duality-backend`: Django backend built from `backend/Dockerfile`, exposed on host port `8000`.
- `duality-frontend`: Vite-built frontend served by Nginx, exposed on host port `5173`.

The frontend build receives `VITE_API_URL`, defaulting to `http://localhost:8000` for local API calls.

### Production Compose

`docker-compose.prod.yml` runs three containers:

- `duality-proxy`: top-level Nginx reverse proxy.
- `duality-frontend`: static React app served by its internal Nginx container.
- `duality-backend`: Django API service.

The production proxy mounts `infra/nginx.prod.conf` and exposes port `80`. The frontend and backend are only exposed to the internal Docker network.

### Nginx Reverse Proxy Layer

`infra/nginx.prod.conf` defines the public production routing:

```text
duality-uw.com / www.duality-uw.com
  /api/ -> backend:8000
  /    -> frontend:80
```

The proxy preserves the `/api` prefix because Django routes are mounted at `/api/v1/...`. It also forwards important request headers:

- `Host`
- `X-Real-IP`
- `X-Forwarded-For`
- `X-Forwarded-Proto`

Django is configured with `SECURE_PROXY_SSL_HEADER` and `USE_X_FORWARDED_HOST` so it can correctly interpret proxied requests.

### AWS EC2 and Cloudflare

The production architecture is designed to run the Dockerized application on an AWS EC2 instance:

```text
User Browser
  -> Cloudflare DNS/security layer
  -> AWS EC2 public host
  -> Nginx proxy container
  -> React frontend container
  -> Django backend container
  -> Supabase PostgreSQL
  -> Supabase Storage / S3-style image bucket
```

Cloudflare provides DNS routing and an external security layer in front of the EC2 instance. The EC2 instance runs Docker Compose, with Nginx acting as the public entrypoint and reverse-proxying API and frontend traffic to the correct internal containers.

Supabase remains outside the EC2 host and provides:

- managed PostgreSQL for Django users and backend metadata;
- object storage buckets for static/media files and processed uploaded images;
- signed URL generation for controlled image upload and retrieval.

## End-to-End Flow

The main user-facing flow is:

```text
1. User signs up or logs in from the React app.
2. React calls the Django auth API.
3. Django validates credentials against the Supabase PostgreSQL-backed user table.
4. Django returns JWT access and refresh tokens.
5. React stores auth state in Zustand/localStorage.
6. User submits a Crowdmark URL or selected upload content.
7. React calls the Django uploads API.
8. Django extracts source images, runs the fine-tuned YOLO model, and removes handwriting.
9. Django uploads processed images to the storage bucket.
10. Django returns signed image URLs.
11. React renders the processed images for review and download.
```
