const express=require("express");
const cors=require("cors");
const path=require("path");
const authMiddleware=require("./middlewares/authMiddleware");
const errorMiddleware=require("./middlewares/errorMiddleware");


const app=express();
const origins=(process.env.FRONTEND_URL||"http://localhost:5173").split(",").map(s=>s.trim());
app.use(cors({origin:origins}));
app.use(express.json({limit:"1mb"}));
app.use(express.urlencoded({extended:true}));

// Imagens públicas. Não coloque documentos privados nesta pasta/rota.
app.use("/uploads",express.static(path.resolve(process.cwd(),"uploads")));

app.get("/api/health",(req,res)=>res.json({success:true,message:"API funcionando.",timestamp:new Date().toISOString()}));
app.use("/api/auth",require("./modules/auth/auth.routes"));

// Todas as rotas abaixo exigem JWT válido.
app.use("/api",authMiddleware);
app.use("/api/usuarios",require("./modules/usuarios/usuarios.routes"));
app.use("/api/clientes",require("./modules/clientes/clientes.routes"));
app.use("/api/veiculos",require("./modules/veiculos/veiculos.routes"));
app.use("/api/locacoes",require("./modules/locacoes/locacoes.routes"));

app.use((req,res)=>res.status(404).json({success:false,message:"Rota não encontrada."}));
app.use(errorMiddleware);
module.exports=app;
