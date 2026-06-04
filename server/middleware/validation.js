const { body, validationResult } = require("express-validator");

/**
 * Validation rules for creating / updating a task.
 * We keep them in a separate file to maintain clean, DRY route handlers.
 */
const taskValidationRules = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("status")
    .optional()
    .isIn(["todo", "inprogress", "done"])
    .withMessage("Status must be todo, inprogress, or done"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
];

/**
 * Middleware: collect any validation errors and respond with 400.
 * If all is well, hands off to the next handler.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { taskValidationRules, validate };
