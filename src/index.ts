import * as AFRAME from 'aframe';
import registerBrush from './brushes'
import brush from './brush';
import paintControls from './paint-controls';
import lineBrush from './linebrush'
import {LinkedList} from 'typescript-collections';

AFRAME.registerBrush = registerBrush;
AFRAME.registerComponent('brush', brush);
AFRAME.registerComponent('paint-controls', paintControls);
AFRAME.registerBrush('flat', Object.assign({}, lineBrush, {materialOptions: {type: 'flat'}}), {maxPoints: 3000});

// declare var AFRAME:any;
declare var THREE:any;

// function getPointerPosition(position:any, orientation:any) {
//     const pointerPosition = new THREE.Vector3();
//     const offsets = {
//         vec: new THREE.Vector3(0, 0, 2.8),
//         mult: -0.05
//     };
//
//     var pointer = offsets.vec.clone().applyQuaternion(orientation)
//                             .normalize()
//                             .multiplyScalar(offsets.mult);
//     pointerPosition.copy(position).add(pointer);
//     return pointerPosition;
// }
//
const SVMIN:number = 0.1;
const SVMAX:number = 0.8;
const SVDIFF = SVMAX-SVMIN;
const DIFFMIN:number = 0;
const DIFFMAX:number = 0.001;
const DIFFDIFF:number = DIFFMAX-DIFFMIN;
const DISPLAYVELOCITY = true;
const motions = [];


AFRAME.registerComponent('stroke-controls', {
    init: function() {
        // this.controller = this.el.querySelector("#rightTouch");
        this.listening = false;
        this.currentMotion = new LinkedList<any>();

        let colorIndex=0;
        const colors = ['#FFCB05', '#BA5827', '#878A8F']
        this.el.addEventListener('triggerdown', (event:any) => {
            this.startListening();
        });
        this.el.addEventListener('triggerup', (event:any) => {
            const motion = this.stopListening();
            if(motions[colorIndex]) {
                motions[colorIndex].push(motion);
            } else {
                motions[colorIndex] = [motion];
            }
            const data = JSON.stringify(motions);
            console.log(data);
        });
        // this.el.addEventListener('triggerchanged', (event:any) => {
            // this.el.emit('paint', { value: event.detail.value });
        // });
        this.el.addEventListener('abuttondown', (event:any) => {
            colorIndex = (colorIndex+1)%colors.length;
            const color = new THREE.Color(colors[colorIndex]);
            this.el.setAttribute('brush', 'color', color);
            // this.data.color = color;
            // this.el.setAttribute('color', color);
            // this.el.emit('brushcolor-changed', {color});
            // this.el.emit('brushsize-changed', {brushSize: data.size});
        });
    },
    tick: function() {
        if(this.listening) {
            const position = this.el.getAttribute('position');
            this.currentMotion.add(position);
            if(DISPLAYVELOCITY) {
                const {x,y,z} = position;
                if(this.lastX&&this.lastY&&this.lastZ) {
                    const diffMag = Math.pow(x-this.lastX,2) + Math.pow(y-this.lastY,2) + Math.pow(z-this.lastZ,2)
                    const scaledVelocity = Math.min(SVMAX, SVMIN+SVDIFF*(diffMag-DIFFMIN)/DIFFDIFF)
                    this.el.emit('paint', { value: scaledVelocity })
                }
                this.lastX=x;
                this.lastY=y;
                this.lastZ=z;
            }
        }
    },
    startListening: function() {
        this.currentMotion.clear();
        this.lastX = this.lastY = this.lastZ = null;
        this.listening = true;
        this.el.emit('paint', { value: 0.2 });
    },
    stopListening: function():Array<any> {
        this.listening = false;
        this.el.emit('paint', { value: 0.0 });
        const motion = this.currentMotion.toArray().map((pos) => {
            const {x,y,z} = pos;
            return {x,y,z}
        });
        this.currentMotion.clear();
        return motion;
    },
});
