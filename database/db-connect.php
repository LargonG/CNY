<?php

$host = 'localhost';
$charset = 'utf8';
$dbName = 'citiesny';
$userName = 'root';
$password = '';

$dsn = "mysql:host=$host;dbname=$dbName;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // выбрасывать исключение в случае ошибки
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // возвращает массив, индексированный именами столбцов результирующего набора
];

try {
    $pdo = new PDO($dsn, $userName, $password, $options);
} catch (PDOException $e) {
    die('Не удалось подключиться к базе данных: '.$e->getMessage());
}

return $pdo;