const router = require("express").Router();
const { z } = require("zod");
const controller = require("./auth.controller");
const validate = require("../../middlewares/validateMiddleware");
const auth = require("../../middlewares/authMiddleware");

router.post("/login", validate(z.object({
  email: z.string().email(),
  password: z.string().min(1)
})), controller.login);
router.get("/me", auth, controller.me);
module.exports = router;
