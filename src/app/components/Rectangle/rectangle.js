const Rectangle = ({id, color, pathData}) => {
    return (
        <path
            d={pathData}
            fill={color}
            data-rectangle-id={id}
        />
    );
}

export default Rectangle;
