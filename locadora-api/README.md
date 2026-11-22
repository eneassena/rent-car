# Locadora API

API REST com Node.js, Express, MySQL 8.4, JWT, Zod e upload local de imagens.

## Requisitos
- Node.js 18 ou superior
- npm
- MySQL 8.4, ou Docker com Compose

## Instalação
1. Copie `.env.example` para `.env`.
2. Configure `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER` e `MYSQL_PASSWORD`.
   Para o Compose, configure também `MYSQL_ROOT_PASSWORD` e execute `docker compose up -d`.
   Em um MySQL existente, crie o banco e conceda ao usuário acesso para criar e alterar tabelas.
3. Defina `JWT_SECRET` com uma chave aleatória de pelo menos 32 caracteres.
4. Configure `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` (mínimo 12 caracteres).
5. Execute `npm install` e depois `npm run dev` dentro de `locadora-api`.
6. Configure `VITE_API_URL=http://localhost:3001/api` no `.env` do frontend e execute `npm install` e `npm run start` na raiz.

As migrations são executadas automaticamente antes de iniciar o servidor e o administrador é criado somente se a tabela `usuarios` estiver vazia. Também é possível executar `npm run migrate` separadamente.

## Dados existentes no SQLite
As migrations criam as tabelas no MySQL, mas **não copiam os dados do SQLite**. Preserve os arquivos SQLite e a pasta `uploads`; para manter os cadastros existentes é necessária uma importação separada, incluindo IDs, relacionamentos e caminhos das imagens. A configuração MySQL não usa nem modifica o banco SQLite.

## Testes de integração
Os testes exigem um banco MySQL vazio e descartável, criado previamente. Eles criam tabelas e dados nesse banco; nunca indique um banco de produção.

```bash
MYSQL_HOST=127.0.0.1 MYSQL_PORT=3306 MYSQL_USER=usuario MYSQL_PASSWORD=senha \
MYSQL_TEST_DATABASE=locadora_teste npm test
```

## Autenticação
- `POST /api/auth/login` é público.
- Todas as rotas `/api` restantes exigem `Authorization: Bearer <token>`.
- `GET /api/auth/me` retorna o usuário autenticado (também exige JWT).

Exemplo:
```bash
curl -X POST http://localhost:3001/api/auth/login \
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

O caminho relativo fica no MySQL, por exemplo `/uploads/veiculos/<uuid>.webp`. A rota `/uploads` é pública nesta versão. Não armazene documentos ou imagens sensíveis nela sem implementar entrega autenticada.

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
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@locadora.com","password":"TroqueEstaSenha123!"}'
```

Criar cliente (sem imagem):
Os endpoints aceitam JSON sem imagem ou `multipart/form-data` com o campo opcional `imagem`.

Criar locação:
Campos: `cliente_id`, `veiculo_id`, `modalidade`, `data_retirada`, `data_devolucao`, `observacoes` e `valor_diaria` (DIARIA, opcional) ou `valor_fechado` (PERIODO).
