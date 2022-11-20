import { calculatePath } from '../../utils/resistor';

const Rectangle = ({ id, fill, pathData }) => {
    const path = calculatePath(pathData);

    return <path d={path} fill={fill} data-rectangle-id={id} />;
};

export default Rectangle;
