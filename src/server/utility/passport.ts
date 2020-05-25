/*
 * passport strategy config file
 * author: ziwei wei
 */
import passport from "passport";
import validator from "validator";
import passportJWT from "passport-jwt";
import {jwtSetting} from "../config";

export const setup = (): void => {
  passport.use(
    "jwt",
    new passportJWT.Strategy(
      {
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSetting.jwtSecret
      },
      (payload, done) => {
        if (payload.id === undefined || !validator.isMongoId(payload.id)) {
          done(null, false);
        } else {
          if (Date.now() > payload.exp * 1000) {
            done(null, false);
          } else {
            done(null, payload);
          }
        }
      }
    )
  );
};
