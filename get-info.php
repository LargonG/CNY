<?php
    header('Content-Type: text/xml');
    header("Cache-Control: no-cache, must-revalidate");
    libxml_use_internal_errors(true);

    $id = intval($_GET["id"]);

    $pdo = require $_SERVER['DOCUMENT_ROOT'].'/database/db-connect.php';

    $getInfo = 'SELECT * FROM `cities` WHERE `id`=:id';

    $stmt = $pdo->prepare($getInfo);
    $stmt->execute([
        'id' => $id
    ]);
    $city = $stmt->fetch();

    echo "<?xml version='1.0' encoding='UTF-8' ?>";
    echo "<body>";
    echo "<name>".$city['name']."</name>";
    echo "<owner>".$city['owner']."</owner>";
    echo "<x>".$city['x']."</x>";
    echo "<z>".$city['z']."</z>";
    echo "<size>".$city['size']."</size>";
    echo "<admit>".$city['admit']."</admit>";
    echo "<type>".$city['type']."</type>";
    echo "<desc>".html_entity_decode($city['description'])."</desc>";
    echo "</body>";