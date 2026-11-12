const router=require("express").Router();
const {z}=require("zod");
const c=require("./locacoes.controller");
const validate=require("../../middlewares/validateMiddleware");
const image=require("../../middlewares/uploadMiddleware");
const nullableText=z.string().trim().nullable().optional().default(null);
const schema=z.object({
 cliente_id:z.coerce.number().int().positive(),
 veiculo_id:z.coerce.number().int().positive(),
 modalidade:z.enum(["DIARIA","PERIODO"]),
 data_retirada:z.string(),
 data_devolucao:z.string(),
 valor_diaria:z.preprocess(v => v === "" || v === undefined ? null : Number(v), z.number().min(0).nullable()).default(null),
 valor_fechado:z.preprocess(v => v === "" || v === undefined ? null : Number(v), z.number().min(0).nullable()).default(null),
 observacoes:nullableText
});
router.get("/",c.list);
router.get("/:id",c.get);
router.post("/",image("locacoes"),validate(schema),c.create);
router.put("/:id",image("locacoes"),validate(schema),c.update);
router.post("/:id/finalizar",c.finish);
router.post("/:id/cancelar",c.cancel);
router.delete("/:id",c.remove);
module.exports=router;
