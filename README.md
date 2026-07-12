# How to Run Backend Locally

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(Note: The server defaults to port `5001` if `PORT` is not specified in `.env` to avoid MacOS port 5000 AirPlay conflicts).*

4. **Launch the development server**:
   ```bash
   npm run dev
   ```
   The backend REST API server will start running at `http://localhost:5001`.

5. **Alternative: Run in production mode**:
   ```bash
   npm start
   ```
