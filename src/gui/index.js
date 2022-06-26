import Snap from "snapsvg-cjs";

const polarToCartesian = function (cx, cy, r, angle) {
    const a = (angle - 90) * Math.PI / 180;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);

    return {x, y}
}

const describeArc = function (x, y, r, startAngle, endAngle) {
    const start = polarToCartesian(x, y ,r, startAngle % 360  );
    const end = polarToCartesian(x, y, r, endAngle % 360);
}


class GUI {
    constructor(buttons) {
        this.paper = Snap(window.innerWidth, window.innerHeight)
        this.nav = new RadialNav(this.paper, buttons)
        this.#bindEvents()
    }

    #bindEvents() {
        window.addEventListener('resize', () => {
            this.paper.attr({
                width: window.innerHeight,
                height: window.innerHeight
            })
        })
    }
}

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

        this.container = this.area.g
        this.updateButtons(buttons)
    }

    #sector() {
        this.area
            .path
            .addClass('radialNav-sector')
    }

    updateButtons() {
        this.container.clear
    }
}

const gui = new GUI([
    {
        icon: 'pin',
        action() {
            console.log('Pinning...')
        }
    },
    {
        icon: 'search',
        action() {
            console.log('Opening Search...')
        }
    },
    {
        icon: 'cloud',
        action() {
            console.log('Connecting to Cloud...')
        }
    },
    {
        icon: 'settings',
        action() {
            console.log('Opening Settings...')
        }
    },
    {
        icon: 'rewind',
        action() {
            console.log('Rewinding...')
        }
    },
    {
        icon: 'preview',
        action() {
            console.log('Preview Activated')
        }
    },
    {
        icon: 'delete',
        action() {
            console.log('Deleting...')
        }
    }
])
