import {useCallback} from "react";
import Snap from "snapsvg-cjs";

function App() {
    const snapRef = useCallback(node => {
        if (node !== null) {
            const paper = Snap(node);

            const style = {
                fill: '#318199',
                stroke: '#444',
                strokeWidth: 4
            }

            const circle = paper
                .circle(200, 200, 60)
                .attr(style)

            const rect = paper
                .rect(300, 150, 100, 100)
                .attr(style)

            const group = paper
                .g(circle, rect)
                .attr({opacity: .5, strokeOpacity: .5})
                .drag(function (dx) {
                    this.transform(`r${dx}, 350 200`)
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
