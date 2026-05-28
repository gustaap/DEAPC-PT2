<?php
// historico_acessos.php
$db_path = __DIR__ . '/../lavi_reservas.db';
$db = new PDO("sqlite:" . $db_path);

$stmt = $db->query("SELECT * FROM acessos ORDER BY data_hora DESC");
$registos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<h3>Lista de Acessos</h3><table border='1'>";
echo "<tr><th>Username</th><th>Data e Hora</th><th>Endereço IP</th></tr>";
foreach ($registos as $row) {
    echo "<tr><td>{$row['username']}</td><td>{$row['data_hora']}</td><td>{$row['ip']}</td></tr>";
}
echo "</table>";
?>
