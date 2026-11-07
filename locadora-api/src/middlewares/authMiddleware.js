const jwt = require("jsonwebtoken");
const db = require("../config/database");
const AppError = require("../utils/AppError");

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) throw new AppError("Token não informado.", 401);
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres.");
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare(
      "SELECT id, nome, email, role, ativo, imagem_path FROM usuarios WHERE id = ?"
    ).get(payload.sub);
    if (!user || !user.ativo) throw new AppError("Usuário não autorizado.", 401);
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError("Token inválido ou expirado.", 401));
  }
}
module.exports = authMiddleware;
