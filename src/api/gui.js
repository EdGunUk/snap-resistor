import Snap from "snapsvg-cjs";
import RadialNav from "./radialNav";

class Gui {
    constructor(container, buttons) {
        this.paper = Snap(container)
        this.nav = new RadialNav(this.paper, buttons)
    }


}

export default Gui;