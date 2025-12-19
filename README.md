# API Integration Test Framework

A production-grade **API integration testing framework** built with **Node.js**, **Axios**, **Mocha**, **Chai**, **AJV (JSON Schema validation)**, and **PostgreSQL**.

The framework validates **API behavior, contracts, authentication flows, retry logic, and database persistence** using real HTTP calls and real backend state — without mocking.

It demonstrates how to build a **maintainable, extensible, and CI-ready API testing framework** suitable for real-world backend services.

---

##  Key Features

### API client abstraction
- Centralized Axios client
- Automatic auth token injection
- Retry logic for transient network / 5xx failures
- Structured request / response error logging

### Authentication & session handling
- Login helpers for test setup
- In-memory session token management
- Automatic `Authorization` header handling

### Contract (schema) validation
- JSON Schema validation using **AJV**
- Schemas applied inline within functional tests
- Early detection of breaking API contract changes

### Database verification
- PostgreSQL integration for end-to-end validation
- DB assertions used only for write operations
- Explicit safety guards to prevent accidental production access

### Environment configuration
- Single environment configuration via `.env`
- Secrets isolated using `.env.example`
- Feature flags (e.g. `ALLOW_DB_TESTS`) for destructive checks

### CI-friendly design
- Deterministic test data generation
- Clean separation of API, helpers, schemas, and DB logic
- Safe execution in local and CI environments

---

##  Project Structure

```text
framework/
├── api/
│   ├── apiClient.js
│   ├── authApi.js
│   ├── authProfileApi.js
│   ├── createUserApi.js
│   ├── deleteUserApi.js
│   ├── updateUserApi.js
│   └── userApi.js
│
├── helpers/
│   ├── authHelper.js
│   └── schemaHelper.js
│
├── db/
│   ├── dbClient.js
│   └── dbQueries.js
│
├── fixture/
│   └── users.json
│
├── schema/
│   ├── loginResponse.schema.json
│   ├── userProfile.schema.json
│   ├── entityNotFound.schema.json
│   └── errorResponse.schema.json
│
├── utils/
│   ├── env.js
│   ├── session.js
│   ├── retry.js
│   ├── dataFactory.js
│   └── schemaValidator.js
│
tests/
├── auth/
│   └── auth.spec.js
└── users/
    └── user.spec.js
```

---

## ▶️ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run tests
```bash
npm test
```

### 3. Run tests with database verification (optional)

Database checks are **disabled by default**.

```bash
ALLOW_DB_TESTS=true npm test
```

---

##  Configuration

Create a `.env` file based on `.env.example`:

```env
BASE_URL=https://api.example.com

ADMIN_USERNAME=admin_user
ADMIN_PASSWORD=********
SERVICE_TOKEN=********

DB_HOST=localhost
DB_PORT=5432
DB_NAME=users_service
DB_USER=test_user
DB_PASSWORD=********
DB_SSL=false

ALLOW_DB_TESTS=false
```

---

##  License

MIT
