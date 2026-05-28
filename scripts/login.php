<?php
// login.php
$db_path = __DIR__ . '/../lavi_reservas.db';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $data_hora = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'];

    $db = new PDO("sqlite:" . $db_path);
    $db->exec("CREATE TABLE IF NOT EXISTS acessos (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, data_hora TEXT, ip TEXT)");

    $stmt = $db->prepare("SELECT * FROM utilizadores WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        echo "Autenticação bem sucedida via POST! <br>";
        
        // Regista o último acesso do utilizador
        $db->prepare("UPDATE utilizadores SET ultimo_acesso = :data WHERE username = :user")->execute([':data' => $data_hora, ':user' => $username]);
        
        // Insere na tabela de histórico
        $db->prepare("INSERT INTO acessos (username, data_hora, ip) VALUES (:user, :data, :ip)")->execute([':user' => $username, ':data' => $data_hora, ':ip' => $ip]);
        
        echo "Acesso registado com a data: $data_hora";
    } else {
        echo "Erro de credenciais.";
    }
}
?>
