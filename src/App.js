import {useCallback} from "react";
import Snap from "snapsvg-cjs";

function App() {
    const snapRef = useCallback(node => {
        if (node !== null) {
            const paper = Snap(node);

            let origTransform = 0;
            const path = paper
                .rect(100, 100, 100, 100)
                .attr({
                    stroke: '#387',
                    fill: 'transparent',
                    strokeWidth: 3
                })
                .drag(function (dx, dy) {
                    const m = Snap.matrix();
                    m.translate(dx, dy);
                    m.add(origTransform);
                    m.rotate(dx, 150, 150);
                    m.scale(.8, .8, 150, 150)

                    this.transform(m);
                }, function () {
                    origTransform = this.transform().localMatrix;
                })

            let previousDx1 = 0;
            let previousDy1 = 0;
            let lastDx1 = 0;
            let lastDy1 = 0;
            let lastScale1 = .8;

            const path1 = paper
                .rect(100, 300, 100, 100)
                .attr({
                    stroke: 'red',
                    fill: 'transparent',
                    strokeWidth: 3
                })
                .drag(function (dx, dy) {
                    const m = Snap.matrix();

                    m.translate(dx + lastDx1, dy + lastDy1);
                    m.rotate(dx + lastDx1, 150, 350);
                    m.scale(lastScale1, lastScale1, 150, 350);

                    previousDx1 = dx;
                    previousDy1 = dy;
                    this.transform(m);
                }, function () {
                }, function () {
                    lastDx1 += previousDx1;
                    lastDy1 += previousDy1;
                    lastScale1 -= lastScale1 / 100 * 20;
                })

            let previousDx2 = 0;
            let previousDy2 = 0;
            let lastDx2 = 0;
            let lastDy2 = 0;
            let lastScale2 = .8;

            const path2 = paper
                .rect(100, 500, 100, 100)
                .attr({
                    stroke: 'blue',
                    fill: 'transparent',
                    strokeWidth: 3,
                })
                .drag(function (dx, dy) {
                    this.transform(`t${dx + lastDx2} ${dy + lastDy2} r${dx + lastDx2} s${lastScale2} ${lastScale2}`);
                    previousDx2 = dx;
                    previousDy2 = dy;
                }, function () {
                }, function () {
                    lastDx2 += previousDx2;
                    lastDy2 += previousDy2;
                    lastScale2 -= lastScale2 / 100 * 20;
                })

            let previousDx3 = 0;
            let previousDy3 = 0;
            let lastDx3 = 0;
            let lastDy3 = 0;
            let lastScale3 = .8;

            const path3 = paper
                .rect(100, 700, 100, 100)
                .attr({
                    stroke: 'orange',
                    fill: 'transparent',
                    strokeWidth: 3,
                    'transform-origin': '150 750'
                })
                .drag(function (dx, dy) {
                    this.transform(`translate(${dx + lastDx3},${dy + lastDy3})  rotate(${dx+ lastDx3}) scale(${lastScale3})`);

                    previousDx3 = dx;
                    previousDy3 = dy;
                }, function () {
                }, function () {
                    lastDx3 += previousDx3;
                    lastDy3 += previousDy3;
                    lastScale3 -= lastScale3 / 100 * 20;
                })


            let previousDx4 = 0;
            let previousDy4 = 0;
            let lastDx4 = 0;
            let lastDy4 = 0;
            let lastScale4 = .8;

            const path4 = paper
                .rect(100, 900, 100, 100)
                .attr({
                    stroke: 'pink',
                    fill: 'transparent',
                    'stroke-width': 3,
                    'transform-origin': '150 950'
                })
                .drag(function (dx, dy) {

                    this.attr({
                        transform: `translate(${dx + lastDx4},${dy + lastDy4})  rotate(${dx+ lastDx4}) scale(${lastScale4})`
                    })
                    previousDx4 = dx;
                    previousDy4 = dy;
                }, function () {
                }, function () {
                    lastDx4 += previousDx4;
                    lastDy4 += previousDy4;
                    lastScale4 -= lastScale4 / 100 * 20;
                })

        }
    }, []);

    return (
        <div>
            <svg width="100vw" height="100vh" ref={snapRef}></svg>
        </div>
    );
}

export default App;
