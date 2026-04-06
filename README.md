<div align="center">
  <img src="https://raw.githubusercontent.com/Chayan4505/eco-feast-story-69d34531/main/public/navbar_logo.png" alt="MealMind / EcoFeast Logo" width="250" />

  <h2>AI-Powered Food Waste Reduction & Operational Command Center</h2>
</div>

---

## 📖 Project Details

**MealMind (formerly EcoFeast)** is an intelligent, full-stack predictive application designed to optimize institutional food service operations. By leveraging Machine Learning (XGBoost) and predictive analytics, MealMind dynamically adjusts portion sizes and cooking requirements based on historical data, weather parameters, and sentiment analysis. This drastically reduces food waste, cuts down operational costs, and ensures optimized resource allocation.

## 🏗️ Project Structure

The project follows a decoupled mono-repo style structure, dividing the frontend dashboard and the data-science backend.

```text
eco-feast-story-69d34531/
├── MODELS/                     # The Machine Learning Backend
│   ├── main.py                 # FastAPI server & inference engine
│   ├── ecofeast_model/         # Pre-trained XGBoost JSON models (.json)
│   ├── ecofeast_features/      # Master dataset & historical aggregations
│   ├── requirements.txt        # Python dependencies for the backend
│   └── docker-compose.yml      # Containerization config for easy deployment
├── src/                        # The React Command Center UI
│   ├── components/             # Reusable UI components (Tailwind + Radix UI)
│   ├── routes/                 # Pages (Dashboard, Menu, Feedback, etc.) using TanStack Router
│   ├── lib/                    # Core utilities (e.g., Supabase client wrapper)
│   └── hooks/                  # Custom React hooks (e.g., animation, mobile sizing)
├── public/                     # Static assets (Logos, Icons)
├── DEPLOYMENT.md               # Step-by-step production deployment instructions
├── package.json                # Frontend NPM dependencies
└── vite.config.ts              # Vite bundler configuration
```

## 🔄 Workflows

MealMind operates utilizing a continuous feedback communication loop between the AI and the operations team:
1. **Data Ingestion:** The frontend Dashboard pulls real-world context (Humidity, Temperature, Menu Type, Sentiment).
2. **Inference Request:** The UI makes a request to the backend `/predict` and `/savings` endpoints.
3. **ML Processing:** The FastAPI server cleans the variables, fetches rolling 7-day/14-day history from `master_features.csv`, and feeds it into the XGBoost pipeline.
4. **Actionable Output:** The model recommends exact cooking capacities. It also calculates dynamic "alerts" based on weather boundaries (e.g., Attendance drop alerts if Humidity > 85%).
5. **Feedback Loop:** Operators log end-of-day waste quantities. The backend incorporates this via a "Sentiment Decay" multiplier prioritizing portion caution on subsequent days.

## ⚙️ Requirements

To successfully run this project locally, ensure your machine has the following prerequisites:
- **Node.js**: v18.0.0 or higher (for the frontend).
- **Python**: v3.9 or higher (for the backend inference).
- **Package Managers**: `npm`, `yarn`, or `bun`.
- **API Keys Required** (to be set in a `.env` file):
  - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  - `VITE_GEMINI_API_KEY` (for AI chat integration)
  
## 💻 Tech Stack

**Frontend Command Center:**
- **Core:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/), Class Variance Authority, Radix UI Primitives
- **Data Visualization:** Recharts
- **Database Backend:** Supabase (Client-Side Auth & DB)

**Backend Inference Engine:**
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/), Uvicorn
- **Data Manipulation:** Pandas, NumPy
- **Machine Learning:** XGBoost Regressors

## 🧠 Model Related Details

The decision engine is driven by a series of specialized models located in the `MODELS` directory:
- **Algorithm Architecture:** XGBoost Regression trees configured for probabilistic modeling.
- **Quantile Regression Outputs:** The system relies on three parallel models:
  - `q10_model`: The 10th percentile (Aggressive savings / Worst-case low-attendance bound).
  - `q50_model`: The median baseline recommendation.
  - `q90_model`: The 90th percentile (Safety-first high bound to prevent food shortage).
- **Core Predictive Features (`feature_columns.json`):**
  - **Temporal Variance:** Evaluates rolling standard deviations, day of the week, quarter, and holidays.
  - **Menu Characteristics:** Dynamically categorizes dish metadata (e.g., assigns multipliers to "Chicken" vs "Paneer").
  - **Atmospheric Index:** Specifically integrates Heat Index formulas and weather discounting to handle spontaneous absence loops during rain/humidity spikes.

## 🔗 Project URLs & Basic Information

When the environment is running locally, use the following access points:

- **Frontend User Interface:** [http://localhost:5173](http://localhost:5173) *(Vite Dev Server)*
- **Machine Learning API:** [http://127.0.0.1:8005](http://127.0.0.1:8005) *(Uvicorn Worker)*
- **API Swagger Documentation:** [http://127.0.0.1:8005/docs](http://127.0.0.1:8005/docs) *(FastAPI Built-in)*
- **Alternative ML API OpenAPI Schema:** [http://127.0.0.1:8005/redoc](http://127.0.0.1:8005/redoc)
