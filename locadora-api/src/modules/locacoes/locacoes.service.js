const db=require("../../config/database");
const AppError=require("../../utils/AppError");
const select = `
 SELECT l.*, c.nome AS cliente_nome, c.cpf AS cliente_cpf,
 v.placa AS veiculo_placa, v.marca AS veiculo_marca, v.modelo AS veiculo_modelo
 FROM locacoes l JOIN clientes c ON c.id=l.cliente_id
 JOIN veiculos v ON v.id=l.veiculo_id
`;
function dateValid(s){if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false; const d = new Date(`${s}T00:00:00Z`); return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10) === s;}
function daysBetween(a,b){return Math.round((Date.parse(`${b}T00:00:00Z`)-Date.parse(`${a}T00:00:00Z`))/86400000);}
function get(id){const row=db.prepare(`${select} WHERE l.id=?`).get(id);if(!row)throw new AppError("Locação não encontrada.",404);return row;}
function list({status,cliente_id,veiculo_id,page=1,limit=20}){
 const w=[],p=[];if(status){w.push("l.status=?");p.push(status);}if(cliente_id){w.push("l.cliente_id=?");p.push(cliente_id);}if(veiculo_id){w.push("l.veiculo_id=?");p.push(veiculo_id);}
 const where=w.length?`WHERE ${w.join(" AND ")}`:"";
 const total=db.prepare(`SELECT COUNT(*) total FROM locacoes l ${where}`).get(...p).total;
 const items=db.prepare(`${select} ${where} ORDER BY l.id DESC LIMIT ? OFFSET ?`).all(...p,limit,(page-1)*limit);
 return {items,pagination:{page,limit,total,pages:Math.ceil(total/limit)}};
}
function validateRelations(d){
 if(!db.prepare("SELECT id FROM clientes WHERE id=?").get(d.cliente_id))throw new AppError("Cliente não encontrado.",404);
 const v=db.prepare("SELECT * FROM veiculos WHERE id=?").get(d.veiculo_id);
 if(!v)throw new AppError("Veículo não encontrado.",404);
 if(v.status!=="DISPONIVEL")throw new AppError("Veículo não está disponível para locação.",409);
 if(!dateValid(d.data_retirada)||!dateValid(d.data_devolucao)||d.data_devolucao<=d.data_retirada)throw new AppError("Informe datas válidas; devolução deve ser posterior à retirada.");
 const days=daysBetween(d.data_retirada,d.data_devolucao);
 if(d.modalidade==="DIARIA"){
   const rate=d.valor_diaria ?? v.valor_diaria;
   if(rate<0)throw new AppError("Valor da diária inválido.");
   return {valor_diaria:rate,valor_fechado:null,valor_total:Math.round(rate*days*100)/100};
 }
 if(d.valor_fechado==null||d.valor_fechado<0)throw new AppError("Informe o valor fechado da locação.");
 return {valor_diaria:null,valor_fechado:d.valor_fechado,valor_total:Math.round(d.valor_fechado*100)/100};
}
function assertNoConflict(veiculoId,start,end,ignoreId){
 const sql=`SELECT id FROM locacoes WHERE veiculo_id=? AND status='ATIVA'
 AND data_retirada < ? AND data_devolucao > ? ${ignoreId?"AND id <> ?":""} LIMIT 1`;
 const args=ignoreId?[veiculoId,end,start,ignoreId]:[veiculoId,end,start];
 if(db.prepare(sql).get(...args))throw new AppError("Este veículo já possui uma locação ativa nesse intervalo.",409);
}
function create(d,img){
 const values=validateRelations(d);
 const tx=db.transaction(()=>{
   assertNoConflict(d.veiculo_id,d.data_retirada,d.data_devolucao);
   const r=db.prepare(`INSERT INTO locacoes(cliente_id,veiculo_id,modalidade,data_retirada,data_devolucao,
     valor_diaria,valor_fechado,valor_total,observacoes,imagem_path)
     VALUES(@cliente_id,@veiculo_id,@modalidade,@data_retirada,@data_devolucao,
     @valor_diaria,@valor_fechado,@valor_total,@observacoes,@imagem_path)`)
     .run({...d,...values,imagem_path:img||null});
   return r.lastInsertRowid;
 });
 return get(tx());
}
function update(id,d,img){
 const old=get(id);if(old.status!=="ATIVA")throw new AppError("Somente locações ativas podem ser alteradas.",409);
 const values=validateRelations(d);
 db.transaction(()=>{
   assertNoConflict(d.veiculo_id,d.data_retirada,d.data_devolucao,id);
   db.prepare(`UPDATE locacoes SET cliente_id=@cliente_id,veiculo_id=@veiculo_id,modalidade=@modalidade,
    data_retirada=@data_retirada,data_devolucao=@data_devolucao,valor_diaria=@valor_diaria,
    valor_fechado=@valor_fechado,valor_total=@valor_total,observacoes=@observacoes,
    imagem_path=@imagem_path,updated_at=CURRENT_TIMESTAMP WHERE id=@id`)
    .run({...d,...values,imagem_path:img||old.imagem_path,id});
 })();
 return {item:get(id),oldImage:img?old.imagem_path:null};
}
function changeStatus(id,status){
 const row=get(id);if(row.status!=="ATIVA")throw new AppError("Esta locação já foi encerrada.",409);
 db.prepare("UPDATE locacoes SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(status,id);
 return get(id);
}
function remove(id){const row=get(id);if(row.status==="ATIVA")throw new AppError("Cancele ou finalize a locação antes de excluí-la.",409);db.prepare("DELETE FROM locacoes WHERE id=?").run(id);return row;}
module.exports={list,get,create,update,changeStatus,remove};
