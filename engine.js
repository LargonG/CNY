/*
    Copyright Antony Panov (LargonG)
*/

class Vector {
    x; y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt(x * x + y * y);
    }

    magnitude2() {
        return x * x + y * y;
    }

    static plus(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }

    static minus(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }

    static dotProduct(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    static crossProduct(a, b) {
        return a.x * b.y - a.y * b.x;
    }

    static angle(a, b) {
        return Math.atan2(this.crossProduct(a, b), this.dotProduct(a, b));
    }
}

class Renderer {
    mapObject;
    zIndex;
    brush;

    constructor(mapObject, brush, zIndex = 0) {
        this.mapObject = mapObject;
        this.brush = brush;
        this.zIndex = zIndex;
    }

    update();

    fillRect(left, up, right, down) {
        this.brush.fillRect();
    }
}

class MapObject {
    position;
    renderer;

    constructor(position) {
        this.position = position;
    }
}


class City extends MapObject {
    constructor(position) {
        super(position);
    }
    
    render() {

    }
}

