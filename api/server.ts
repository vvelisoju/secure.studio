import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import { verifyTokenHandler } from "./middlewares/tokenHandler";
import auth from "./routes/auth";
import user from "./routes/user";
import serviceCatergory from "./routes/serviceCategory";
import test from "./routes/s3";
import payment from "./routes/payment";
import coupon from "./routes/coupon";
import booking from "./routes/bookings";
import invoice from "./routes/invoice";
import home from "./routes/home";
import company from "./routes/company";
import support from "./routes/support";
import userSubscription from "./routes/userSubscription";
import subscription from "./routes/subscription";
import dashboard from "./routes/dashboard";
import holidays from "./routes/holidays";
import documents from "./routes/documents";
import meetingRoomSetting from "./routes/meetingRoomSetting";
import timeslot from "./routes/timeslot";
import advanceHistory from "./routes/advanceHistory";
import notificationSchedule from "./routes/notificationSchedule";
import notificationTemplate from "./routes/notificationTemplate";
import appSetting from "./routes/appSetting";
import webhook from "./routes/webhook";
import invoiceSetting from "./routes/invoiceSetting";
import passport from "passport"
import "./auth/google"
// import { initializeSocket } from "./services/socket"

// Create Express app and HTTP server
const app = express();
// const server = http.createServer(app);
// // Initialize Socket.io (Socket.io should not be blocked by token middleware)
// const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL, // Production frontend
  "http://localhost:5000", // Development frontend
  "http://localhost:3000"  // Alternative dev port
].filter((origin): origin is string => typeof origin === 'string');

app.use(cors({ 
  origin: allowedOrigins.length > 0 ? allowedOrigins : "*", 
  exposedHeaders: ["Content-Disposition"],
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(passport.initialize()); // Needed to trigger passport strategies

// Public routes (no token verification required)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", auth);
app.use("/api/test", test);
app.use("/api/home", home);
app.use("/api/support", support);
app.use("/api/serviceCatergory", serviceCatergory);
app.use("/api/webhooks", webhook);
// Protected routes (token verification applied)
app.use(verifyTokenHandler);
app.use("/api/user", user);
app.use("/api/coupon", coupon);
app.use("/api/payment", payment);
app.use("/api/booking", booking);
app.use("/api/userSubscription", userSubscription);
app.use("/api/invoice", invoice);
app.use("/api/company", company);
app.use("/api/dashboard", dashboard);
app.use("/api/subscription", subscription);
app.use("/api/holidays", holidays);
app.use("/api/document", documents);
app.use("/api/meetingRoomSetting", meetingRoomSetting);
app.use("/api/timeslot", timeslot);
app.use("/api/advanceHistory", advanceHistory);
app.use("/api/notificationSchedule", notificationSchedule);
app.use("/api/notificationTemplate", notificationTemplate);
app.use("/api/appSetting", appSetting);
app.use("/api/invoiceSetting", invoiceSetting);
// initializeSocket(io); // Initialize WebSocket events
// process.on("SIGINT", () => { io.close(); server.close() }); // Disconnect all existing connections when the server is restarted



// Dynamically import and start all cron jobs
const jobsFolder = path.join(__dirname, "cron");
fs.readdirSync(jobsFolder).forEach(async (file) => {
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    const jobModule = await import(path.join(jobsFolder, file));
    Object.values(jobModule).forEach((job: any) => {
      if (job.start) job.start();
    });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
});