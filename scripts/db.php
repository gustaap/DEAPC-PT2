<?php
function obterBD() {
    $caminhoBD = __DIR__ . '/../database/lavi.sqlite';

    try {
        $db = new SQLite3($caminhoBD);
        $db->enableExceptions(true);

        // Garante que as chaves estrangeiras funcionam no SQLite
        $db->exec('PRAGMA foreign_keys = ON');

        return $db;
    } catch (Exception $e) {
        die('Erro ao ligar à base de dados: ' . $e->getMessage());
    }
}
?>
