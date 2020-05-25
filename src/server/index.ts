/*
 * main
 * author: ziwei wei
 */
import http from "http";
import fs from "fs";
import mongoose from "mongoose";
import {PORT, dbURI, dbName} from "./config";
import connectDB from "./db";
import app from "./app";

/**
 * safely exit server
 */
const exit = (sig: string, server: http.Server, db: mongoose.Connection): void => {
  if (typeof sig === "string") {
    server.close((error) => {
      if (error) {
        console.error(error);
        process.exit(0);
      }
      console.log(`>>> Server stopped listening at port: ${PORT}`);
      db.close((error) => {
        if (error) {
          console.error(error);
          process.exit(0);
        }
        console.log(`>>> Database disconnected <<<`);
        process.exit(0);
      });
    });
  }
};

/**
 * start the server
 */
const start = async (): Promise<void> => {
  // prepare directory
  console.log(`\n>>> Preparing <<<`);
  const dir = "./dist/resume";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // connect database
  const db = await connectDB(dbURI, dbName);
  console.log(`>>> Database connected <<<`);

  // start listening
  const server = app.listen(PORT, () =>
    console.log(`>>> Server started listening at port: ${PORT}`)
  );

  // handle exit
  process.on("exit", () => {
    console.log(`>>> Server closed <<<`);
  });

  const exitSignals = [
    "SIGHUP",
    "SIGINT",
    "SIGQUIT",
    "SIGILL",
    "SIGTRAP",
    "SIGABRT",
    "SIGBUS",
    "SIGFPE",
    "SIGUSR1",
    "SIGSEGV",
    "SIGUSR2",
    "SIGTERM"
  ] as const;

  // handle exit signals
  exitSignals.forEach((sig) => {
    process.on(sig, () => {
      console.log("\n>>> Exit on: " + sig);
      exit(sig, server, db);
    });
  });
};

/*
 * fire the server
 */

if (require.main === module) {
  start();
}
