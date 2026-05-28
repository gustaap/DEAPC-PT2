<?php
// novoregisto.php - Cumpre o Passo 5, 6 e 7
$db_path = __DIR__ . '/../lavi_reservas.db';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Mensagem de debug sugerida no Passo 5
    echo "A testar registo para o user: $username <br>";

    $db = new PDO("sqlite:" . $db_path);
    // Cria tabela se não existir (Passo 6a)
    $db->exec("CREATE TABLE IF NOT EXISTS utilizadores (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, ultimo_acesso TEXT)");
    
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $insert = $db->prepare("INSERT INTO utilizadores (username, password) VALUES (:username, :password)");
    $insert->execute([':username' => $username, ':password' => $hash]);
    
    echo "Registo gravado na BD com sucesso! (Passo 7a)";
}
?>

