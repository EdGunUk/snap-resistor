import * as resistorConfig from "../../consts/resistorConfig";
import {updateConfig} from "../../utils/helpers";

const Resistor = ({x, y, width, height}) => {
    const updatedConfig = updateConfig(resistorConfig.FORE_BAND, width, height);
    console.log(updatedConfig);

    return (
        <svg x={x} y={y} width={width} height={height}>
            <rect width="100%" height="100%" fill="red"/>
            {/*{updatedConfig.map(data => <Band data={data}/>)}*/}
        </svg>
    );
}

export default Resistor;
