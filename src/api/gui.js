import Snap from "snapsvg-cjs";
import RadialNav from "./radialNav";
import icons from '../assets/icons.svg'

class Gui {
    static instance = null;
    constructor(container, buttons) {
        if(Gui.instance){
            return Gui.instance;
        }

        Snap.load(icons, (icons) => {
            this.nav = new RadialNav(this.paper, buttons, icons)
        })

        this.paper = Snap(container)
        Gui.instance = this
    }

    clear() {
        this.paper.clear();
        this.nav.clear();
        Gui.instance = null
    }
}

export default Gui;