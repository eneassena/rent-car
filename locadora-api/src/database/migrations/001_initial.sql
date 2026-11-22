
-- Initial migration for creating the database schema for the rental car system
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_usuarios_role
        CHECK (role = 'ADMIN'),

    CONSTRAINT chk_usuarios_ativo
        CHECK (ativo IN (0, 1))
);

-- table of clients
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(150),
    endereco VARCHAR(255),
    observacoes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- table of vehicles
CREATE TABLE IF NOT EXISTS veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL UNIQUE,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano SMALLINT,
    cor VARCHAR(50),
    valor_diaria DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL',
    observacoes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_veiculos_valor_diaria
        CHECK (valor_diaria >= 0),

    CONSTRAINT chk_veiculos_status
        CHECK (status IN ('DISPONIVEL', 'LOCADO', 'MANUTENCAO', 'INATIVO'))
);

-- table of rentals
CREATE TABLE IF NOT EXISTS locacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    veiculo_id INT NOT NULL,
    modalidade VARCHAR(20) NOT NULL,
    data_retirada DATE NOT NULL,
    data_devolucao DATE NOT NULL,
    valor_diaria DECIMAL(10,2) DEFAULT NULL,
    valor_fechado DECIMAL(10,2) DEFAULT NULL,
    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
    observacoes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_locacoes_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_locacoes_veiculo
        FOREIGN KEY (veiculo_id)
        REFERENCES veiculos(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_locacoes_datas
        CHECK (data_devolucao > data_retirada),

    CONSTRAINT chk_locacoes_valor_total
        CHECK (valor_total >= 0),

    CONSTRAINT chk_locacoes_status
        CHECK (status IN ('ATIVA', 'FINALIZADA', 'CANCELADA')),

    CONSTRAINT chk_locacoes_modalidade
        CHECK (modalidade IN ('DIARIA', 'PERIODO')),

    CONSTRAINT chk_locacoes_valores
        CHECK (
            (
                modalidade = 'DIARIA'
                AND valor_diaria IS NOT NULL
                AND valor_diaria >= 0
                AND valor_fechado IS NULL
            )
            OR
            (
                modalidade = 'PERIODO'
                AND valor_fechado IS NOT NULL
                AND valor_fechado >= 0
                AND valor_diaria IS NULL
            )
        ),

    INDEX idx_locacoes_cliente (cliente_id),
    INDEX idx_locacoes_veiculo (veiculo_id),
    INDEX idx_locacoes_status (status),
    INDEX idx_locacoes_datas (data_retirada, data_devolucao)
);
