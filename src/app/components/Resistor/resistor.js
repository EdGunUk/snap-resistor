import * as resistorConfig from "../../consts/resistorConfig";
import {getFullConfig} from "../../utils/helpers";
import Band from "../Band/band";

const Resistor = ({x, y, width, height}) => {
    const config = getFullConfig(resistorConfig.FORE_BAND, width, height);

    const handlePointerDown = (e) => {
        console.log(e.target);
    }



    return (
        <svg
            x={x}
            y={y}
            width={width}
            height={height}
            onPointerDown={handlePointerDown}
        >
            {config.map((data, index) => <Band key={index} id={index} data={data}/>)}
        </svg>
    );
}

export default Resistor;
