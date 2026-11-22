const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

test("fluxos da API com MySQL", async (t) => {
  if (!process.env.MYSQL_TEST_DATABASE) {
    throw new Error("Configure MYSQL_TEST_DATABASE com um banco de teste vazio e descartável.");
  }
  process.env.MYSQL_DATABASE = process.env.MYSQL_TEST_DATABASE;
  process.env.JWT_SECRET = "chave-de-teste-com-mais-de-32-caracteres";
  process.env.ADMIN_NAME = "Admin Teste";
  process.env.ADMIN_EMAIL = "admin-teste@example.com";
  process.env.ADMIN_PASSWORD = "SenhaDeTeste123!";

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rentcar-test-"));
  const oldCwd = process.cwd();
  process.chdir(dir);
  const db = require("../src/config/database");
  let server;
  t.after(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    await db.end();
    process.chdir(oldCwd);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  const [tables] = await db.execute(
    "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
    [process.env.MYSQL_TEST_DATABASE]
  );
  assert.equal(tables.length, 0, "O banco de teste deve estar vazio.");

  const migrate = require("../src/database/migrate");
  await migrate();
  await migrate();
  await require("../src/database/seeders/adminSeeder")();
  const app = require("../src/app");
  server = await new Promise((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  const base = `http://127.0.0.1:${server.address().port}/api`;
  let token;
  async function request(url, { method = "GET", body, auth = true } = {}) {
    const headers = {};
    if (auth && token) headers.Authorization = `Bearer ${token}`;
    if (body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(body);
    }
    const response = await fetch(base + url, { method, headers, body });
    return { status: response.status, ...(await response.json()) };
  }

  assert.equal((await request("/clientes")).status, 401);
  assert.equal((await request("/auth/login", { method: "POST", body: { email: process.env.ADMIN_EMAIL, password: "incorreta" } })).status, 401);
  const login = await request("/auth/login", { method: "POST", body: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD } });
  assert.equal(login.status, 200);
  token = login.data.token;
  assert.equal((await request("/auth/me")).data.email, process.env.ADMIN_EMAIL);
  assert.equal((await request("/usuarios/me")).status, 200);

  const image = new FormData();
  image.append("imagem", new Blob(["imagem"], { type: "image/png" }), "imagem.png");
  assert.match((await request("/usuarios/me/imagem", { method: "PUT", body: image })).data.imagem_path, /^\/uploads\/usuarios\//);

  const clientBody = { nome: "Cliente Teste", cpf: "12345678901", telefone: "11999999999", email: "cliente@example.com", endereco: "Rua A", observacoes: "teste" };
  const clientForm = new FormData();
  for (const [key, value] of Object.entries(clientBody)) clientForm.append(key, value);
  clientForm.append("imagem", new Blob(["imagem"], { type: "image/png" }), "imagem.png");
  const client = await request("/clientes", { method: "POST", body: clientForm });
  assert.equal(client.status, 201);
  assert.equal(client.data.observacoes, "teste");
  assert.match(client.data.imagem_path, /^\/uploads\/clientes\//);
  assert.equal((await request("/clientes", { method: "POST", body: clientBody })).status, 409);
  assert.equal((await request("/clientes?search=cliente%40example.com&page=1&limit=1")).data.pagination.total, 1);
  assert.equal((await request(`/clientes/${client.data.id}`, { method: "PUT", body: { ...clientBody, nome: "Cliente Atualizado" } })).data.nome, "Cliente Atualizado");
  assert.equal((await request(`/clientes/${client.data.id}`)).status, 200);

  const vehicleBody = { placa: "ABC1234", marca: "Teste", modelo: "Modelo", ano: 2020, cor: "Azul", valor_diaria: 123.45, status: "DISPONIVEL" };
  const vehicle = await request("/veiculos", { method: "POST", body: vehicleBody });
  assert.equal(vehicle.status, 201);
  assert.equal(vehicle.data.valor_diaria, 123.45);
  assert.equal((await request("/veiculos?search=ABC&page=1&limit=1")).data.items.length, 1);
  assert.equal((await request(`/veiculos/${vehicle.data.id}`, { method: "PUT", body: { ...vehicleBody, cor: "Preto" } })).data.cor, "Preto");
  assert.equal((await request(`/veiculos/${vehicle.data.id}`)).status, 200);

  const rentalBody = { cliente_id: client.data.id, veiculo_id: vehicle.data.id, modalidade: "DIARIA", data_retirada: "2026-01-10", data_devolucao: "2026-01-12", valor_diaria: "" };
  const [first, second] = await Promise.all([
    request("/locacoes", { method: "POST", body: rentalBody }),
    request("/locacoes", { method: "POST", body: rentalBody }),
  ]);
  assert.deepEqual([first.status, second.status].sort(), [201, 409]);
  const rental = first.status === 201 ? first.data : second.data;
  assert.equal(rental.valor_total, 246.9);
  assert.equal(rental.data_retirada, "2026-01-10");
  assert.equal((await request("/veiculos/disponibilidade?data_retirada=2026-01-11&data_devolucao=2026-01-13")).data.length, 0);
  assert.equal((await request("/veiculos/disponibilidade?data_retirada=2026-01-12&data_devolucao=2026-01-13")).data.length, 1);
  assert.equal((await request("/locacoes?search=Atualizado&page=1&limit=1")).data.pagination.total, 1);
  assert.equal((await request(`/locacoes/${rental.id}`)).status, 200);
  assert.equal((await request(`/locacoes/${rental.id}`, { method: "PUT", body: { ...rentalBody, modalidade: "PERIODO", valor_fechado: 200 } })).data.valor_total, 200);
  assert.equal((await request(`/clientes/${client.data.id}`, { method: "DELETE" })).status, 409);
  assert.equal((await request(`/locacoes/${rental.id}`, { method: "DELETE" })).status, 409);
  assert.equal((await request("/dashboard/overview")).data.cards.totalLocacoes, 1);
  assert.equal((await request(`/locacoes/${rental.id}/finalizar`, { method: "POST" })).data.status, "FINALIZADA");
  assert.equal((await request(`/locacoes/${rental.id}`, { method: "DELETE" })).status, 200);
  const [dates] = await db.execute("SELECT CURDATE() AS today, CURDATE() + INTERVAL 1 DAY AS tomorrow");
  const cancelled = await request("/locacoes", { method: "POST", body: {
    ...rentalBody, data_retirada: dates[0].today, data_devolucao: dates[0].tomorrow, valor_diaria: null,
  } });
  assert.equal(cancelled.status, 201);
  assert.equal((await request("/dashboard/overview")).data.stats.receitaMensal, 123.45);
  assert.equal((await request(`/locacoes/${cancelled.data.id}/cancelar`, { method: "POST" })).data.status, "CANCELADA");
  assert.equal((await request("/dashboard/overview")).data.stats.receitaMensal, 0);
  assert.equal((await request(`/locacoes/${cancelled.data.id}`, { method: "DELETE" })).status, 200);
  assert.equal((await request(`/veiculos/${vehicle.data.id}`, { method: "DELETE" })).status, 200);
  assert.equal((await request(`/clientes/${client.data.id}`, { method: "DELETE" })).status, 200);
});
