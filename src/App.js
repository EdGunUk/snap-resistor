import {useCallback} from "react";
import * as utils from "./utils/svg";
import Gui from "./api/gui";

function App() {
    const snapRef = useCallback(node => {
        if (node !== null) {
            const gui = new Gui(node,[
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

            gui.paper
                .path(utils.describeArc(250, 200, 120, 0, 45))
                .attr({
                    fill: 'transparent',
                    stroke: '#fff',
                    strokeWidth: 4
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
