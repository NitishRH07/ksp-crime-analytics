# KSP Crime Intelligence Platform

An Intelligent Conversational AI and Crime Analytics Platform designed to enable investigators, analysts, and policymakers to interact with state crime databases using natural language queries, while providing advanced analytical capabilities grounded in criminology.

## 🚀 Key Features
- **Conversational AI Interface:** Query complex crime databases using natural language (supports Kannada detection).
- **Network Graph Analysis:** Identify organized crime groups and visualize relationships between accused, victims, locations, and FIRs.
- **Advanced Crime Analytics:** Dashboards for tracking real-time KPIs, crime trends, hotspots, and district-wise analysis.
- **Offender Profiling & Risk Scoring:** Behavioral analysis and risk-level categorization for suspects.
- **Predictive Forecasting:** AI-driven models to predict future hotspots and send early warning alerts.
- **Role-Based Access Control:** Secure, customized views for Investigators, Analysts, Supervisors, Policymakers, and Admins.
- **Light & Dark Mode:** Beautiful, highly responsive glassmorphism UI.

## 🛠️ Technology Stack
- **Frontend:** React 18, Vite, React Router, Chart.js, D3.js (for network graphs)
- **Backend:** Zoho Catalyst Serverless Advanced I/O Functions (Node.js/Express)
- **Database (Simulated):** Zoho Catalyst Data Store with ZCQL (mocked for demo purposes)
- **Styling:** Custom CSS with CSS Variables for Theme Management

## 📂 Project Structure
```
/
├── client/          # React JS Frontend Application (Vite)
├── functions/       # Zoho Catalyst Serverless Backend Functions
└── catalyst.json    # Zoho Catalyst Project Configuration
```

## ⚙️ Setup and Execution Instructions

### Prerequisites
- Node.js (v18 or higher)
- Zoho Catalyst CLI (optional, if deploying)

### 1. Running the Frontend (Client)
1. Open a terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` (or the port specified by Vite).
5. **Demo Logins:** 
   - investigator@ksp.gov.in / demo123
   - analyst@ksp.gov.in / demo123
   - supervisor@ksp.gov.in / demo123
   - policy@ksp.gov.in / demo123
   - admin@ksp.gov.in / demo123

### 2. Backend Functions (Optional for local UI testing)
The frontend is currently configured to use mock data for demonstration purposes. If you wish to inspect the backend structure:
1. Navigate to any function directory (e.g., `functions/crime-chat`).
2. Run `npm install` to install local dependencies.
3. The functions are designed to be deployed to **Zoho Catalyst** using `catalyst deploy`.

## 📌 Disclaimer
This is a prototype developed for demonstration purposes. Data displayed in the dashboards and charts are realistic mock data created to showcase the platform's analytical capabilities.
