import Band from '../Band/band';

const Resistor = ({ width, height, config }) => {
    return (
        <svg width={width} height={height}>
            {config.map((data, index) => (
                <Band key={index} id={index} data={data} />
            ))}
        </svg>
    );
};

export default Resistor;
