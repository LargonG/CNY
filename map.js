/*

*/

const CANVAS_ID = "map";
const CANVAS = document.getElementById(CANVAS_ID);
const RENDERER = new MapRenderer();

//#region Driver

/**
 * Является одновременно и точкой, и координатой, и вектором
 * @param {number} x 
 * @param {number} y 
 */
function Vector(x, y) {
    this.x = x;
    this.y = y;

    this.getMagnitude = () => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    this.normalize = () => {
        let magnitude = this.getMagnitude();
        if (magnitude > 0) {
            this.x /= magnitude * 1.0;
            this.y /= magnitude * 1.0;
        }
    }
}

function plusVectors(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
}

function minesVectors(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
}

/**
 * Скалярное произведение векторов
 * @param {Vector} a 
 * @param {Vector} b 
 */
function getDotProduct(a, b) {
    return a.x * b.x + a.y * b.y;
}

/**
 * Векторное произведение векторов
 * @param {Vector} a 
 * @param {Vector} b 
 */
function getCrossProduct(a, b) {
    return a.x * b.y - a.y * b.x;
}

/**
 * Возвращает угол между векторами
 * @param {Vector} a 
 * @param {Vector} b 
 */
function getAngle(a, b) {
    return Math.atan2(getCrossProduct(a, b), getDotProduct(a, b)); // WARNING: может работать не так, как предполагается
}

/**
 * Возвращает расстояние между точками
 * @param {Vector} a 
 * @param {Vector} b 
 */
function getDistance(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Transform(x, y) {
    this.position = new Vector(x, y);
}

function Camera(x, y, scale) {
    this.transform = new Transform(x, y);
    this.scale = scale;

    /**
     * Convert pixel coords to world tile coords
     * @param {Vector} position 
     */
    this.toWorldCoords = function(position) {
        return new Vector(
            (position.x - CANVAS.width / 2.0) * this.scale + this.transform.position.x,
            (position.y - CANVAS.height / 2.0) * this.scale + this.transform.position.y
        );
    }

    /**
     * Convert world tile coords to pixel coords
     * @param {Vector} position 
     */
    this.toPixelCoords = function(position) {
        return new Vector(
            (position.x - this.transform.position.x) / this.scale + CANVAS.width / 2,
            (position.y - this.transform.position.y) / this.scale + CANVAS.height / 2
        );
    }
}

/**
 * Оболочка над обыной context canvas.
 * Здесь учитывается камера пользователя, указваются сразу мировые координаты.
 */
function MapRenderer() {
    this._brush = CANVAS.getContext("2d");
    this.color = "#000000";

    this._queue = new Map();

    this.apply = function() {
        RENDERER.clear();
        
        for (let arr of this._queue.values()) {
            for (let i = 0; i < arr.length; ++i) {
                arr[i].func.apply(this, arr[i].args);
            }
        }

        this._queue.clear();
    }

    this.clear = function clear() {
        this._brush.clearRect(0, 0, CANVAS.width, CANVAS.height);
    }

    /**
     * Рисует квадрат на основе мировых точек
     * @param {Vector} position 
     * @param {number} width 
     * @param {number} height 
     * @param {string} color 
     */
    this.fillRect = function(position, width, height, color = this.color) {
        let pos = MAIN_CAMERA.toPixelCoords(position);
        this._brush.fillStyle = color;
        this._brush.beginPath();
        this._brush.fillRect(pos.x, pos.y, width / MAIN_CAMERA.scale, height / MAIN_CAMERA.scale);
        this._brush.fill();
    }

    this.strokeRect = function(position, width, height, color = this.color) {
        let pos = MAIN_CAMERA.toPixelCoords(position);
        this._brush.strokeStyle = color;
        this._brush.beginPath();
        this._brush.strokeRect(pos.x, pos.y, width / MAIN_CAMERA.scale, height / MAIN_CAMERA.scale);
        this._brush.stroke();
    }

    /**
     * Рисует полигон на основе мировых точек
     * @param {Array<Vector>} points 
     * @param {string} color 
     */
    this.fillPoligon = function(points, color = this.color) {
        this._brush.fillStyle = color;
        this._brush.beginPath();

        let pos;
        
        if (points.length > 0) {
            pos = MAIN_CAMERA.toPixelCoords(points[0]);
            this._brush.moveTo(pos.x, pos.y);
        }

        for (let i = 0; i < points.length; ++i) {
            pos = MAIN_CAMERA.toPixelCoords(points[i]);
            this._brush.lineTo(pos.x, pos.y);
        }

        this._brush.fill();
    }

    this.strokePoligon = function(points, color = this.color) {
        this._brush.strokeStyle = color;
        this._brush.beginPath();

        let pos;
        
        if (points.length > 0) {
            pos = MAIN_CAMERA.toPixelCoords(points[0]);
            this._brush.moveTo(pos.x, pos.y);
        }

        for (let i = 0; i < points.length; ++i) {
            pos = MAIN_CAMERA.toPixelCoords(points[i]);
            this._brush.lineTo(pos.x, pos.y);
        }

        this._brush.stroke();
    }

    /**
     * Рисует долю круга (или весь) на основе мировых координат
     * @param {Vector} position 
     * @param {number} radius 
     * @param {number} startAngle 
     * @param {number} endAngle 
     * @param {string} color 
     */
    this.fillArc = function(position, radius, startAngle = 0, endAngle = 2 * Math.PI, color = this.color) {
        let pos = MAIN_CAMERA.toPixelCoords(position);
        this._brush.fillStyle = color;
        this._brush.beginPath();
        this._brush.arc(pos.x, pos.y, radius / MAIN_CAMERA.scale, startAngle, endAngle);
        this._brush.fill();
    }

    this.strokeArc = function(position, radius, startAngle = 0, endAngle = 2 * Math.PI, color = this.color) {
        let pos = MAIN_CAMERA.toPixelCoords(position);
        this._brush.strokeStyle = color;
        this._brush.beginPath();
        this._brush.arc(pos.x, pos.y, radius / MAIN_CAMERA.scale, startAngle, endAngle);
        this._brush.stroke();
    }
    /**
     * 
     * @param {Vector} position 
     * @param {string} text 
     * @param {string} align 
     * @param {string} color 
     */
    this.writeText = function(position, text, align = "center", color = "#000000") {
        let textSize = 18;
        this._brush.font = "bold " + textSize.toString() + "px Arial";
        this._brush.fillStyle = color;
        this._brush.textAlign = align;

        var pos = MAIN_CAMERA.toPixelCoords(position);

        this._brush.beginPath();
        this._brush.fillText(text, pos.x, pos.y);
    }

    /**
     * Добавляет функцию отрисовки в поток отрисовки с определённым индексом
     * @param {number} zIndex 
     * @param {Function} func 
     * @param {Array} args 
     */
    this.addToQueue = function(zIndex, func, args) {
        if (!this._queue.has(-zIndex)) {
            this._queue.set(-zIndex, []);
        }
        this._queue.get(-zIndex).push({func: func, args: args});
    }
}

// Resizes the canvas
window.onresize = function() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
}

//#endregion

const MAIN_CAMERA = new Camera(0, 0, 10);
const OBJECTS = [];


function City(id, name, x, y, radius) {
    this.transform = new Transform(x, y);
    this.radius = radius;

    this.name = name;
    this.id = id;
    this.color = "#";

    let letters = "0123456789ab";
    for (var i = 0; i < 6; ++i)
        this.color += letters[Math.floor(Math.random() * letters.length)];
    this.color += "66";

    this.render = function() {
        let sz = 3;
        RENDERER.addToQueue(100, RENDERER.fillArc, [this.transform.position, this.radius, 0, 2 * Math.PI, this.color]);
        
        RENDERER.addToQueue(3, RENDERER.strokeArc, [this.transform.position, (sz + 1) * MAIN_CAMERA.scale]);
        RENDERER.addToQueue(4, RENDERER.fillArc, [this.transform.position, sz * MAIN_CAMERA.scale,
            0, 2 * Math.PI, color = "#ffffff"]);
        
        RENDERER.addToQueue(0, RENDERER.writeText, [plusVectors(this.transform.position, new Vector(0, -10 * MAIN_CAMERA.scale)),
            this.name]);
    }
}

window.onload = function main() {
    window.onresize();
    OBJECTS.push(new City(1, "Нонхейм", -5180, -5180, 2000));
    OBJECTS.push(new City(2, "Спавн", 0, 0, 500));
    OBJECTS.push(new City(3, "Trard", -1100, -850, 2000));
    OBJECTS.push(new City(4, "Драгонленд", -3800, -1300, 1000));
    
    setInterval(() => {
        for (let i = 0; i < OBJECTS.length; ++i) {
            OBJECTS[i].render();
        }
        RENDERER.apply();
    }, 10);
        
}

const CAMERA_MOVEMENT = {active: false, lastPosition: new Vector(0, 0)};

CANVAS.onmousedown = function(event) {
    CAMERA_MOVEMENT.active = true;
    CAMERA_MOVEMENT.lastPosition = new Vector(event.clientX, event.clientY);
}

CANVAS.onmousemove = function(event) {
    if (CAMERA_MOVEMENT.active) {
        let mousePosition = new Vector(event.clientX, event.clientY);

        let movement = new Vector(-(mousePosition.x - CAMERA_MOVEMENT.lastPosition.x),
            -(mousePosition.y - CAMERA_MOVEMENT.lastPosition.y));
        
        MAIN_CAMERA.transform.position.x += movement.x * MAIN_CAMERA.scale;
        MAIN_CAMERA.transform.position.y += movement.y * MAIN_CAMERA.scale;
        CAMERA_MOVEMENT.lastPosition = mousePosition;
    }
}

CANVAS.onmouseup = function() {
    CAMERA_MOVEMENT.active = false;
}

CANVAS.onwheel = function(event) {
    const DELTA = .2;
    const LOW = 0;
    const HIGH = 100;

    var direction = (event.wheelDelta > 0 ? 1 : -1);
    if (LOW < MAIN_CAMERA.scale + DELTA * -direction && MAIN_CAMERA.scale + DELTA * MAIN_CAMERA.scale * -direction <= HIGH) {
        MAIN_CAMERA.scale += (-direction * DELTA * MAIN_CAMERA.scale);
    }

}