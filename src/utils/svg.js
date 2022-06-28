export const polarToCartesian = function (cx, cy, r, angle) {
    const a = (angle - 90) * Math.PI / 180;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);

    return {x, y}
}

export const describeArc = function (x, y, r, startAngle, endAngle) {
    const start = polarToCartesian(x, y, r, startAngle % 360);
    const end = polarToCartesian(x, y, r, endAngle % 360);
    const large = Math.abs(startAngle - endAngle) >= 180;

    return `M${start.x} ${start.y} A ${r} ${r} 0 ${large ? 1 : 0} 1 ${end.x} ${end.y}`
}