const Band = ({x, y, width, height, color}) => {
    return (
        <rect x={x} y={y} width={width} height={height} fill={color}/>
    );
}

export default Band;
