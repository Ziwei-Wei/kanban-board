import mongoose, {Schema} from "mongoose";

const CardSchema: Schema = new Schema({
  name: {type: String, required: true},
  phone: {type: String, required: true},
  email: {type: String, required: true},
  education: {type: String, required: true},
  ratings: {
    type: [
      {
        user: {type: Schema.Types.ObjectId, ref: "User"},
        rating: {type: Number}
      }
    ],
    default: []
  },
  comments: {type: [{author: {type: String}, text: {type: String}}], default: []}
});

export interface Card {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  education: string;
  ratings: {
    user: string;
    rating: number;
  }[];
  comments: {
    author: string;
    text: string;
  }[];
}

export interface RawCard {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  education: string;
  rating: number;
}

export default mongoose.model("Card", CardSchema);
