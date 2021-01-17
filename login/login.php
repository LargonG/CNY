<?php
    $pdo = require __DIR__.'/../database/db-connect.php';

    $login = $_POST['login'];

    $sql = 'select * from `login_data` where login = :login';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'login' => $login
    ]);

    $user = $stmt->fetch();


    $errors = array();
    if ($user != null) {

    } else {
        $errors['login'] = 'Пользователь не найден';
    }