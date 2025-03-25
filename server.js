const express = require("express");
const cors = require("cors");
const SerialPort = require("serialport");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Allows frontend to connect
});

app.use(cors());
app.use(express.json());

// Open COM5 for Arduino Communication
const port = new SerialPort.SerialPort({
  path: "COM5",
  baudRate: 9600,
});

port.on("data", (data) => {
  const attendanceData = data.toString().trim();
  console.log("Received from Arduino:", attendanceData);

  // Broadcast data to frontend via WebSocket
  io.emit("attendance-update", attendanceData);
});

// API endpoint to check if server is running
app.get("/", (req, res) => {
  res.send("RFID Attendance Server is running...");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
