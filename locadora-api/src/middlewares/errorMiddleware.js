const multer = require("multer");
function errorMiddleware(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  let status = err.statusCode || 500;
  let message = status === 500 ? "Erro interno do servidor." : err.message;
  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    status = 409; message = "Já existe um registro com um dos dados informados.";
  } else if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
    status = 409; message = "Registro vinculado a outros dados e não pode ser removido.";
  } else if (err instanceof multer.MulterError) {
    status = 400; message = err.code === "LIMIT_FILE_SIZE" ? "A imagem excede 5 MB." : "Erro no envio do arquivo.";
  }
  res.status(status).json({ success: false, message });
}
module.exports = errorMiddleware;
