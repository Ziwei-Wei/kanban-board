/*
 * Auth APIs
 * author: ziwei wei
 */
import express, {Request, Response} from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {jwtSetting} from "../config";
import bcrypt from "bcrypt";
import {body} from "express-validator";
import {validateFormat} from "../utility/validation";
import UserModel, {User} from "../model/user";

const jwtSecret = jwtSetting.jwtSecret;
const jwtAccessTime = jwtSetting.jwtAccessTime;
const router = express.Router();

/*
 * signin one user
 */
router.post(
  "/user/accessToken",
  [body("email").isEmail().normalizeEmail(), body("password").isString()],
  validateFormat,
  async (req: Request, res: Response) => {
    try {
      const {email, password} = req.body;
      const userDoc = (await UserModel.findOne({
        email: email
      }).lean()) as User;

      if (userDoc === null) {
        throw {status: 401, message: "user does not exist"};
      }

      const passwordsMatch = await bcrypt.compare(password, userDoc.password || "");
      if (passwordsMatch === false) {
        throw {status: 401, message: "password did not match"};
      }

      if (userDoc.accessToken && userDoc.accessToken !== "") {
        const decode = jwt.decode(userDoc.accessToken, {complete: true}) as {
          payload: {exp: number};
        };
        if (decode.payload.exp * 1000 - Date.now() > 5 * 60000) {
          res.status(200).send({_id: userDoc._id, accessToken: userDoc.accessToken});
          return;
        }
      }

      jwt.sign(
        {
          email: email,
          id: userDoc._id
        },
        jwtSecret,
        jwtAccessTime,
        (error, accessToken) => {
          if (error) {
            res.sendStatus(500);
          } else {
            UserModel.updateOne({_id: userDoc._id}, {accessToken: accessToken}, (err) => {
              if (err) {
                res.sendStatus(500);
              } else {
                res.status(200).send({_id: userDoc._id, accessToken: accessToken});
              }
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);

/*
 * signup a new user
 */
router.post(
  "/user",
  [body("email").isEmail().normalizeEmail(), body("password").isString()],
  validateFormat,
  async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const hashCost = 6;
    try {
      const passwordHash = await bcrypt.hash(password, hashCost);
      const userDoc = new UserModel({email: email, password: passwordHash});
      await userDoc.save();

      jwt.sign(
        {
          email: email,
          id: userDoc._id
        },
        jwtSecret,
        jwtAccessTime,
        (error, accessToken) => {
          if (error) {
            res.sendStatus(200);
          } else {
            UserModel.updateOne({_id: userDoc._id}, {accessToken: accessToken}, (err) => {
              if (err) {
                res.sendStatus(200);
              } else {
                res.status(200).send({_id: userDoc._id, accessToken: accessToken});
              }
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);
/*
 * signout me
 */
router.delete(
  "/user/me/accessToken",
  passport.authenticate("jwt", {session: false}),
  async (req: Request, res: Response) => {
    try {
      const {id} = req.user as User;
      await UserModel.updateOne({_id: id}, {accessToken: ""});
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(error.status ? error.status : 500).send(error.message);
    }
  }
);

/*
 * refresh JWT
 */
router.put(
  "/user/me/accessToken",
  passport.authenticate("jwt", {session: false}),
  (req: Request, res: Response) => {
    const {id, email, exp} = req.user as User;
    if (exp && exp * 1000 - Date.now() < 5 * 60000) {
      jwt.sign(
        {
          email: email,
          id: id
        },
        jwtSecret,
        jwtAccessTime,
        (error, accessToken) => {
          if (error) {
            res.sendStatus(500);
          } else {
            UserModel.updateOne({_id: id}, {accessToken: accessToken}, (err) => {
              if (err) {
                res.sendStatus(500);
              } else {
                res.status(200).send({accessToken});
              }
            });
          }
        }
      );
    } else {
      res.status(400).send("can not refresh now");
    }
  }
);

/*
 * check JWT alive
 */
router.get(
  "/user/me/accessToken",
  passport.authenticate("jwt", {session: false}),
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export default router;
