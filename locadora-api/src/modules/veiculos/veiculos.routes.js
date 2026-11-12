const router = require("express").Router();
const { z } = require("zod");
const c = require("./veiculos.controller");
const validate = require("../../middlewares/validateMiddleware");
const image = require("../../middlewares/uploadMiddleware");
const nullableText = z.string().trim().nullable().optional().default(null);
const schema = z.object({
  placa: z.string().trim().min(7).max(8),
  marca: z.string().trim().min(1),
  modelo: z.string().trim().min(1),
  ano: z
    .preprocess(
      (v) => (v === "" || v === undefined ? null : Number(v)),
      z.number().int().min(1950).max(2100).nullable(),
    )
    .default(null),
  cor: nullableText,
  valor_diaria: z.coerce.number().min(0),
  status: z
    .enum(["DISPONIVEL", "LOCADO", "MANUTENCAO", "INATIVO"])
    .default("DISPONIVEL"),
  observacoes: nullableText,
});
router.get("/disponibilidade", c.availability);
router.get("/", c.list);
router.get("/:id", c.get);
router.post("/", image("veiculos"), validate(schema), c.create);
router.put("/:id", image("veiculos"), validate(schema), c.update);
router.delete("/:id", c.remove);
module.exports = router;
