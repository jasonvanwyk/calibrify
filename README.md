# calibrify
Equipment Calibration &amp; Maintenance Tracker micro-Saas MVP

# Equipment Calibration & Maintenance Tracker

## Description
A lightweight micro‑SaaS that helps precision‑equipment users (scales, scanners, lab instruments) track calibration schedules, store compliance certificates, and generate audit reports. Designed as a single‑purpose CRUD application, it delivers immediate regulatory value with minimal overhead.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Setup & Installation](#setup--installation)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Testing Strategy](#testing-strategy)
6. [Usage](#usage)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)
10. [Contact](#contact)

---

## Architecture Overview
This project follows a three‑tier architecture:

```plaintext
Client (React + Bootstrap)
        ↓ HTTP
Backend (Django REST API)
        ↓ ORM
PostgreSQL Database
        ↓ S3
Certificate Storage
```

Additional services:
- Email reminders (SMTP)
- CI/CD via GitHub Actions
- Containerization with Docker

---

## Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Bootstrap | Responsive UI |
| Backend | Django REST Framework | API & business logic |
| Database | PostgreSQL | Relational storage |
| Storage | AWS S3 | Certificate PDFs |
| CI/CD | GitHub Actions | Automated builds/tests/deploy |
| Deployment | Render | Docker-based hosting |
| Testing | Pytest, React Testing Library | Unit & integration tests |
| Container | Docker | Environment consistency |

---

## Setup & Installation
### Prerequisites
- Docker & Docker Compose
- Git
- AWS account with S3 bucket

### Local Development
```bash
# Clone repo
git clone https://github.com/<your-username>/calibration-tracker.git
cd calibration-tracker

# Copy environment template
cp .env.example .env
# Edit .env with your credentials

docker-compose up --build
```
Access the frontend at http://localhost:3000 and API at http://localhost:8000.

---

## CI/CD Pipeline
Defined in `.github/workflows/ci-cd.yml`:
1. **Lint**: `flake8` (backend), `eslint` (frontend)
2. **Test**: `pytest` for backend; `npm test` for frontend
3. **Build**: Docker images for both services
4. **Push**: Images to Docker Hub
5. **Deploy**: Trigger Render via API to update service

Secrets required in GitHub:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `RENDER_API_KEY`

---

## Testing Strategy
### Backend
```bash
docker-compose exec backend pytest --cov=.
```
Coverage target: ≥80% for core modules.

### Frontend
```bash
cd frontend && npm test
```
Key tests: component rendering, CRUD flows.

---

## Usage
### Environment Variables (.env)
```dotenv
DJANGO_SECRET_KEY=
DATABASE_URL=postgres://user:pass@db:5432/calibration
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
```

---

## Deployment
### Render Setup
1. Create two services (frontend, backend) on Render.
2. Link GitHub repo.
3. Set environment variables in Render dashboard.
4. Render auto-deploys on Git push.

---

## Contributing
1. Fork repository
2. Create feature branch (`git checkout -b feature/XYZ`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push branch (`git push origin feature/XYZ`)
5. Open a Pull Request

Follow conventional commits; ensure tests pass before merging.

---

## License
MIT © 2025 Jason van Wyk  

*Note:* Since this repository is part of my personal portfolio and intended to demonstrate my skills to prospective employers, I have used my name rather than my company’s. Feel free to use, modify, and contribute under the terms of the MIT license.

---

## Contact
Maintainer: Your Name (jason@precept.co.za)
Project Repo: https://github.com/jasonvanwyk/calibrify


