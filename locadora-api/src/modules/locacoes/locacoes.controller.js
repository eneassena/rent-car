const s=require("./locacoes.service");
const {publicImagePath,removeFileByPublicPath}=require("../../utils/fileUtils");
const fs=require("fs");
function list(req,res,next){try{res.json({success:true,data:s.list({status:req.query.status,cliente_id:req.query.cliente_id?+req.query.cliente_id:undefined,veiculo_id:req.query.veiculo_id?+req.query.veiculo_id:undefined,page:Math.max(1,+req.query.page||1),limit:Math.min(100,Math.max(1,+req.query.limit||20))})});}catch(e){next(e);}}
function get(req,res,next){try{res.json({success:true,data:s.get(+req.params.id)});}catch(e){next(e);}}
function create(req,res,next){try{res.status(201).json({success:true,data:s.create(req.body,publicImagePath(req.file))});}catch(e){if(req.file)fs.unlink(req.file.path,()=>{});next(e);}}
function update(req,res,next){try{const r=s.update(+req.params.id,req.body,publicImagePath(req.file));if(r.oldImage)removeFileByPublicPath(r.oldImage);res.json({success:true,data:r.item});}catch(e){if(req.file)fs.unlink(req.file.path,()=>{});next(e);}}
function finish(req,res,next){try{res.json({success:true,data:s.changeStatus(+req.params.id,"FINALIZADA")});}catch(e){next(e);}}
function cancel(req,res,next){try{res.json({success:true,data:s.changeStatus(+req.params.id,"CANCELADA")});}catch(e){next(e);}}
function remove(req,res,next){try{const row=s.remove(+req.params.id);removeFileByPublicPath(row.imagem_path);res.json({success:true,message:"Locação excluída."});}catch(e){next(e);}}
module.exports={list,get,create,update,finish,cancel,remove};
