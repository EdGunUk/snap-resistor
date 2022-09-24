import {RectStyled, StopStyled} from "./styled";
import * as colors from "../../styled/settings/colors"

const BackgroundGradient = () => {
    return (
        <>
            <radialGradient id="gradient" r='100%'>
                <StopStyled stopColor={colors.WHITE} offset="0%"/>
                <StopStyled stopColor={colors.SILVER} offset="100%"/>
            </radialGradient>
            <RectStyled as="rect" x="0" y="0"/>
        </>
    );
}

export default BackgroundGradient;
