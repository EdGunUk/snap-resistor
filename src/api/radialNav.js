 class RadialNav {
    #size = 500;

    constructor(paper, buttons) {
        this.area = paper
            .svg(0, 0, this.#size, this.#size)
            .addClass('radialNav');
        this.c = this.#size / 2;
        this.r = this.#size * .25;
        this.r2 = this.#size * .35;
        this.angle = 360 / buttons.length;

        this.container = this.area.g()
        this.updateButtons(buttons)
    }

    #sector() {
        this.area
            .path
            .addClass('radialNav-sector')
    }

    updateButtons(buttons) {
        this.container.clear()
    }
}

export default RadialNav;


