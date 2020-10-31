<!DOCTYPE html>
<html lang="en">
<head>
    <? require $_SERVER['DOCUMENT_ROOT'].'/templates/head.php'; ?>
    <link rel="stylesheet" href="/css/style.css">
    <title>Карта СП</title>
</head>
<body>
    <div class="container-fluid mt-3">
        <div class="row">
            <div class="col-4">
                <form action="" method="get">
                    <div class="form-group">
                        <input class="form-control" type="text"
                        name="object_name" placeholder="Enter text...">
                    </div>
                </form>
            </div>
        </div>
    </div>
 
    <canvas id="map"></canvas>
    <script src="map.js"></script>
</body>
</html>