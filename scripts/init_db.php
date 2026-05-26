<?php
require_once __DIR__ . '/db.php';

$db = obterBD();

/*
  Tabela de utilizadores:
  guarda clientes e administradores.
*/
$db->exec("
CREATE TABLE IF NOT EXISTS utilizadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    ultimo_acesso TEXT
);
");

/*
  Tabela de acessos:
  guarda cada login feito por um utilizador.
*/
$db->exec("
CREATE TABLE IF NOT EXISTS acessos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utilizador_id INTEGER NOT NULL,
    data_hora TEXT NOT NULL,
    ip TEXT,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id)
);
");

/*
  Tabela de serviços:
  guarda hotéis, voos e eventos.
*/
$db->exec("
CREATE TABLE IF NOT EXISTS servicos (
    id INTEGER PRIMARY KEY,
    tipo TEXT NOT NULL,
    nome TEXT NOT NULL,
    origem TEXT,
    destino TEXT NOT NULL,
    estrelas INTEGER,
    preco REAL NOT NULL,
    capacidade_max INTEGER NOT NULL,
    disponivel_de TEXT,
    disponivel_ate TEXT,
    localizacao TEXT,
    comodidades TEXT,
    imagem TEXT,
    destaque INTEGER DEFAULT 0,
    texto_botao TEXT
);
");

/*
  Tabela de reservas:
  guarda reservas feitas pelos utilizadores.
*/
$db->exec("
CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utilizador_id INTEGER NOT NULL,
    servico_id INTEGER NOT NULL,
    data_entrada TEXT,
    data_saida TEXT,
    pessoas INTEGER NOT NULL,
    total REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'ativa',
    data_criacao TEXT NOT NULL,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id),
    FOREIGN KEY (servico_id) REFERENCES servicos(id)
);
");

/*
  Tabela de pagamentos:
  guarda método e estado do pagamento.
*/
$db->exec("
CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reserva_id INTEGER NOT NULL,
    metodo TEXT NOT NULL,
    estado TEXT NOT NULL,
    valor REAL NOT NULL,
    data_pagamento TEXT,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id)
);
");

/*
  Administrador inicial.
  Email: laviadmin@hotmail.com
  Password: lavi123
*/
$passwordAdmin = password_hash('lavi123', PASSWORD_DEFAULT);

$stmt = $db->prepare("
INSERT OR IGNORE INTO utilizadores (id, nome, email, password, role)
VALUES (1, :nome, :email, :password, :role)
");

$stmt->bindValue(':nome', 'Admin', SQLITE3_TEXT);
$stmt->bindValue(':email', 'laviadmin@hotmail.com', SQLITE3_TEXT);
$stmt->bindValue(':password', $passwordAdmin, SQLITE3_TEXT);
$stmt->bindValue(':role', 'admin', SQLITE3_TEXT);
$stmt->execute();

/*
  Serviços iniciais mínimos.
  Depois podemos adicionar o resto dos hotéis, voos e eventos.
*/
$servicos = [
    [
        'id' => 1,
        'tipo' => 'hotel',
        'nome' => 'Hotel Avenida Palace',
        'origem' => null,
        'destino' => 'Lisboa, Portugal',
        'estrelas' => 5,
        'preco' => 195,
        'capacidade_max' => 4,
        'disponivel_de' => '2026-01-01',
        'disponivel_ate' => '2026-12-31',
        'localizacao' => 'Lisboa, Avenida da Liberdade • 0,5 km do centro',
        'comodidades' => 'Wi-Fi gratuito • Piscina • Spa • Restaurante',
        'imagem' => 'images/avenida-palace.webp',
        'destaque' => 1,
        'texto_botao' => 'Reservar'
    ],
    [
        'id' => 9,
        'tipo' => 'voo',
        'nome' => 'TAP Air Portugal (LIS ✈ BCN)',
        'origem' => 'Lisboa, Portugal',
        'destino' => 'Barcelona, Espanha',
        'estrelas' => null,
        'preco' => 89,
        'capacidade_max' => 120,
        'disponivel_de' => '2026-01-01',
        'disponivel_ate' => '2026-12-31',
        'localizacao' => 'Voo LIS ➝ BCN • Direto',
        'comodidades' => 'Bagagem de mão • Refeição a bordo',
        'imagem' => 'images/Sagrada.jpg',
        'destaque' => 1,
        'texto_botao' => 'Selecionar'
    ],
    [
        'id' => 11,
        'tipo' => 'evento',
        'nome' => 'Festival NOS Alive',
        'origem' => null,
        'destino' => 'Lisboa, Portugal',
        'estrelas' => null,
        'preco' => 75,
        'capacidade_max' => 5000,
        'disponivel_de' => '2026-07-09',
        'disponivel_ate' => '2026-07-11',
        'localizacao' => 'Lisboa, Passeio Marítimo de Algés',
        'comodidades' => 'Bilhete geral • Música ao vivo • Entrada diária',
        'imagem' => 'images/festivalnos.jpg',
        'destaque' => 1,
        'texto_botao' => 'Comprar bilhete'
    ]
];

$stmtServico = $db->prepare("
INSERT OR IGNORE INTO servicos (
    id, tipo, nome, origem, destino, estrelas, preco, capacidade_max,
    disponivel_de, disponivel_ate, localizacao, comodidades, imagem,
    destaque, texto_botao
)
VALUES (
    :id, :tipo, :nome, :origem, :destino, :estrelas, :preco, :capacidade_max,
    :disponivel_de, :disponivel_ate, :localizacao, :comodidades, :imagem,
    :destaque, :texto_botao
)
");

foreach ($servicos as $servico) {
    $stmtServico->bindValue(':id', $servico['id'], SQLITE3_INTEGER);
    $stmtServico->bindValue(':tipo', $servico['tipo'], SQLITE3_TEXT);
    $stmtServico->bindValue(':nome', $servico['nome'], SQLITE3_TEXT);

    if ($servico['origem'] === null) {
        $stmtServico->bindValue(':origem', null, SQLITE3_NULL);
    } else {
        $stmtServico->bindValue(':origem', $servico['origem'], SQLITE3_TEXT);
    }

    $stmtServico->bindValue(':destino', $servico['destino'], SQLITE3_TEXT);

    if ($servico['estrelas'] === null) {
        $stmtServico->bindValue(':estrelas', null, SQLITE3_NULL);
    } else {
        $stmtServico->bindValue(':estrelas', $servico['estrelas'], SQLITE3_INTEGER);
    }

    $stmtServico->bindValue(':preco', $servico['preco'], SQLITE3_FLOAT);
    $stmtServico->bindValue(':capacidade_max', $servico['capacidade_max'], SQLITE3_INTEGER);
    $stmtServico->bindValue(':disponivel_de', $servico['disponivel_de'], SQLITE3_TEXT);
    $stmtServico->bindValue(':disponivel_ate', $servico['disponivel_ate'], SQLITE3_TEXT);
    $stmtServico->bindValue(':localizacao', $servico['localizacao'], SQLITE3_TEXT);
    $stmtServico->bindValue(':comodidades', $servico['comodidades'], SQLITE3_TEXT);
    $stmtServico->bindValue(':imagem', $servico['imagem'], SQLITE3_TEXT);
    $stmtServico->bindValue(':destaque', $servico['destaque'], SQLITE3_INTEGER);
    $stmtServico->bindValue(':texto_botao', $servico['texto_botao'], SQLITE3_TEXT);

    $stmtServico->execute();
}

echo "<h1>Base de dados criada com sucesso.</h1>";
echo "<p>Local: database/lavi.sqlite</p>";
echo "<p>Tabelas criadas: utilizadores, acessos, servicos, reservas e pagamentos.</p>";
echo "<p>Admin inicial: laviadmin@hotmail.com</p>";
?>
