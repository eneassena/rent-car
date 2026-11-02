// Motor genérico: servidor, rotas, validação e CRUD.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";
import { criarRotasAuth } from "./auth.js";

// Os campos aceitos pelo motor são intencionalmente simples.
type TipoCampo = "string" | "number" | "boolean";

type Registro = {
  id: number;
  [campo: string]: unknown;
};

type Banco = Record<string, Registro[]>;

interface Campo {
  tipo: TipoCampo;
  obrigatorio?: boolean;
}

interface Recurso {
  campos: Record<string, Campo>;
  publico?: boolean;
}

interface Opcoes {
  recursos: Record<string, Recurso>;
  arquivo: string;
  seed?: string;
  porta?: number;
  atrasoMs?: number;
}

class ErroHttp extends Error {
  constructor(
    public status: number,
    mensagem: string,
  ) {
    super(mensagem);
  }
}

// Garante que todas as respostas da API tenham o mesmo formato.
function responder(res: ServerResponse, status: number, dados?: unknown) {
  res.statusCode = status;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (dados === undefined) return res.end();

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(dados));
}

// Lê o JSON enviado no corpo da requisição.
async function lerCorpo(
  req: IncomingMessage,
): Promise<Record<string, unknown>> {
  const partes: Buffer[] = [];

  for await (const parte of req) {
    partes.push(Buffer.isBuffer(parte) ? parte : Buffer.from(parte));
  }

  if (partes.length === 0) return {};

  try {
    const dados: unknown = JSON.parse(Buffer.concat(partes).toString("utf8"));

    if (dados === null || typeof dados !== "object" || Array.isArray(dados)) {
      throw new ErroHttp(400, "O corpo deve ser um objeto JSON");
    }

    return dados as Record<string, unknown>;
  } catch (erro) {
    if (erro instanceof ErroHttp) throw erro;
    throw new ErroHttp(400, "JSON inválido");
  }
}

// Inicializa o banco a partir do seed, se ainda não existir.
function criarBanco(opcoes: Opcoes): Banco {
  mkdirSync(dirname(resolve(opcoes.arquivo)), { recursive: true });

  if (!existsSync(opcoes.arquivo)) {
    if (opcoes.seed && existsSync(opcoes.seed)) {
      copyFileSync(opcoes.seed, opcoes.arquivo);
    } else {
      const inicial: Banco = {};

      for (const nome of Object.keys(opcoes.recursos)) {
        inicial[nome] = [];
      }

      writeFileSync(opcoes.arquivo, JSON.stringify(inicial, null, 2) + "\n");
    }
  }

  console.log("Banco criado ou carregado a partir do arquivo:", opcoes.arquivo);
  return JSON.parse(readFileSync(opcoes.arquivo, "utf8")) as Banco;
}

function salvarBanco(arquivo: string, banco: Banco) {
  writeFileSync(arquivo, JSON.stringify(banco, null, 2) + "\n");
}

function proximoId(registros: Registro[]): number {
  return (
    registros.reduce((maior, registro) => Math.max(maior, registro.id), 0) + 1
  );
}

// Valida e seleciona apenas os campos declarados na configuração.
function validar(
  dados: Record<string, unknown>,
  recurso: Recurso,
  parcial: boolean,
): Record<string, unknown> {
  const resultado: Record<string, unknown> = {};

  for (const [nome, regra] of Object.entries(recurso.campos)) {
    const valor = dados[nome];

    if (valor === undefined) {
      if (!parcial && regra.obrigatorio !== false) {
        throw new ErroHttp(400, `Campo "${nome}" é obrigatório`);
      }
      continue;
    }

    // null não é aceito como substituto de um campo ausente.
    if (valor === null || typeof valor !== regra.tipo) {
      throw new ErroHttp(400, `Campo "${nome}" deve ser do tipo ${regra.tipo}`);
    }

    if (regra.tipo === "string" && !(valor as string).trim()) {
      throw new ErroHttp(400, `Campo "${nome}" não pode estar vazio`);
    }

    if (regra.tipo === "number" && !Number.isFinite(valor)) {
      throw new ErroHttp(400, `Campo "${nome}" deve ser um número válido`);
    }

    resultado[nome] =
      regra.tipo === "string" ? (valor as string).trim() : valor;
  }

  // Não deixa o cliente sobrescrever o ID nem gravar campos desconhecidos.
  const desconhecidos = Object.keys(dados).filter(
    (nome) => nome !== "id" && !(nome in recurso.campos),
  );

  if (desconhecidos.length > 0) {
    throw new ErroHttp(
      400,
      `Campo(s) desconhecido(s): ${desconhecidos.join(", ")}`,
    );
  }

  return resultado;
}

export function criarMock(opcoes: Opcoes) {
  const porta = opcoes.porta ?? 3001;
  const atrasoMs = opcoes.atrasoMs ?? 0;

  // A configuração é fixa; os dados são relidos a cada requisição.
  function tratar(req: IncomingMessage, res: ServerResponse) {
    return executar(req, res).catch((erro: unknown) => {
      if (erro instanceof ErroHttp) {
        return responder(res, erro.status, { erro: erro.message });
      }

      console.error(erro);
      return responder(res, 500, { erro: "Erro interno no mock" });
    });
  }

  async function executar(req: IncomingMessage, res: ServerResponse) {
    if (req.method === "OPTIONS") return responder(res, 204);

    const url = new URL(req.url ?? "/", "http://localhost");
    const partes = url.pathname.split("/").filter(Boolean);

    // Encaminha /auth/* para o módulo de autenticação.
    const endpointAuth = "auth";
    if (partes[0] === endpointAuth) {
      const tratada = await tratarAuth(req, res, partes.slice(1));

      if (tratada) return;
      throw new ErroHttp(404, "Rota de autenticação não encontrada");
    }

    // Rotas no formato /api/:recurso e /api/:recurso/:id.
    if (partes[0] !== "api" || partes.length > 3) {
      throw new ErroHttp(404, "Rota não encontrada");
    }

    const nome = partes[1];
    const recurso = opcoes.recursos[nome];

    if (!recurso) throw new ErroHttp(404, "Recurso não encontrado");

    // Por padrão, os recursos exigem autorização se o projeto a implementar.
    // Esta versão inicial não implementa autenticação.
    if (recurso.publico === false) {
      throw new ErroHttp(401, "Este recurso requer autenticação");
    }

    const banco = criarBanco(opcoes);
    banco[nome] ??= [];
    const registros = banco[nome];
    const idTexto = partes[2];

    // GET /api/:recurso: lista, pesquisa e filtra.
    if (idTexto === undefined && req.method === "GET") {
      const q = url.searchParams.get("q")?.toLowerCase();
      const filtros = [...url.searchParams.entries()].filter(
        ([chave]) => chave !== "q",
      );

      const resultado = registros.filter((registro) => {
        if (q) {
          const encontrou = Object.entries(registro).some(
            ([campo, valor]) =>
              campo !== "id" &&
              typeof valor === "string" &&
              valor.toLowerCase().includes(q),
          );
          if (!encontrou) return false;
        }

        return filtros.every(([campo, valor]) => {
          if (!(campo in recurso.campos)) {
            throw new ErroHttp(400, `Filtro desconhecido: "${campo}"`);
          }

          return String(registro[campo]) === valor;
        });
      });

      return responder(res, 200, resultado);
    }

    // POST /api/:recurso: cria um registro.
    if (idTexto === undefined && req.method === "POST") {
      const dados = validar(await lerCorpo(req), recurso, false);
      const registro = { id: proximoId(registros), ...dados };

      registros.push(registro);
      salvarBanco(opcoes.arquivo, banco);

      return responder(res, 201, registro);
    }

    if (idTexto === undefined) {
      throw new ErroHttp(405, "Método não permitido");
    }

    // Evita aceitar IDs como 1abc, decimais ou valores inválidos.
    if (!/^[1-9]\d*$/.test(idTexto)) {
      throw new ErroHttp(400, "ID inválido");
    }

    const id = Number(idTexto);
    const indice = registros.findIndex((registro) => registro.id === id);

    if (indice === -1) throw new ErroHttp(404, "Registro não encontrado");

    if (req.method === "GET") {
      return responder(res, 200, registros[indice]);
    }

    if (req.method === "PUT" || req.method === "PATCH") {
      const parcial = req.method === "PATCH";
      const dados = validar(await lerCorpo(req), recurso, parcial);

      registros[indice] = { ...registros[indice], ...dados, id };
      salvarBanco(opcoes.arquivo, banco);

      return responder(res, 200, registros[indice]);
    }

    if (req.method === "DELETE") {
      registros.splice(indice, 1);
      salvarBanco(opcoes.arquivo, banco);
      return responder(res, 204);
    }

    throw new ErroHttp(405, "Método não permitido");
  }

  const servidor = createServer((req, res) => {
    // Permite simular a latência de uma API real em testes de frontend.
    if (atrasoMs > 0) {
      setTimeout(() => void tratar(req, res), atrasoMs);
    } else {
      void tratar(req, res);
    }
  });

  const tratarAuth = criarRotasAuth({
    arquivo: opcoes.arquivo,
    segredo: process.env.JWT_SECRET ?? "segredo-apenas-para-mock-local",
  });

  return {
    servidor,

    iniciar() {
      servidor.listen(porta, () => {
        console.log(`API mock rodando em http://localhost:${porta}`);
      });
      return servidor;
    },

    parar() {
      return new Promise<void>((resolve, reject) => {
        servidor.close((erro) => (erro ? reject(erro) : resolve()));
      });
    },
  };
}
