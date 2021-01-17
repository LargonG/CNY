<?php
    $pdo = require __DIR__.'/database/db-connect.php';

    echo "<pre>";
    $cities = (array) json_decode(file_get_contents("cities.json"), false)->cities;
    var_dump($cities);
    for ($i = 0; $i < count($cities); ++$i) {

//        $name = $_POST['name'];
//        $owner = $_POST['owner'];
//        $x = intval($_POST['x']);
//        $z = intval($_POST['z']);
//        $size = intval($_POST['size']);
//        $admit = $_POST['admit'];
//        $description = $_POST['description'];

        $cities[$i] = (array) $cities[$i];
        $name = $cities[$i]['name'];
        $owner = $cities[$i]['owner'];
        $x = intval($cities[$i]['x']);
        $z = intval($cities[$i]['z']);
        $size = intval($cities[$i]['size']);
        $admit = $cities[$i]['admit'];
        $description = $cities[$i]['description'];

        $sql = 'INSERT INTO `cities`(`name`, `owner`, `x`, `z`, `size`, `admit`, `description`) VALUES(:name, :owner, :x, :z, :size, :admit, :description)';


        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'name' => $name,
            'owner' => $owner,
            'x' => $x,
            'z' => $z,
            'size' => $size,
            'admit' => $admit,
            'description' => $description
        ]);
    }
