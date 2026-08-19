function translateShape(shape, dx, dy) {
    shape.style.transform += ` translate(${dx}px, ${dy}px)`;
}

function rotateShape(shape, angle) {
    shape.style.transform += ` rotate(${angle}deg)`;
}

function reflectShape(shape, axis) {
    if (axis === "vertical") {
        shape.style.transform += " scaleX(-1)";
    }

    if (axis === "horizontal") {
        shape.style.transform += " scaleY(-1)";
    }
}