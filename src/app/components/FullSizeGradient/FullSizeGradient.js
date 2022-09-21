import {RectStyled, StopStyled} from "./styled";
import * as colors from "../../styled/settings/colors"
import {FullSizeContainer} from "../../styled/objects/containers";

const FullSizeGradient = () => {
    return (
        <FullSizeContainer as="svg">
            <radialGradient id="gradient" r='100%'>
                <StopStyled stopColor={colors.WHITE} offset="0%"/>
                <StopStyled stopColor={colors.SILVER_CHALICE} offset="100%"/>
            </radialGradient>
            <RectStyled as="rect" x="0" y="0"/>
        </FullSizeContainer>
    );
}

export default FullSizeGradient;
