import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const port = process.env.PORT || 3001 || 8080; // Use PORT environment variable

// Start express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To receive JSON data

// Database connection
const userName = "swpl";
const password = "123456sw";
const dbName = "test";

mongoose.connect(
  `mongodb+srv://${userName}:${password}@cluster0.nljjhtw.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`
);

// Global DB connection access (**Not recommended for production**)
global.db = mongoose; // Consider dependency injection for better practices

// Import routes
import usersRouter from './routes/users.js';
import loginRouter from './routes/login.js';
import logsRouter from './routes/logs.js';
import hotelsRouter from './routes/hotels.js';
import bookingsRouter from './routes/bookings.js';
import roomsRouter from './routes/rooms.js';
import availableHotelsRouter from './routes/availableHotels.js';

// Use routes
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logs', logsRouter);
app.use('/hotels', hotelsRouter);
app.use('/bookings', bookingsRouter);
app.use('/rooms', roomsRouter);
app.use('/availableHotels', availableHotelsRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
