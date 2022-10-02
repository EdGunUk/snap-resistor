import {Container, Rect, Stop} from "./styled";
import * as colors from "../../styled/settings/colors"

const BackgroundGradient = () => {
    return (
        <Container as="svg">
            <radialGradient id="gradient" r='100%'>
                <Stop stopColor={colors.WHITE} offset="0%"/>
                <Stop stopColor={colors.GRAY} offset="100%"/>
            </radialGradient>
            <Rect as="rect" x="0" y="0"/>
        </Container>
    );
}

export default BackgroundGradient;