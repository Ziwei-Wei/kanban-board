/*
 * db connection to mongodb atlas
 * author: ziwei wei
 */
import mongoose from "mongoose";

/**
 * connect to database
 */
const connectDB = async (dbURI: string, dbName: string): Promise<mongoose.Connection> => {
  try {
    const dbOption = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      dbName: dbName
    };
    await mongoose.connect(dbURI, dbOption);
    const db = mongoose.connection;
    return db;
  } catch (error) {
    console.error(error);
    console.log(">>> DB failed to connect <<<");
    process.exit();
  }
};

export default connectDB;
