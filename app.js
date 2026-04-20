import express from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./src/routes/index.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import noticeRoutes from "./src/modules/notice/notice.route.js"
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api", routes);
app.use(
  "/api/notices",
  noticeRoutes
);
// health check
app.get("/", (req, res) => {
  res.send("ERP API Running 🚀");
});

// error handler
app.use(errorMiddleware);

export default app;