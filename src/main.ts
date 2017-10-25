import * as $ from 'jquery';
import * as _ from 'underscore';
declare var AFRAME:any;
declare var THREE:any;

function getPointerPosition(position:any, orientation:any) {
    const pointerPosition = new THREE.Vector3();
    const offsets = {
        vec: new THREE.Vector3(0, 0, 2.8),
        mult: -0.05
    };

    var pointer = offsets.vec.clone().applyQuaternion(orientation)
                            .normalize()
                            .multiplyScalar(offsets.mult);
    pointerPosition.copy(position).add(pointer);
    return pointerPosition;
}


AFRAME.registerComponent('stroke-controls', {
    init: function() {
        this.controller = this.el.querySelector("#rightTouch");
        this.listening = false;

        this.controller.addEventListener('triggerdown', (event:any) => {
            this.listening = true;
        });
        this.controller.addEventListener('triggerup', (event:any) => {
            this.listening = false;
        });
    }, tick: function() {
        if(this.listening) {
            const {x, y, z} = this.controller.getAttribute('position');
            console.log(x);
        }
    }
});
