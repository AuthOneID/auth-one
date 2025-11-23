# Setup Guide

Follow these steps to set up AuthOne on your local machine.

## Prerequisites

- **Node.js**: v22.x or later
- **Database**: PostgreSQL

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd auth-one
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Copy the example environment file and configure it.

    ```bash
    cp .env.example .env
    ```

    Update `.env` with your database credentials and other settings.

4.  **Run Migrations:**
    Set up the database schema.
    ```bash
    node ace migration:run
    ```

## Running the Application

### Development Mode

To start the server with hot module replacement (HMR):

```bash
npm run dev
# or
node ace serve --hmr
```

The application will be available at `http://localhost:3333`.

### Production Build

To build the application for production:

```bash
npm run build
```

### Testing

To run the test suite:

```bash
npm run test
```
