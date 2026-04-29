<?php

$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$telefone = $_POST['telefone'] ?? '';
$nascimento = $_POST['nascimento'] ?? '';
$area = $_POST['area'] ?? '';
$interesse = $_POST['interesse'] ?? '';
$origem = $_POST['origem'] ?? [];
$outros = $_POST['outrosTexto'] ?? '';
$mensagem = $_POST['mensagem'] ?? '';

// Se marcou "outros", adiciona texto
if (in_array("outros", $origem) && !empty($outros)) {
    $origem[] = $outros;
}

$dados = [
    "nome" => $nome,
    "email" => $email,
    "telefone" => $telefone,
    "nascimento" => $nascimento,
    "area" => $area,
    "interesse" => $interesse,
    "origem" => $origem,
    "mensagem" => $mensagem,
    "data" => date("Y-m-d H:i:s")
];

$arquivo = 'dados.json';

$lista = [];

if (file_exists($arquivo)) {
    $lista = json_decode(file_get_contents($arquivo), true);
}

$lista[] = $dados;

file_put_contents($arquivo, json_encode($lista, JSON_PRETTY_PRINT));

// Redireciona
header("Location: cadastro.php?sucesso=1");
exit;
?>