# Deployment Guide: EcoFeast / MealMind

This project consists of two parts: a **React Frontend** and a **FastAPI Machine Learning Backend**. The easiest way to deploy this project for free (or very cheap) is to host the frontend on **Vercel** and the backend on **Render**.

---

## Part 1: Deploying the Backend (Render.com)

The backend is built with FastAPI, Python, and uses Scikit-Learn/XGBoost models. **Render** is the best free option for hosting Python APIs.

### Steps:
1. **Prepare your GitHub Repository**:
   - Ensure your code is pushed to a GitHub repository.
   - Make sure your `MODELS` folder has the `requirements.txt` and `main.py` ready.

2. **Sign up for Render**:
   - Go to [Render.com](https://render.com/) and sign in with GitHub.

3. **Create a New Web Service**:
   - Click "New +" and select **Web Service**.
   - Connect your GitHub repository.
   
4. **Configure the Service**:
   - **Name**: `mealmind-backend` (or whatever you prefer)
   - **Root Directory**: `MODELS` (Important: This tells Render to look inside the MODELS folder)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`

5. **Deploy**:
   - Scroll down and click **Create Web Service**. 
   - Render will build and deploy your ML API. Once fully deployed, copy the **URL** (e.g., `https://mealmind-backend.onrender.com`).

---

## Part 2: Deploying the Frontend (Vercel)

Vercel provides the absolute easiest deployment for Vite/React applications.

### Steps:
1. **Update API URLs**:
   - Before deploying, you need to point your frontend to your newly deployed Render API.
   - Go into your frontend codebase and ensure wherever you are making `fetch()` requests to `http://127.0.0.1:8005`, you use environment variables instead, or update the fetch requests to point to your new Render API URL. 
   - Add your `.env` variables (like Supabase and Gemini keys) to Vercel later.

2. **Sign up for Vercel**:
   - Go to [Vercel.com](https://vercel.com) and sign in with GitHub.

3. **Add New Project**:
   - Click **Add New...** -> **Project**.
   - Import your GitHub repository.

4. **Configure Project Setup**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Leave as `./` (Root)
   - **Environment Variables**: Expand the environment variables section and add:
     - `VITE_SUPABASE_URL` = Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase Key
     - `VITE_GEMINI_API_KEY` = Your Gemini Key

5. **Deploy**:
   - Click **Deploy**. Vercel will install dependencies, build the React app, and assign it a live custom URL.

---

## Alternative: Easiest "All-In-One" Server Deployment (Docker)

If you have your own VPS (like DigitalOcean, AWS EC2, or Hostinger), you can deploy both using the provided Docker setup in the `MODELS` folder.

1. SSH into your server.
2. Clone your repository: `git clone <your-repo-link>`
3. Navigate to the MODELS directory: `cd eco-feast-story-69d34531/MODELS`
4. Run: `docker-compose up -d --build`

This will spin up your API in an isolated container instance.
