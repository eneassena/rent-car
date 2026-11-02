// Autenticação e tokens, separados do CRUD genérico.

import {
  createHmac,
  timingSafeEqual,
} from 'node:crypto'
import {
  existsSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import type {
  IncomingMessage,
  ServerResponse,
} from 'node:http'
import { resolve } from 'node:path'

interface Usuario {
  id: number
  nome: string
  email: string
  senha: string
}

interface BancoAuth {
  usuarios: Usuario[]
  [tabela: string]: unknown
}

interface OpcoesAuth {
  arquivo: string
  segredo: string
}

function responder(
  res: ServerResponse,
  status: number,
  dados?: unknown,
) {
  res.statusCode = status
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS',
  )

  if (dados === undefined) return res.end()

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(dados))
}

async function lerCorpo(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<Record<string, unknown>> {
  const partes: Buffer[] = []

  for await (const parte of req) {
    partes.push(Buffer.isBuffer(parte) ? parte : Buffer.from(parte))
  }

  if (partes.length === 0) return {}

  try {
    const dados: unknown = JSON.parse(
      Buffer.concat(partes).toString('utf8'),
    )

    if (
      dados === null ||
      typeof dados !== 'object' ||
      Array.isArray(dados)
    ) {
      throw new Error()
    }

    return dados as Record<string, unknown>
  } catch {
    responder(res, 400, { erro: 'JSON inválido' })
    throw new Error('JSON inválido') // Mantém o fluxo de erro após responder
  }
}

function lerBanco(arquivo: string): BancoAuth {
  if (!existsSync(arquivo)) {
    throw new Error(`Banco não encontrado: ${arquivo}`)
  }

  const banco = JSON.parse(
    readFileSync(arquivo, 'utf8'),
  ) as BancoAuth

  banco.usuarios ??= []
  return banco
}

function salvarBanco(arquivo: string, banco: BancoAuth) {
  writeFileSync(arquivo, JSON.stringify(banco, null, 2) + '\n')
}

function gerarToken(usuario: Usuario, segredo: string) {
  const codificar = (valor: unknown) =>
    Buffer.from(JSON.stringify(valor)).toString('base64url')

  const cabecalho = codificar({ alg: 'HS256', typ: 'JWT' })
  const payload = codificar({
    sub: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  })

  const conteudo = `${cabecalho}.${payload}`
  const assinatura = createHmac('sha256', segredo)
    .update(conteudo)
    .digest('base64url')

  return `${conteudo}.${assinatura}`
}

function verificarToken(token: string, segredo: string) {
  const partes = token.split('.')
  if (partes.length !== 3) return null

  const [cabecalho, payload, assinatura] = partes
  const esperado = createHmac('sha256', segredo)
    .update(`${cabecalho}.${payload}`)
    .digest()

  let recebido: Buffer

  try {
    recebido = Buffer.from(assinatura, 'base64url')
  } catch {
    return null
  }

  if (
    esperado.length !== recebido.length ||
    !timingSafeEqual(esperado, recebido)
  ) {
    return null
  }

  try {
    const dados = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    )

    if (
      !Number.isInteger(dados.sub) ||
      typeof dados.exp !== 'number' ||
      dados.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null
    }

    return dados
  } catch {
    return null
  }
}

function semSenha(usuario: Usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  }
}

// Retorna true quando a rota foi tratada; false quando não pertence ao auth.
export function criarRotasAuth(opcoes: OpcoesAuth) {
  const arquivo = resolve(opcoes.arquivo)

  return async function tratarAuth(
    req: IncomingMessage,
    res: ServerResponse,
    caminho: string[],
  ): Promise<boolean> {
    const [acao] = caminho

    if (!['register', 'login', 'me'].includes(acao ?? '')) {
      return false
    }

    if (caminho.length !== 1) {
      responder(res, 404, { erro: 'Rota não encontrada' })
      return true
    }

    try {
      if (req.method === 'POST' && acao === 'register') {
        const { nome, email, senha } = await lerCorpo(req, res)

        if (typeof nome !== 'string' || !nome.trim()) {
          responder(res, 400, { erro: 'Nome é obrigatório' })
          return true
        }

        if (
          typeof email !== 'string' ||
          !/^\S+@\S+\.\S+$/.test(email.trim())
        ) {
          responder(res, 400, { erro: 'E-mail inválido' })
          return true
        }

        if (typeof senha !== 'string' || senha.length < 6) {
          responder(res, 400, {
            erro: 'A senha deve ter no mínimo 6 caracteres',
          })
          return true
        }

        const banco = lerBanco(arquivo)
        const emailNormalizado = email.trim().toLowerCase()

        if (banco.usuarios.some((u) => u.email === emailNormalizado)) {
          responder(res, 409, { erro: 'E-mail já cadastrado' })
          return true
        }

        const id = banco.usuarios.reduce(
          (maior, u) => Math.max(maior, u.id),
          0,
        ) + 1

        const usuario: Usuario = {
          id,
          nome: nome.trim(),
          email: emailNormalizado,
          senha, // Apenas para mock local; veja a observação de segurança.
        }

        banco.usuarios.push(usuario)
        salvarBanco(arquivo, banco)

        responder(res, 201, {
          token: gerarToken(usuario, opcoes.segredo),
          usuario: semSenha(usuario),
        })
        return true
      }

      if (req.method === 'POST' && acao === 'login') {
        const { email, senha } = await lerCorpo(req, res)
        const banco = lerBanco(arquivo)

        const usuario = banco.usuarios.find(
          (u) =>
            u.email === String(email ?? '').trim().toLowerCase() &&
            u.senha === senha,
        )

        if (!usuario) {
          responder(res, 401, { erro: 'E-mail ou senha incorretos' })
          return true
        }

        responder(res, 200, {
          token: gerarToken(usuario, opcoes.segredo),
          usuario: semSenha(usuario),
        })
        return true
      }

      if (req.method === 'GET' && acao === 'me') {
        const [tipo, token] = (
          req.headers.authorization ?? ''
        ).split(' ')

        if (tipo !== 'Bearer' || !token) {
          responder(res, 401, { erro: 'Token não informado' })
          return true
        }

        const payload = verificarToken(token, opcoes.segredo)

        if (!payload) {
          responder(res, 401, { erro: 'Token inválido ou expirado' })
          return true
        }

        const banco = lerBanco(arquivo)
        const usuario = banco.usuarios.find((u) => u.id === payload.sub)

        if (!usuario) {
          responder(res, 401, { erro: 'Usuário não encontrado' })
          return true
        }

        responder(res, 200, semSenha(usuario))
        return true
      }

      responder(res, 405, { erro: 'Método não permitido' })
      return true
    } catch (erro) {
      const status =
        typeof erro === 'object' &&
        erro !== null &&
        'status' in erro &&
        typeof erro.status === 'number'
          ? erro.status
          : 500

      responder(res, status, {
        erro: status === 500
          ? 'Erro interno de autenticação'
          : (erro as Error).message,
      })

      return true
    }
  }
}
