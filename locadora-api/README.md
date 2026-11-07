# Locadora API

API REST com Node.js, Express, SQLite (`better-sqlite3`), JWT, Zod e upload local de imagens.

## Requisitos
- Node.js 18 ou superior
- npm

## Instalação
1. Copie `.env.example` para `.env`.
2. Defina `JWT_SECRET` com uma chave aleatória de pelo menos 32 caracteres.
3. Defina a senha inicial do administrador (mínimo 12 caracteres).
4. Execute `npm install`.
5. Execute `npm run dev`.

As migrations são executadas automaticamente e o administrador é criado somente se a tabela `usuarios` estiver vazia.

## Importante para quem já executou a migration inicial
Se você já tem a tabela `migrations` e executou `001_initial.sql` na versão anterior do projeto, mantenha o banco existente e copie somente a migration `002_add_images.sql` (e os arquivos atualizados). Não apague `data/database.sqlite` e não tente executar novamente uma migration já registrada.

Se seu banco já tem a migration `001_initial.sql` registrada, a inicialização executará apenas `002_add_images.sql`.

## Autenticação
- `POST /api/auth/login` é público.
- Todas as rotas `/api` restantes exigem `Authorization: Bearer <token>`.
- `GET /api/auth/me` retorna o usuário autenticado (também exige JWT).

Exemplo:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@locadora.com","password":"TroqueEstaSenha123!"}'
```

## Endpoints

### Clientes
- `GET /api/clientes?search=&page=1&limit=20`
- `GET /api/clientes/:id`
- `POST /api/clientes`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`

### Veículos
- `GET /api/veiculos?search=&status=&page=1&limit=20`
- `GET /api/veiculos/disponibilidade?data_retirada=2026-11-10&data_devolucao=2026-11-12`
- `GET /api/veiculos/:id`
- `POST /api/veiculos`
- `PUT /api/veiculos/:id`
- `DELETE /api/veiculos/:id`

### Locações
- `GET /api/locacoes?status=ATIVA&cliente_id=1&veiculo_id=1&page=1&limit=20`
- `GET /api/locacoes/:id`
- `POST /api/locacoes`
- `PUT /api/locacoes/:id`
- `POST /api/locacoes/:id/finalizar`
- `POST /api/locacoes/:id/cancelar`
- `DELETE /api/locacoes/:id` (somente após finalizar/cancelar)

### Usuário administrador
- `GET /api/usuarios/me`
- `PUT /api/usuarios/me/imagem` (multipart, campo `imagem`)

## Envio de imagens
Para `POST` e `PUT` de clientes, veículos e locações, envie `multipart/form-data`; os campos de texto vão junto com o campo de arquivo `imagem`. Formatos aceitos pelo filtro inicial: JPEG, PNG e WebP; limite 5 MB.

O caminho relativo fica no SQLite, por exemplo `/uploads/veiculos/<uuid>.webp`. A rota `/uploads` é pública nesta versão. Não armazene documentos ou imagens sensíveis nela sem implementar entrega autenticada.

## Regras de locação
- Datas no formato `YYYY-MM-DD`.
- `data_devolucao` deve ser posterior a `data_retirada`.
- O intervalo é tratado como `[retirada, devolução)`: uma locação pode começar no mesmo dia em que outra termina.
- DIARIA: `valor_diaria` opcional; se omitido, usa `veiculos.valor_diaria`. O total é diária × número de dias entre as datas.
- PERIODO: exige `valor_fechado`; o total é o valor fechado.
- Só locações com status `ATIVA` bloqueiam o veículo.
- Veículo com status diferente de `DISPONIVEL` não pode ser alugado.
- Não existe exclusão de cliente/veículo com locações vinculadas por causa das foreign keys.

## Exemplos
Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@locadora.com","password":"TroqueEstaSenha123!"}'
```

Criar cliente (sem imagem):
Use JSON? Os endpoints de cadastro aceitam multipart por causa do middleware de imagem. Envie `multipart/form-data` mesmo sem arquivo, ou ajuste as rotas para aceitar JSON caso queira suportar os dois formatos.

Criar locação:
Campos: `cliente_id`, `veiculo_id`, `modalidade`, `data_retirada`, `data_devolucao`, `observacoes` e `valor_diaria` (DIARIA, opcional) ou `valor_fechado` (PERIODO).
