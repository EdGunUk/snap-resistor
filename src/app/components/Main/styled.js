import styled from 'styled-components';

import { FullSizeContainer } from '../../styled/objects/containers';

export const Main = styled(FullSizeContainer)`
    cursor: ${({ cursor }) => cursor};
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
