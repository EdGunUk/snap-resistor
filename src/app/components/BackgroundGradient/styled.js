import styled from 'styled-components';
import { FullSizeContainer } from '../../styled/objects/containers';

export const Container = styled(FullSizeContainer)`
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
`;

export const Stop = styled.stop`
    stop-color: ${({ stopColor }) => stopColor};
`;

export const Rect = styled(FullSizeContainer)`
    fill: url(#gradient);
`;
