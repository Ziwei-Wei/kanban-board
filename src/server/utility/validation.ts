/*
 * handle request validation on different scenarios
 * author: ziwei wei
 */
import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";

/**
 * preprocess a image into videos of different size and resolution downwards
 */
export const validateFormat = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<unknown> | undefined => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  } else {
    next();
  }
};
