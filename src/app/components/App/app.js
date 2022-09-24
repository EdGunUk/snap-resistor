import BackgroundGradient from "../BackgroundGradient/backgroundGradient";
import Resistor from "../Resistor/resistor";
import {FullSizeContainer} from "../../styled/objects/containers";
import {Main} from "../Main/styled";
import {calculateResistorSize} from "../../utils/helpers";
import useWindowSize from "../../hooks/useWindowSize";

const App = () => {
    const windowSize = useWindowSize();
    const resistorSize = calculateResistorSize(windowSize);

    return (
        <Main>
            <FullSizeContainer as="svg">
                <BackgroundGradient/>
                <Resistor {...resistorSize} />
            </FullSizeContainer>
        </Main>
    );
}

export default App;
