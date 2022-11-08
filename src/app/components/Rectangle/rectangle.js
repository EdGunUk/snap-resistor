import { calculatePath } from '../../utils/helpers';

const Rectangle = ({ id, fill, pathData }) => {
    const path = calculatePath(pathData);

    return <path d={path} fill={fill} data-rectangle-id={id} />;
};

export default Rectangle;
