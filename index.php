<? require $_SERVER['DOCUMENT_ROOT'].'/database/db-connect.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <? require $_SERVER['DOCUMENT_ROOT'].'/templates/head.php'; ?>
    <link rel="stylesheet" href="/css/style.css">
    <title>Карта СП</title>
</head>
<body>
    <div class="infobar-container bg-light rounded border" id="close">
        
        <div class="infobar-search form-group p-2">
            <input class="form-control shadow" type="search" id="search">
        </div>

        <div class="infobar-description">
            
            <div class="border-bottom mb-2 pb-2">
                <div class="h3" id="city-name"></div>
                <div class="text-muted font-italic" id="city-owner"></div>
            </div>
            
            <div class="border-bottom mb-2 pb-2">
                <div class="text-muted">Тип: <span id="city-type"></span></div>
                <div>Доступ: <span id="city-admit"></span></div>
            </div>

            <div class="border-bottom mb-2 pb-2">
                <div>x: <span class="font-weight-bold" id="city-x"></span></div>
                <div>y: <span class="font-weight-bold" id="city-z"></span></div>
                <div>Радиус: <span class="font-weight-bold" id="city-size"></span></div>
            </div>
            
            <div class="font-italic"><span class="h6">Описание:</span><div id="city-desc"></div></div>

            <button class="btn btn-primary font-weight-bolder" id="toggle">></button>
            <script>
                let open = false;
                document.getElementById("toggle").onclick = function() {
                    let element = document.getElementById(open ? "open" : "close");
                    element.id = open ? "close" : "open";
                    this.innerText = open ? ">" : "<";
                    open = !open;
                }
            </script>

        </div>
    </div>
 
    <canvas id="map"></canvas>
    <script src="map.js"></script>
</body>
</html>