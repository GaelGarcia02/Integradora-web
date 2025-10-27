import { body, validationResult } from "express-validator";

export const validateEmail = (field) => {
  return body(field)
    .optional()
    .isEmail()
    .withMessage(`${field} must be a valid email address`);
};

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
