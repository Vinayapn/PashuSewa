const { verifyToken } = require('../utils/jwtHelper');

const socketHandlers = (io) => {
  // Store io on app for use in controllers
  const rooms = {};

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = verifyToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    console.log(`🔌 ${user.name} (${user.role}) connected: ${socket.id}`);

    // Join role-based room
    socket.join(user.role);
    socket.join(`user_${user.id}`);
    socket.join(`${user.role}_${user.id}`);

    // ── CHAT ──────────────────────────────────────────────────────────────
    socket.on('join_chat_room', ({ roomId }) => {
      socket.join(`chat_${roomId}`);
      io.to(`chat_${roomId}`).emit('user_joined', {
        user: { id: user.id, name: user.name, role: user.role },
        timestamp: new Date(),
      });
    });

    socket.on('send_message', ({ roomId, message }) => {
      const messageData = {
        id: Date.now().toString(),
        from: { id: user.id, name: user.name, role: user.role },
        message,
        timestamp: new Date(),
        roomId,
      };
      io.to(`chat_${roomId}`).emit('new_message', messageData);
    });

    socket.on('leave_chat_room', ({ roomId }) => {
      socket.leave(`chat_${roomId}`);
    });

    // ── LOCATION SHARING ─────────────────────────────────────────────────
    socket.on('update_location', ({ coordinates }) => {
      // Broadcast rescuer location to all
      io.to('rescuer').to('ngo').to('doctor').emit('location_update', {
        userId: user.id,
        name: user.name,
        role: user.role,
        coordinates,
        timestamp: new Date(),
      });
    });

    // ── ALERTS ────────────────────────────────────────────────────────────
    socket.on('alert_ack', ({ alertId }) => {
      io.emit('alert_acknowledged', { alertId, by: { id: user.id, name: user.name } });
    });

    // ── STATUS ────────────────────────────────────────────────────────────
    socket.on('status_update', ({ status }) => {
      io.to('rescuer').emit('rescuer_status', {
        userId: user.id,
        name: user.name,
        status,
        timestamp: new Date(),
      });
    });

    // ── TELEMEDICINE ──────────────────────────────────────────────────────
    socket.on('telemedicine_request', ({ patientId, doctorId }) => {
      io.to(`user_${doctorId}`).emit('telemedicine_incoming', {
        from: { id: user.id, name: user.name, role: user.role },
        patientId,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ ${user.name} disconnected`);
      io.emit('user_disconnected', { userId: user.id, name: user.name });
    });
  });

  return io;
};

module.exports = socketHandlers;
