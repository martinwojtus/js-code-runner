import {Spinner} from 'spin.js';
import {$findById} from "../utils/domHelper";

const opts = {
    lines: 20, // The number of lines to draw
    length: 39, // The length of each line
    width: 8, // The line thickness
    radius: 35, // The radius of the inner circle
    scale: 0.85, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#7e7e7e', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-default', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    position: 'absolute' // Element positioning
};

export default class SpinnerManager {

    constructor(id) {
        this.id = id;
        this.spinner = new Spinner(opts);
    }

    init() {
        this.el = $findById(`jcr-${this.id}`);
    }

    start() {
        this.spinner.spin();
        this.el.appendChild(this.spinner.el);
    }

    stop() {
        this.spinner.stop();
    }
}