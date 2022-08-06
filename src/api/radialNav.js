import {describeSector, describeArc, animate, getRandom} from "../utils/svg";

class RadialNav {
    #areaSize = 300;

    constructor(paper, buttons, icons) {
        this.area = paper
            .svg(0, 0, this.#areaSize, this.#areaSize)
            .addClass('radialnav hide');
        this.c = this.#areaSize / 2;
        this.r = this.#areaSize * .12;
        this.r2 = this.#areaSize * .25;
        this.angle = 360 / buttons.length;
        this.animDuration = 300;

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

    #animateContainer(start, end, duration, easing, cb) {
        const BASE_ROTATE = 90;
        const random = getRandom(0, 1);
        const baseDirection = random ? BASE_ROTATE : -BASE_ROTATE;

        animate(this, 0, start, end, duration, easing, (val) => {
            this.container.transform(`R${baseDirection - val * baseDirection} S${val} ${this.c} ${this.c}`)
        }, cb)
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
            .hover(this.#buttonOver(), this.#buttonOut())
    }

    #animateButtonHover(button, start, end, duration, easing, cb) {
        animate(button, 1, start, end, duration, easing, ((val) => {
            button[0].attr({d: describeSector(this.c, this.c, this.r, this.r2 - val * 5, 0, this.angle)})
            button[2].transform(`S${1.1 - val * .1} ${this.c} ${this.c}`)
        }), cb)
    }

    #buttonOver() {
        const context = this;

        return function () {
            context.#animateButtonHover(this, 0, 1, 200, window.mina.easeinout)
            this[2].removeClass('hide')
        }


    }

    #buttonOut() {
        const context = this;

        return function () {
            context.#animateButtonHover(this, 1, 0, 2000, window.mina.elastic, () => {
                this[2].addClass('hide')
            })
        }
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

        icon.transform(`T${x} ${y} R${angle} ${this.c} ${this.c}`)
    }

    updateButtons(buttons, icons) {
        this.container.clear()

        buttons.forEach((button, i) => {
            const btn = this.#button(button, this.#sector(), RadialNav.#icon(button, icons), this.#hint(button))
            this.updateIcon(button)
            btn.transform(`R${this.angle * i} ${this.c} ${this.c}`)
            this.container.add(btn)
        })
    }

    show(e) {
        this.area
            .attr({
                x: e.clientX - this.c,
                y: e.clientY - this.c

            })

        this.#animateContainer(0, 1, this.animDuration * 8, window.mina.elastic)
        this.area.removeClass('hide')
    }

    hide() {
        this.#animateContainer(1, 0, this.animDuration, window.mina.easeinout, () => {
            this.area.addClass('hide')
        })
    }
}

export default RadialNav;


