import {Request} from "express";
import mongoose, {Schema} from "mongoose";

const UserSchema: Schema = new Schema({
  email: {type: String, unique: true},
  password: {type: String, required: true},
  accessToken: {type: String, default: ""}
});

export interface User extends Request {
  _id: string;
  id: string;
  email: string;
  exp?: number;
  password?: string;
  accessToken?: string;
}

export default mongoose.model("User", UserSchema);
