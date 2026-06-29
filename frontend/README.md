# How to Run Frontend Locally

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   The frontend application will start running at `http://localhost:5173` (or `http://localhost:5174`).

4. **Alternative: Build for production**:
   ```bash
   npm run build
   ```
   Then preview the production build:
   ```bash
   npm run preview
   ```

**Note:** Make sure the backend server is running at `http://localhost:5001` for the frontend to work properly.
