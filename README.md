# 🚨 ReliefLink — Disaster Relief Management System

A full-stack role-based disaster relief coordination platform connecting **Rescuers**, **NGOs**, and **Doctors** in real-time.

## Tech Stack
- **Frontend**: React.js + Vite, React Router, Socket.io-client, Google Maps
- **Backend**: Node.js + Express.js, Socket.io, JWT, Nodemailer
- **Database**: MongoDB + Mongoose
- **Real-time**: WebSocket via Socket.io

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB running locally (`mongod`) OR MongoDB Atlas URI

### 1. Configure Backend
Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/relieflink
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password    # Gmail App Password
GOOGLE_MAPS_API_KEY=YOUR_KEY
CLIENT_URL=http://localhost:5173
```

### 2. Configure Google Maps
In `frontend/index.html`, replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual key.

### 3. Start Backend
```powershell
cd backend
npm run dev        # uses nodemon (auto-restart)
# OR: node server.js
```
Backend runs on: `http://localhost:5000`

### 4. Start Frontend
```powershell
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔐 Auth Flow

| Step | Description |
|------|-------------|
| Register | Select role (Rescuer/NGO/Doctor) → fill form → stored in MongoDB |
| Login | Email + Password → JWT issued → role-based redirect |
| Forgot Password | Enter email → OTP via Gmail → verify → reset password |

## 🗂️ Role Dashboards

| Role | Color | Features |
|------|-------|---------|
| 🦺 Rescuer | Orange | SOS alerts, live map, team chat, status updates |
| 🏥 NGO | Blue | Resources, volunteers, broadcast, map |
| 👨‍⚕️ Doctor | Green | Patient triage (Red/Yellow/Green), telemedicine chat, inventory |

## 📁 Project Structure
```
disaster-relief-app/
├── backend/
│   ├── server.js            # Express + Socket.io entry
│   └── src/
│       ├── config/db.js     # MongoDB connection
│       ├── models/          # User, Alert, Resource, Patient
│       ├── controllers/     # auth, rescuer, ngo, doctor
│       ├── middleware/      # JWT auth + role guard
│       ├── routes/          # auth, rescuer, ngo, doctor
│       ├── socket/          # WebSocket handlers
│       └── utils/           # emailService, jwtHelper
└── frontend/
    └── src/
        ├── context/         # AuthContext, SocketContext
        ├── services/api.js  # Axios API layer
        ├── components/      # Sidebar, ChatPanel, MapView
        └── pages/
            ├── auth/        # Login, Register, ForgotPassword
            ├── rescuer/     # RescuerDashboard
            ├── ngo/         # NGODashboard
            └── doctor/      # DoctorDashboard
```

## 🌐 API Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/forgot-password | Public |
| POST | /api/auth/verify-otp | Public |
| POST | /api/auth/reset-password | Public |
| GET | /api/rescuer/dashboard | Rescuer only |
| POST | /api/rescuer/alerts | Rescuer only |
| GET | /api/ngo/dashboard | NGO only |
| POST | /api/ngo/broadcast | NGO only |
| GET | /api/doctor/dashboard | Doctor only |
| POST | /api/doctor/patients | Doctor only |

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| join_chat_room | Client → Server | Join a chat room |
| send_message | Client → Server | Send chat message |
| new_message | Server → Client | Receive message |
| alert_created | Server → All | New SOS alert |
| alert_updated | Server → All | Alert status change |
| broadcast_announcement | Server → All | NGO broadcast |
| update_location | Client → Server | Share GPS location |

## ⚙️ Gmail Setup (Forgot Password)
1. Enable 2-Step Verification on Gmail
2. Go to Google Account → Security → App Passwords
3. Generate an App Password for "Mail"
4. Use that 16-char password as `EMAIL_PASS` in `.env`
