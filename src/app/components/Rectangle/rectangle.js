import {calculatePath} from "../../utils/helpers";

const Rectangle = ({id, color, pathData}) => {
    const path = calculatePath(pathData);

    return (
        <path
            d={path}
            fill={color}
            data-rectangle-id={id}
        />
    );
}

export default Rectangle;
