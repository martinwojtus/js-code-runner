import {$addClassIfNotExists, $findById, $on, $qs, $removeClassIfExists} from "../utils/domHelper";


export default class ButtonsManager {

    constructor(id) {
        this.id = id;

        this.close = () => null;
        this.increase = () => null;
        this.decrease = () => null;
        this.openConsole = () => null;
    }

    init() {
        this.buttonsPanelEl = $qs('.jcr-output-buttons', $findById(`jcr-${this.id}`));

        this.openConsoleButtonEl = $qs('.jcr-open-output-terminal', this.buttonsPanelEl);
        this.increateButtonEl = $qs('.jcr-increase-output-height', this.buttonsPanelEl);
        this.decreaseButtonEl = $qs('.jcr-descrease-output-height', this.buttonsPanelEl);
        this.closeButtonEl = $qs('.jcr-close-output', this.buttonsPanelEl);

        $on(this.openConsoleButtonEl , 'click', () => this.openConsole());
        $on(this.increateButtonEl , 'click', () => this.increase());
        $on(this.decreaseButtonEl , 'click', () => this.decrease());
        $on(this.closeButtonEl , 'click', () => this.close());

        this.hideAll();
    }

    showPanel() {
        $removeClassIfExists(this.buttonsPanelEl, "hidden");
    }

    hidePanel() {
        $addClassIfNotExists(this.buttonsPanelEl, "hidden");
    }

    hideAll() {
        $addClassIfNotExists(this.openConsoleButtonEl, "hidden");
        $addClassIfNotExists(this.increateButtonEl, "hidden");
        $addClassIfNotExists(this.decreaseButtonEl, "hidden");
        $addClassIfNotExists(this.closeButtonEl, "hidden");
    }

    showConsoleButton() {
        $removeClassIfExists(this.openConsoleButtonEl, "hidden");
    }

    showIncreaseButton() {
        $removeClassIfExists(this.increateButtonEl, "hidden");
    }

    showDecreaseButton() {
        $removeClassIfExists(this.decreaseButtonEl, "hidden");
    }

    showCloseButton() {
        $removeClassIfExists(this.closeButtonEl, "hidden");
    }


    hideConsoleButton() {
        $addClassIfNotExists(this.openConsoleButtonEl, "hidden");
    }

    hideIncreaseButton() {
        $addClassIfNotExists(this.increateButtonEl, "hidden");
    }

    hideDecreaseButton() {
        $addClassIfNotExists(this.decreaseButtonEl, "hidden");
    }

    hideCloseButton() {
        $addClassIfNotExists(this.closeButtonEl, "hidden");
    }
}