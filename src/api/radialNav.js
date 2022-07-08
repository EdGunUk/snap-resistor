import {describeSector, describeArc} from "../utils/svg";

class RadialNav {
    #areaSize = 300;

    constructor(paper, buttons, icons) {
        this.area = paper
            .svg(0, 0, this.#areaSize, this.#areaSize)
            .addClass('radialnav');
        this.c = this.#areaSize / 2;
        this.r = this.#areaSize * .12;
        this.r2 = this.#areaSize * .25;
        this.angle = 360 / buttons.length;

        this.container = this.area.g()
        this.updateButtons(buttons, icons)

    }

    clear() {
        console.log('RadialNav clear()');
    }

    #sector() {
        return this.area
            .path(describeSector(this.c, this.c, this.r, this.r2, 0, this.angle))
            .addClass('radialnav-sector')
    }

    #button(button, sector, icon, hint) {
        const onHover = function () {
            const elements = [sector, icon, hint]
            for (const element of elements) {
                element.toggleClass('active')
            }
        }

        return this.area
            .g(sector, icon, hint)
            .hover(onHover, onHover)
    }

    #hint(button) {
        const hint = this.area
            .text(0, 0, button.icon)
            .addClass('radialnav-hint hide')
            .attr({
                textpath: describeArc(this.c, this.c, this.r2, 0, this.angle),
            })

        hint.select('*').attr({
            startOffset: '50%'
        })

        return hint;
    }

    static #icon(button, icons) {
        return icons
            .select(`#${button.icon}`)
            .addClass('radialnav-icon');
    }

    updateIcon(button) {
        const icon = this.area
            .select(`#${button.icon}`)

        const box = icon.getBBox();
        const x = this.c - box.x - box.width / 2;
        const y = this.c - this.r - (this.r2 - this.r) / 2 - box.y - box.height / 2;
        const angle = this.angle / 2;

        icon.transform(`T ${x} ${y} R ${angle} ${this.c} ${this.c}`)
    }

    updateButtons(buttons, icons) {
        this.container.clear()

        buttons.forEach((button, i) => {
            const btn = this.#button(button, this.#sector(), RadialNav.#icon(button, icons), this.#hint(button))
            this.updateIcon(button)
            btn.transform(`r${this.angle * i} ${this.c} ${this.c}`)
            this.container.add(btn)
        })
    }
}

export default RadialNav;


