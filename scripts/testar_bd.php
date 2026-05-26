<?php
require_once __DIR__ . '/db.php';

$db = obterBD();

$resultado = $db->query("
    SELECT id, tipo, nome, destino, preco
    FROM servicos
    ORDER BY id
");

echo "<!DOCTYPE html>";
echo "<html lang='pt'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<title>Teste da Base de Dados</title>";
echo "<style>
    body {
        font-family: Arial, sans-serif;
        background: #f4f6f9;
        padding: 30px;
    }

    h1 {
        color: #1a1f2e;
    }

    table {
        border-collapse: collapse;
        width: 100%;
        max-width: 900px;
        background: white;
    }

    th, td {
        border: 1px solid #d8dde6;
        padding: 10px;
        text-align: left;
    }

    th {
        background: #1a6bcc;
        color: white;
    }

    tr:nth-child(even) {
        background: #f4f6f9;
    }

    a {
        display: inline-block;
        margin-top: 20px;
        color: #1a6bcc;
        text-decoration: none;
        font-weight: bold;
    }
</style>";
echo "</head>";
echo "<body>";

echo "<h1>Serviços na base de dados</h1>";

echo "<table>";
echo "<tr>";
echo "<th>ID</th>";
echo "<th>Tipo</th>";
echo "<th>Nome</th>";
echo "<th>Destino</th>";
echo "<th>Preço</th>";
echo "</tr>";

while ($linha = $resultado->fetchArray(SQLITE3_ASSOC)) {
    echo "<tr>";
    echo "<td>" . htmlspecialchars($linha['id']) . "</td>";
    echo "<td>" . htmlspecialchars($linha['tipo']) . "</td>";
    echo "<td>" . htmlspecialchars($linha['nome']) . "</td>";
    echo "<td>" . htmlspecialchars($linha['destino']) . "</td>";
    echo "<td>" . htmlspecialchars($linha['preco']) . " €</td>";
    echo "</tr>";
}

echo "</table>";

echo "<a href='../index.html'>← Voltar ao início</a>";

echo "</body>";
echo "</html>";
?>
