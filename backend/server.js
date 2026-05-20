const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const rescuerRoutes = require('./src/routes/rescuer');
const ngoRoutes = require('./src/routes/ngo');
const doctorRoutes = require('./src/routes/doctor');
const socketHandlers = require('./src/socket/socketHandlers');

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://pashu-sewa-lime.vercel.app',
    methods: ["GET","POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://pashu-sewa-lime.vercel.app',
  credentials: true,
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rescuer', rescuerRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/doctor', doctorRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ReliefLink API is running', timestamp: new Date().toISOString() });
});

// Socket.io
socketHandlers(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 ReliefLink Server running on port ${PORT}`);
  console.log(`🔌 WebSocket server active`);
});
