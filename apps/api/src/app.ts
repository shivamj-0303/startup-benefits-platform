import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { generalRateLimiter, authRateLimiter } from "./middleware/rateLimiter";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import protectedRouter from "./routes/protected";
import dealsRouter from "./routes/deals";
import claimsRouter from "./routes/claims";

const app = express();

app.use(helmet());

const corsOptions = {
  origin: ["https://startup-benefits-platform-web.vercel.app/","http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.use(generalRateLimiter);

app.use("/health", healthRouter);
app.use("/auth", authRateLimiter, authRouter);
app.use("/protected", protectedRouter);
app.use("/deals", dealsRouter);
app.use("/claims", claimsRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
