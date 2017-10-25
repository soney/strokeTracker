(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPointerPosition(position, orientation) {
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
    init: function () {
        this.controller = this.el.querySelector("#rightTouch");
        this.listening = false;
        this.controller.addEventListener('triggerdown', (event) => {
            this.listening = true;
        });
        this.controller.addEventListener('triggerup', (event) => {
            this.listening = false;
        });
    }, tick: function () {
        if (this.listening) {
            const { x, y, z } = this.controller.getAttribute('position');
            console.log(x);
        }
    }
});

},{}]},{},[1]);
