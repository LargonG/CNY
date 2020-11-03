<?php
    header('Content-Type: text/xml');
    header("Cache-Control: no-cache, must-revalidate");
    libxml_use_internal_errors(true);

    echo "<?xml version='1.0' encoding='UTF-8' ?>";
    $output = "<talk>123</talk>";
    echo $output;
?>