/*
 * Kanban APIs
 * author: ziwei wei
 */
import express, {Request, Response, NextFunction} from "express";
import path from "path";
import passport from "passport";
import {body, param} from "express-validator";
import {validateFormat} from "../utility/validation";
import {downloadResume} from "../utility/download";

import CardModel, {Card} from "../model/card";
import {User} from "../model/user";
import KanbanModel, {Kanban} from "../model/kanban";

const router = express.Router();

/*
 * get Kanban
 */
router.get(
  "/kanban/:kanbanID",
  passport.authenticate("jwt", {session: false}),
  [param("kanbanID").isMongoId()],
  validateFormat,
  async (req: Request, res: Response) => {
    try {
      const {kanbanID} = req.params;
      const kanban = (await KanbanModel.findOne({_id: kanbanID})
        .populate({
          path: "boards",
          populate: {path: "cards"}
        })
        .lean()) as Kanban;

      res.status(200).send(kanban);
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);

/*
 * create Kanban
 */
router.post(
  "/kanban",
  passport.authenticate("jwt", {session: false}),
  [body("name").isString()],
  validateFormat,
  async (req: Request, res: Response) => {
    try {
      const {name} = req.body;
      const {id} = req.user as User;

      const kanban: Kanban = {
        name: name,
        admin: id,
        boards: [
          {name: "Applied", cards: []},
          {name: "Phone Screen", cards: []},
          {name: "On Site", cards: []},
          {name: "Offered", cards: []},
          {name: "Accepted", cards: []},
          {name: "Rejected", cards: []}
        ]
      };
      const kanbanDoc = new KanbanModel(kanban);
      await kanbanDoc.save();
      res.status(200).send(kanbanDoc.toJSON());
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);

/*
 * update boards
 */
router.put(
  "/kanban/:kanbanID/board",
  passport.authenticate("jwt", {session: false}),
  async (req: Request, res: Response) => {
    try {
      const {kanbanID} = req.params;
      const {boards} = req.body;
      await KanbanModel.updateOne({_id: kanbanID}, {boards: boards});
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);

/*
 * delete Kanban
 */
router.delete(
  "/kanban/:kanbanID",
  passport.authenticate("jwt", {session: false}),
  [param("kanbanID").isMongoId()],
  validateFormat,
  async (req: Request, res: Response) => {
    try {
      const {kanbanID} = req.params;
      const {id} = req.user as User;
      const Kanban = (await KanbanModel.findOneAndDelete({
        _id: kanbanID,
        admin: id
      }).lean()) as Kanban;

      const cards = Kanban.boards
        .map((board) => board.cards)
        .reduce((pre, curr) => pre.concat(curr), []);

      await CardModel.deleteMany({_id: {$in: cards}});

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);

/*
 * create Card
 */
router.post(
  "/kanban/:kanbanID/board/:boardName/card",
  [
    param("kanbanID").isMongoId(),
    body("name").isString(),
    body("phone").isString(),
    body("email").isString(),
    body("education").isString(),
    body("rating").isInt()
  ],
  validateFormat,
  passport.authenticate("jwt", {session: false}),
  async (req: Request, res: Response) => {
    try {
      const {name, phone, email, education, rating} = req.body;
      const {kanbanID, boardName} = req.params;
      const {id} = req.user as User;

      const kanban = (await KanbanModel.findOne({
        _id: kanbanID
      }).lean()) as Kanban;
      if (kanban === null) {
        throw {status: 421, message: "kanban does not exist"};
      }
      if (kanban.boards.every((board) => board.name !== boardName)) {
        throw {status: 421, message: "board does not exist"};
      }

      const card: Card = {
        name: name,
        phone: phone,
        email: email,
        education: education,
        ratings: [
          {
            user: id,
            rating: rating
          }
        ],
        comments: []
      };

      const CardDoc = new CardModel(card);
      await CardDoc.save();

      kanban.boards.map((board) => {
        if (board.name === boardName) {
          board.cards.push(CardDoc._id);
        }
        return board;
      });
      await KanbanModel.updateOne({_id: kanban._id}, kanban);

      res.status(200).send(CardDoc._id);
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);

/*
 * update Card
 */
router.patch(
  "/kanban/:kanbanID/board/:boardName/card/:cardID",
  [
    param("kanbanID").isMongoId(),
    param("cardID").isMongoId(),
    body("name").isString(),
    body("phone").isString(),
    body("email").isString(),
    body("education").isString(),
    body("rating").isInt()
  ],
  validateFormat,
  passport.authenticate("jwt", {session: false}),
  async (req: Request, res: Response) => {
    try {
      const {name, phone, email, education, rating} = req.body;
      const {kanbanID, boardName, cardID} = req.params;
      const {id} = req.user as User;

      const Kanban = (await KanbanModel.findOne({
        _id: kanbanID
      }).lean()) as Kanban;
      if (Kanban === null) {
        throw {status: 421, message: "kanban does not exist"};
      }
      if (Kanban.boards.every((board) => board.name !== boardName)) {
        throw {status: 421, message: "board does not exist"};
      }

      await CardModel.updateOne(
        {_id: cardID},
        {
          $set: {
            name: name,
            phone: phone,
            email: email,
            education: education,
            "ratings.$[rating].rating": rating
          }
        },
        {arrayFilters: [{"rating.user": id}]}
      );
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);

/*
 * move Card
 */
router.post(
  "/kanban/:kanbanID/move",
  [
    param("kanbanID").isMongoId(),
    body("oldBoard").isString(),
    body("oldIndex").isInt(),
    body("newBoard").isString(),
    body("newIndex").isInt()
  ],
  validateFormat,
  passport.authenticate("jwt", {session: false}),
  async (req: Request, res: Response) => {
    try {
      const {oldBoard, oldIndex, newBoard, newIndex} = req.body;
      const {kanbanID} = req.params;

      const kanban = (await KanbanModel.findOne({
        _id: kanbanID
      }).lean()) as Kanban;

      if (kanban === null) {
        throw {status: 421, message: "kanban does not exist"};
      }

      if (kanban.boards.every((board) => board.name !== oldBoard && board.name !== newBoard)) {
        throw {status: 421, message: "board does not exist"};
      }

      const cardID = kanban.boards.reduce((pre, curr) => {
        if (curr.name === oldBoard) {
          return curr.cards[oldIndex]._id || "";
        } else {
          return pre;
        }
      }, "");

      await KanbanModel.updateOne(
        {_id: kanban._id},
        {
          $push: {
            "boards.$[newBoard].cards": cardID,
            $position: newIndex
          }
        },
        {arrayFilters: [{"newBoard.name": newBoard}]}
      );
      await KanbanModel.updateOne(
        {_id: kanban._id},
        {
          $pull: {
            "boards.$[oldBoard].cards": cardID,
            $position: oldIndex
          }
        },
        {arrayFilters: [{"oldBoard.name": oldBoard}]}
      );

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);

/*
 * delete Card
 */
router.delete(
  "/kanban/:kanbanID/board/:boardName/card/:cardID",
  [param("kanbanID").isMongoId(), param("cardID").isMongoId()],
  validateFormat,
  passport.authenticate("jwt", {session: false}),
  async (req: Request, res: Response) => {
    try {
      const {kanbanID, boardName, cardID} = req.params;

      const kanban = (await KanbanModel.findOne({
        _id: kanbanID
      }).lean()) as Kanban;
      if (kanban === null) {
        throw {status: 421, message: "kanban does not exist"};
      }
      if (kanban.boards.every((board) => board.name !== boardName)) {
        throw {status: 421, message: "board does not exist"};
      }

      await KanbanModel.updateOne(
        {_id: kanbanID},
        {
          $pull: {
            "boards.$[theBoard].cards": cardID
          }
        },
        {arrayFilters: [{"theBoard.name": boardName}]}
      );

      await CardModel.deleteOne({_id: cardID});
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);

/*
 * download resume
 */
router.get(
  "/resume/:cardID",
  [param("cardID").isMongoId()],
  validateFormat,
  (req: Request, res: Response) => {
    const {cardID} = req.params;
    res.sendFile(path.resolve("./dist/resume/" + cardID + ".pdf"));
  }
);

/*
 * upload resume
 */
router.post(
  "/kanban/:kanbanID/board/:boardName/card/:cardID/resume",
  [(param("kanbanID").isMongoId(), param("cardID").isMongoId())],
  validateFormat,
  passport.authenticate("jwt", {session: false}),
  async (req: Request, res: Response, next: NextFunction) => {
    const {kanbanID, boardName} = req.params;

    const kanban = (await KanbanModel.findOne({
      _id: kanbanID
    }).lean()) as Kanban;
    if (kanban === null) {
      throw {status: 421, message: "kanban does not exist"};
    }
    if (kanban.boards.every((board) => board.name !== boardName)) {
      throw {status: 421, message: "board does not exist"};
    }

    next();
  },
  downloadResume,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export default router;
