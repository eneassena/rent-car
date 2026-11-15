const router = require("express").Router();
const { z } = require("zod");
const c = require("./clientes.controller");
const validate = require("../../middlewares/validateMiddleware");
const image = require("../../middlewares/uploadMiddleware");
const text = z.string().trim().nullable().optional().default(null);
const schema = z.object({
  nome: z.string().trim().min(2),
  cpf: z.string().trim().min(11).max(14),
  telefone: text, email: z.union([z.string().email(), z.literal(""), z.null()]).optional().default(null),
  endereco: text, observacoes: text
});
router.get("/",c.list);
router.get("/:id",c.get);
router.post("/",image("clientes"),validate(schema),c.create);
router.put("/:id",image("clientes"),validate(schema),c.update);
router.delete("/:id",c.remove);
module.exports = router;
