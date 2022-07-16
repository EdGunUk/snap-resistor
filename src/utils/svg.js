import Snap from "snapsvg-cjs";

export const polarToCartesian = function (cx, cy, r, angle) {
    const a = (angle - 90) * Math.PI / 180;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);

    return {x, y}
}

export const describeArc = function (x, y, r, startAngle, endAngle, continueLine) {
    const start = polarToCartesian(x, y, r, startAngle % 360);
    const end = polarToCartesian(x, y, r, endAngle % 360);
    const large = Math.abs(startAngle - endAngle) >= 180;
    const sweep = endAngle > startAngle;

    return `${continueLine ? 'L' : 'M'} ${start.x} ${start.y} A ${r} ${r} 0 ${large ? 1 : 0} ${sweep ? 1 : 0} ${end.x} ${end.y}`
}

export const describeSector = function (x, y, r, r2, startAngle, endAngle) {
    return `${describeArc(x, y, r, startAngle, endAngle)}
    ${describeArc(x, y, r2, endAngle, startAngle, true)} Z`
}

export const animate = function (obj, index, start, end, duration, easing, fn, cb) {
    if (!obj.animation) {
        obj.animation = []
    }

    if (obj.animation[index]) {
        obj.animation[index].stop()
    }

    return obj.animation[index] = Snap.animate(start, end, fn, duration, easing, cb)
}