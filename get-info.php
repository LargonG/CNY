<?php
    header('Content-Type: text/xml');
    header("Cache-Control: no-cache, must-revalidate");
    libxml_use_internal_errors(true);

    $id = intval($_GET["id"]);

    $city = array();
    $city["name"] = "Нонхейм";
    $city["owner"] = "Нонхеймская социалистическая республика";
    $city["x"] = -5180;
    $city["z"] = -5180;
    $city["size"] = 2000;
    $city["admit"] = "Общедоступно";
    $city["type"] = "Город";
    $city["description"] = "Столица Нонхеймской федерации";

    echo "<?xml version='1.0' encoding='UTF-8' ?>";
    echo "<body>";
    echo "<name>".$city['name']."</name>";
    echo "<owner>".$city['owner']."</owner>";
    echo "<x>".$city['x']."</x>";
    echo "<z>".$city['z']."</z>";
    echo "<size>".$city['size']."</size>";
    echo "<admit>".$city['admit']."</admit>";
    echo "<type>".$city['type']."</type>";
    echo "<desc>".$city['description']."</desc>";
    echo "</body>";

?>