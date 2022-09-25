const Rectangle = ({x, y, id, width, height, color}) => {
    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={color}
            data-rectangle-id={id}
        />
    );
}

export default Rectangle;
