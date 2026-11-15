CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'ADMIN' CHECK (role = 'ADMIN'),
    ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    telefone TEXT,
    email TEXT,
    endereco TEXT,
    observacoes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS veiculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    placa TEXT NOT NULL UNIQUE,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    ano INTEGER,
    cor TEXT,
    valor_diaria REAL NOT NULL DEFAULT 0 CHECK (valor_diaria >= 0),
    status TEXT NOT NULL DEFAULT 'DISPONIVEL'
      CHECK (status IN ('DISPONIVEL','LOCADO','MANUTENCAO','INATIVO')),
    observacoes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS locacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    veiculo_id INTEGER NOT NULL,
    modalidade TEXT NOT NULL CHECK (modalidade IN ('DIARIA','PERIODO')),
    data_retirada TEXT NOT NULL,
    data_devolucao TEXT NOT NULL,
    valor_diaria REAL,
    valor_fechado REAL,
    valor_total REAL NOT NULL DEFAULT 0 CHECK (valor_total >= 0),
    status TEXT NOT NULL DEFAULT 'ATIVA'
      CHECK (status IN ('ATIVA','FINALIZADA','CANCELADA')),
    observacoes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE RESTRICT,
    CHECK (data_devolucao > data_retirada),
    CHECK (
      (modalidade='DIARIA' AND valor_diaria IS NOT NULL AND valor_diaria>=0 AND valor_fechado IS NULL)
      OR
      (modalidade='PERIODO' AND valor_fechado IS NOT NULL AND valor_fechado>=0 AND valor_diaria IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_locacoes_cliente ON locacoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_locacoes_veiculo ON locacoes(veiculo_id);
CREATE INDEX IF NOT EXISTS idx_locacoes_status ON locacoes(status);
CREATE INDEX IF NOT EXISTS idx_locacoes_datas ON locacoes(data_retirada, data_devolucao);
