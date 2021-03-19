/*

*/

const CANVAS_ID = "map";
const CANVAS = document.getElementById(CANVAS_ID);

//#region Driver

/**
 * Является одновременно и точкой, и координатой, и вектором
 */
class Vector {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Возвращает длину вектора
     */
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Нормализирует размер вектора (делает его равным 1)
     */
    normalize() {
        let magnitude = this.magnitude;
        if (magnitude > 0) {
            this.x /= magnitude * 1.0;
            this.y /= magnitude * 1.0;
        }
    }

    // STATIC

    static plus(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }

    static mines(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }

    /**
     * Скалярное произведение векторов
     * @param {Vector} a 
     * @param {Vector} b 
     */
    static dotProduct(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * Векторное произведение векторов
     * @param {Vector} a 
     * @param {Vector} b 
     */
    static crossProduct(a, b) {
        return a.x * b.y - a.y * b.x;
    }

    /**
     * Возвращает угол между векторами
     * @param {Vector} a 
     * @param {Vector} b 
     */
    static angle(a, b) {
        return Math.atan2(crossProduct(a, b), dotProduct(a, b)); // WARNING: может работать не так, как предполагается
    }

    /**
     * Возвращает расстояние между точками
     * @param {Vector} a 
     * @param {Vector} b 
     */
    static distance(a, b) {
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

/**
 * Координатные данные объекта
 */
class Transform {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.position = new Vector(x, y);
    }
}

class Camera {
    constructor(x, y, scale) {
        this.transform = new Transform(x, y);
        this.scale = scale;
    }

    /**
     * Convert pixel coords to world tile coords
     * @param {Vector} position 
     */
    toWorldCoords(position) {
        return new Vector(
            (position.x - CANVAS.width / 2.0) * this.scale + this.transform.position.x,
            (position.y - CANVAS.height / 2.0) * this.scale + this.transform.position.y
        );
    }

    /**
     * Convert world tile coords to pixel coords
     * @param {Vector} position 
     */
    toPixelCoords(position) {
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
class MapRenderer {
    _brush;
    _queue;
    constructor() {
        this._brush = CANVAS.getContext("2d");
        this.color = "#000000";

        this._queue = new Map();

    }
    
    /**
     * Отрисовывает все объекты в очереди
     */
    apply() {
        RENDERER.clear();

        this._queue = new Map([...this._queue.entries()].sort());
        
        for (let arr of this._queue.values()) {
            for (let i = 0; i < arr.length; ++i) {
                arr[i].func.apply(this, arr[i].args);
            }
        }

        this._queue.clear();
    }

    /**
     * Очищает холст
     */
    clear() {
        this._brush.clearRect(0, 0, CANVAS.width, CANVAS.height);
    }

    /**
     * Рисует квадрат на основе мировых точек
     * @param {Vector} position 
     * @param {number} width 
     * @param {number} height 
     * @param {string} color 
     */
    fillRect(position, width, height, color = this.color) {
        let pos = MAIN_CAMERA.toPixelCoords(position);
        this._brush.fillStyle = color;
        this._brush.beginPath();
        this._brush.fillRect(pos.x, pos.y, width / MAIN_CAMERA.scale, height / MAIN_CAMERA.scale);
        this._brush.fill();
    }

    /**
     * Рисует очертание квадрата на основе мировых точек
     * @param {Vector} position 
     * @param {number} width 
     * @param {number} height 
     * @param {string} color 
     */
    strokeRect(position, width, height, color = this.color) {
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
    fillPoligon(points, color = this.color) {
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

    /**
     * Рисует очертание полигона (линию) на основе мировых точек
     * @param {Array<Vector>} points 
     * @param {string} color 
     */
    strokePoligon(points, color = this.color) {
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
    fillArc(position, radius, startAngle = 0, endAngle = 2 * Math.PI, color = this.color) {
        let pos = MAIN_CAMERA.toPixelCoords(position);
        this._brush.fillStyle = color;
        this._brush.beginPath();
        this._brush.arc(pos.x, pos.y, radius / MAIN_CAMERA.scale, startAngle, endAngle);
        this._brush.fill();
    }

    /**
     * Рисует долю окружности на основе мировых точек
     * @param {Vector} position 
     * @param {number} radius 
     * @param {number} startAngle 
     * @param {number} endAngle 
     * @param {string} color 
     */
    strokeArc(position, radius, startAngle = 0, endAngle = 2 * Math.PI, color = this.color) {
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
    writeText(position, text, align = "center", color = "#000000") {
        let textSize = 18;
        this._brush.font = "bold " + textSize.toString() + "px Arial";
        this._brush.fillStyle = color;
        this._brush.textAlign = align;

        var pos = MAIN_CAMERA.toPixelCoords(position);

        this._brush.beginPath();
        this._brush.fillText(text, pos.x, pos.y);
    }

    /**
     * Добавляет функцию отрисовки в очередь отрисовки с определённым приоритетом
     * @param {number} zIndex 
     * @param {Function} func 
     * @param {Array} args 
     */
    addToQueue(zIndex, func, args) {
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

const RENDERER = new MapRenderer();

//#endregion

const MAIN_CAMERA = new Camera(0, 0, 10);
const OBJECTS = [];

class City {
    constructor(id, name, x, y, radius) {
        this.transform = new Transform(x, y);
        this.radius = radius;

        this.name = name;
        this.id = id;
        this.color = "#";

        let letters = "789abcdef";
        for (var i = 0; i < 6; ++i)
            this.color += letters[Math.floor(Math.random() * letters.length)];
        this.color += "66";
    }
    

    render() {
        let sz = 3;
        RENDERER.addToQueue(100, RENDERER.fillArc, [this.transform.position, this.radius, 0, 2 * Math.PI, this.color]);
        
        RENDERER.addToQueue(3, RENDERER.strokeArc, [this.transform.position, (sz + 1) * MAIN_CAMERA.scale]);
        RENDERER.addToQueue(4, RENDERER.fillArc, [this.transform.position, sz * MAIN_CAMERA.scale,
            0, 2 * Math.PI, "#ffffff"]);
        
        RENDERER.addToQueue(0, RENDERER.writeText, [Vector.plus(this.transform.position, new Vector(0, -10 * MAIN_CAMERA.scale)),
            this.name]);
    }
}

class SelectPoint {
    constructor(x, y) {
        this.transform = new Transform(x, y);
        this.active = false;
    }
    

    findNearest(objects) {
        const MAX_DISTANCE = 100;
        let obj = null;
        let pixelPosition = MAIN_CAMERA.toPixelCoords(this.transform.position);
        let dist = Infinity;
        for (let i = 0; i < objects.length; ++i) {
            let newDist = Vector.distance(pixelPosition,
                MAIN_CAMERA.toPixelCoords(objects[i].transform.position));
            if (this !== objects[i] && (obj == null || newDist < dist) && newDist <= MAX_DISTANCE) {
                obj = objects[i];
                dist = newDist;
            }
        }
        if (obj != null) {
            this.transform.position = new Vector(obj.transform.position.x, obj.transform.position.y);
        }
        return obj;
    }

    render() {
        if (this.active) {
            RENDERER.addToQueue(-1, function(position, color="#ff0000") {
                const DELTA_X = 10;
                const DELTA_Y = 20;
                let pos = MAIN_CAMERA.toPixelCoords(position);

                this._brush.strokeStyle = "#555555";
                this._brush.fillStyle = color;

                this._brush.beginPath();
                this._brush.moveTo(pos.x, pos.y);
                this._brush.lineTo(pos.x - DELTA_X, pos.y - DELTA_Y);
                this._brush.arc(pos.x, pos.y - DELTA_Y, DELTA_X, Math.PI, - 2 * Math.PI);
                this._brush.lineTo(pos.x, pos.y);
                this._brush.fill();
                this._brush.stroke();

                this._brush.fillStyle = "#ffffff";
                
                this._brush.beginPath();
                this._brush.arc(pos.x, pos.y - DELTA_Y, DELTA_X / 2, 0, 2 * Math.PI);
                this._brush.fill();
                this._brush.stroke();
            }, [this.transform.position]);
        }
    }
}

let SELECT_POINT = new SelectPoint(0, 0);

window.onload = function main() {
    window.onresize();
    let request = new XMLHttpRequest();
    request.open("GET", "get-list.php", true);
    request.addEventListener("readystatechange", function () {

        if (request.readyState === 4 && request.status === 200) {
            let params = ["id", "name", "x", "z", "size"];
            let cities = request.responseXML.getElementsByTagName("city");
            for (let i = 0; i < cities.length; ++i) {
                let cityParams = new Map();
                for (let j = 0; j < params.length; ++j) {
                    cityParams.set(params[j], cities[i].getElementsByTagName(params[j])[0].textContent);
                }
                let id = parseInt(cityParams.get("id"));
                let x = parseInt(cityParams.get("x"));
                let y = parseInt(cityParams.get("z"));
                let size = parseInt(cityParams.get("size"));
                let city = new City(id, cityParams.get("name"), x, y, size);
                OBJECTS.push(city);
            }
        }
    });
    request.send();
    OBJECTS.push(SELECT_POINT);
    
    setInterval(() => {
        for (let i = 0; i < OBJECTS.length; ++i) {
            OBJECTS[i].render();
        }
        RENDERER.apply();
    }, 10);
        
}

const CAMERA_MOVEMENT = {
    active: false,
    lastPosition: new Vector(0, 0),
    downPosition: new Vector(0, 0),
    clickedOnCanvas: false
};

CANVAS.onmousedown = function(event) {
    CAMERA_MOVEMENT.active = true;
    CAMERA_MOVEMENT.lastPosition = new Vector(event.clientX, event.clientY);
    CAMERA_MOVEMENT.downPosition = new Vector(event.clientX, event.clientY);
}

window.onmousemove = function(event) {
    if (CAMERA_MOVEMENT.active) {
        let mousePosition = new Vector(event.clientX, event.clientY);

        let movement = new Vector(-(mousePosition.x - CAMERA_MOVEMENT.lastPosition.x),
            -(mousePosition.y - CAMERA_MOVEMENT.lastPosition.y));
        
        MAIN_CAMERA.transform.position.x += movement.x * MAIN_CAMERA.scale;
        MAIN_CAMERA.transform.position.y += movement.y * MAIN_CAMERA.scale;
        CAMERA_MOVEMENT.lastPosition = mousePosition;
    }
}

window.onmouseup = function(event) {
    CAMERA_MOVEMENT.active = false;
    let upPosition = new Vector(event.clientX, event.clientY);

    const EPS = 1e-7;
    if (Vector.distance(CAMERA_MOVEMENT.downPosition, upPosition) <= EPS) {
        onCustomClicked(event);
    }
}

window.onwheel = function(event) {
    const DELTA = .2;
    const LOW = 0;
    const HIGH = 100;

    var direction = (event.wheelDelta > 0 ? 1 : -1);
    if (LOW < MAIN_CAMERA.scale + DELTA * -direction && MAIN_CAMERA.scale + DELTA * MAIN_CAMERA.scale * -direction <= HIGH) {
        MAIN_CAMERA.scale += (-direction * DELTA * MAIN_CAMERA.scale);
    }

}

function getInformation(object) {
    let request = new XMLHttpRequest();
    request.open("GET", "get-info.php?id=" + object.id, true);
    request.addEventListener('readystatechange', function() {
        if (request.readyState === 4 && request.status === 200) {
            writeInformation(request.responseXML);
        }
    });
    request.send();
}

function writeInformation(objectXML = null) {
    let list = ["name", "owner", "admit", "type", "desc", "x", "z", "size"];
    for (let i = 0; i < list.length; ++i) {
        document.getElementById("city-" + list[i]).innerText = (objectXML == null ? "" :
        objectXML.getElementsByTagName(list[i])[0].textContent);
    }
}

function onCustomClicked(event) {
    SELECT_POINT.transform.position = MAIN_CAMERA.toWorldCoords(new Vector(event.clientX, event.clientY));
    SELECT_POINT.active = !SELECT_POINT.active;
    if (SELECT_POINT.active) {
        let foundedObject = SELECT_POINT.findNearest(OBJECTS);
        if (foundedObject != null) {
            getInformation(foundedObject);
        }
    } else {
        writeInformation(null);
    }
}