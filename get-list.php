<?php
    header('Content-Type: text/xml');
    header("Cache-Control: no-cache, must-revalidate");
    libxml_use_internal_errors(true);

    $pdo = require __DIR__.'/database/db-connect.php';

    $sql = 'SELECT * FROM `cities`';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo "<?xml version='1.0' encoding='UTF-8' ?>";
    echo "<body>";
    while ($city = $stmt->fetch()) {
        echo "<city>";
            echo "<id>".$city['id']."</id>";
            echo "<name>".$city['name']."</name>";
            echo "<x>".$city['x']."</x>";
            echo "<z>".$city['z']."</z>";
            echo "<size>".$city['size']."</size>";
        echo "</city>";
    }
    echo "</body>";