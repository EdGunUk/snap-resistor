import Snap from "snapsvg-cjs";
import RadialNav from "./radialNav";
import icons from '../assets/icons.svg'

class Gui {
    static instance = null;
    constructor(container, buttons) {
        if (Gui.instance) {
            return Gui.instance;
        }

        Snap.load(icons, (icons) => {
            this.nav = new RadialNav(this.paper, buttons, icons)
            this.clearEvents = this.#bindEvents();
        })

        this.paper = Snap(container)

        Gui.instance = this
    }

    #bindEvents() {
        const events = [
            {
                name: 'mousedown',
                fuc: this.nav.show.bind(this.nav)
            },
            {
                name: 'mouseup',
                fuc: this.nav.hide.bind(this.nav)
            }
        ]

        for (const event of events) {
            this.paper.node.addEventListener(event.name, event.fuc);
        }

        return () => {
            for (const event of events) {
                this.paper.node.removeEventListener(event.name, event.fuc);
            }
        }
    }


    clear() {
        this.paper.clear();
        this.nav.clear();
        this.clearEvents();
        Gui.instance = null
    }
}

export default Gui;