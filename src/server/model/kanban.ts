import mongoose, {Schema} from "mongoose";
import {Card} from "./card";

const KanbanSchema: Schema = new Schema({
  name: {type: String, required: true},
  admin: {type: Schema.Types.ObjectId, ref: "User"},
  boards: {
    type: [
      {
        name: {type: String, required: true},
        cards: {type: [{type: Schema.Types.ObjectId, ref: "Card"}], default: []}
      }
    ],
    default: []
  }
});

export interface Kanban {
  _id?: string;
  name: string;
  admin: string;
  boards: Board[];
}

export interface Board {
  _id?: string;
  name: string;
  cards: Card[];
}

export default mongoose.model("Kanban", KanbanSchema);
