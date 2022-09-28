import Band from "../Band/band";

const Resistor = ({x, y, width, height, config}) => {
    return (
        <svg
            x={x}
            y={y}
            width={width}
            height={height}
        >
            {config.map((data, index) => <Band key={index} id={index} data={data}/>)}
        </svg>
    );
}

export default Resistor;
