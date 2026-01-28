import { env } from "./config/env";
import app from "./app";
import { connectDB, setupConnectionListeners } from "./db/connect";

/**
 * Start the server after connecting to the database
 */
async function startServer() {
  try {
    setupConnectionListeners();
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
startServer();
