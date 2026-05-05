const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
});

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use((req, res, next) => { req.io = io; next(); });

// routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/menu',         require('./routes/Menu'));
app.use('/api/orders',       require('./routes/orders'));
app.use('/api/tables',       require('./routes/tables'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/bills',        require('./routes/bills'));
app.use('/api/staff',        require('./routes/staff'));
app.use('/api/analytics',    require('./routes/analytics'));

io.on('connection', socket => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

httpServer.listen(process.env.PORT, () =>
  console.log(`Dineflow server running on port ${process.env.PORT}`)
);