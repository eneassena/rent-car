const fs = require("fs");
const AppError = require("../utils/AppError");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      if (req.file?.path) fs.unlink(req.file.path, () => {});
      return next(new AppError(
        result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; "),
        400
      ));
    }
    req.body = result.data;
    next();
  };
}
module.exports = validate;
