import {$addClassIfNotExists, $findById, $qs, $removeClassIfExists} from "../utils/domHelper";
import IframeOutput from "./iframeOutput";

const sandboxAttributes = [
    'allow-modals',
    'allow-forms',
    'allow-pointer-lock',
    'allow-popups',
    'allow-same-origin',
    'allow-scripts'
];

const STEP = 100;

export default class PreviewOutput {

    constructor(id, height) {
        this.id = id;
        this.iframe = new IframeOutput();
        this.height = height ? parseInt(height) : 400;
        this.clearBeforeRunFlag = true;
    }

    init() {
        this.iframe.render($qs('iframe', $findById(`jcr-${this.id}`)), sandboxAttributes);
        this.tilda = $qs('.jcr-output-iframe', $findById(`jcr-${this.id}`));
    }

    setOutput(obj) {
        this.iframe.setHTML(obj);
    }

    runScript(script) {
        return this.iframe.runScript(script);
    }

    getHeight() {
        return this.height;
    }

    resetHeight() {
        this.height = 400;
    }

    increaseHeight() {
        if ((this.height + STEP) > 800) {
            return;
        }

        this.height = this.height + STEP;
        this.refreshHeight();
    }

    decreaseHeight() {
        if ((this.height - STEP) < 400) {
            return;
        }

        this.height = this.height - STEP;
        this.refreshHeight();
    }

    refreshHeight() {
        this.tilda.style.height = this.height + 'px';
    }

    show() {
        $removeClassIfExists(this.tilda, "hidden");
    }

    hide() {
        $addClassIfNotExists(this.tilda, "hidden");
    }
}