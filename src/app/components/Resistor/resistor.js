import * as resistorConfig from "../../consts/resistorConfig";
import {updateConfig} from "../../utils/helpers";
import Band from "../Band/band";

const Resistor = ({x, y, width, height}) => {
    const updatedConfig = updateConfig(resistorConfig.FORE_BAND, width, height);

    return (
        <svg x={x} y={y} width={width} height={height}>
            {updatedConfig.map((data, index) => <Band key={index} data={data}/>)}
        </svg>
    );
}

export default Resistor;
