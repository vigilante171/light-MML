import connectDatabase from "./config/database.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import genealogyRoutes from "./routes/genealogyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";`r`
import referralRoutes from "./routes/referralRoutes.js";
import commissionRoutes from "./routes/commissionRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Security & Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URI || "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ✅ Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// ✅ Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product MLM API is running",
    environment: process.env.NODE_ENV,
  });
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);`r`
app.use("/api/referrals", referralRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/genealogy", genealogyRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/wallet", walletRoutes);
app.use(
  "/api/withdrawals",
  withdrawalRoutes
);
app.use(
  "/api/notifications",
  notificationRoutes
);

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ Start Server
const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();


