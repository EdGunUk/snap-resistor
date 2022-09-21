import styled from 'styled-components';
import {FullSizeContainer} from "../../styled/objects/containers";

export const StopStyled = styled.stop`
  stop-color: ${({stopColor}) => stopColor};
`;

export const RectStyled = styled(FullSizeContainer)`
  fill: url(#gradient);
  height: 100vh;
  width: 100vw;
`;