require("dotenv").config();
const app=require("./app");
const db=require("./config/database");
const createAdmin=require("./database/seeders/adminSeeder");

async function startServer(){
 try{
   require("./database/migrate");
   await createAdmin();
   const port=process.env.PORT||3000;
   const server=app.listen(port,()=>console.log(`API rodando em http://localhost:${port}`));
   const shutdown=()=>server.close(()=>{db.close();process.exit(0);});
   process.on("SIGINT",shutdown);
   process.on("SIGTERM",shutdown);
 }catch(err){
   console.error("Erro ao iniciar API:",err);
   db.close();
   process.exit(1);
 }
}
startServer();
