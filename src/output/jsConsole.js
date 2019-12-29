import {$addClassIfNotExists, $elementFromString, $findById, $on, $qs, $removeClassIfExists} from "../utils/domHelper";
import jsConsoleOutputRowTmpl from '../templates/jsConsoleOutputRowTmpl';
import jsConsoleOutputRowTmplInput from '../templates/jsConsoleOutputRowTmplInput';
import jsConsoleOutputRowTmplOutput from '../templates/jsConsoleOutputRowTmplOutput';
import jsConsoleOutputRowTmplError from '../templates/jsConsoleOutputRowTmplError';

export default class JsConsole {

    constructor(id) {
        this.id = id;
        this.opened = false;
        this.clearBeforeRunFlag = true;

        this.onclose = () => null;
        this.onenter = (script) => null;
    }

    init() {
        this.tilda = $qs('.jcr-tilda', $findById(`jcr-${this.id}`));

        $on($qs('.jcr-console .jcr-toolbar .jcr-close-btn', this.tilda), 'click', () => this.close());
        $on($qs('.jcr-console .jcr-subtoolbar .jcr-clear-btn', this.tilda), 'click', () => this.clear());
        $on($qs('.jcr-console .jcr-subtoolbar .jcr-clear-console-on-reload', this.tilda), 'click', () => this.toggleClearBeforeRunCheckbox());
        $on($qs('.jcr-console .jcr-console-content .jcr-console-editor input', this.tilda), 'keydown', (e) => this.consoleKeyDown(e));
    }

    toggle() {
        if (this.opened) {
            this.close();
        } else {
            this.open();
        }
    }

    toggleClearBeforeRunCheckbox() {
        this.clearBeforeRunFlag = $qs('.jcr-clear-console-on-reload', this.tilda).checked === true;
    }

    close() {
        if (this.opened) {
            $addClassIfNotExists(this.tilda, 'hidden');
            this.opened = false;
            this.onclose();
        }
    }

    open() {
        if (!this.opened) {
            $removeClassIfExists(this.tilda, 'hidden');
            this.focus();
            this.opened = true;
        }
    }

    focus() {
        $qs('.jcr-console .jcr-console-content .jcr-console-editor input', this.tilda).focus();
    }

    clearBeforeRun() {
        if (this.clearBeforeRunFlag) {
            this.clear();
        }
    }

    clear() {
        $qs('.jcr-console .jcr-console-content .jcr-console-logs', this.tilda).innerHTML = '';
    }

    consoleKeyDown(e) {
        let input = e.target;
        let key = e.which || e.keyCode || 0;
        let result = null;

        if (key === 13) {
            if (!input.value) {
                return;
            }

            try {
                result = this.onenter(input.value);
                //result = window.eval(input.value);

                this.input(input.value);
                this.output(result);
            } catch (e) {
                this.error(e.message);
            }

            input.value = '';
        }
    }

    input(message) {
        let panel = $qs('.jcr-console .jcr-console-content .jcr-console-logs', this.tilda);

        let inner = jsConsoleOutputRowTmplInput({
            content: message,
            className: 'input'
        });

        panel.appendChild($elementFromString(inner));

        panel.parentNode.scrollTo(0, panel.parentNode.scrollHeight);
    }

    output(message) {
        let panel = $qs('.jcr-console .jcr-console-content .jcr-console-logs', this.tilda);

        let inner = jsConsoleOutputRowTmplOutput({
            content: message,
            className: 'output'
        });

        panel.appendChild($elementFromString(inner));

        panel.parentNode.scrollTo(0, panel.parentNode.scrollHeight);
    }

    error(message) {
        let panel = $qs('.jcr-console .jcr-console-content .jcr-console-logs', this.tilda);

        let inner = jsConsoleOutputRowTmplError({
            content: message,
            className: 'error'
        });

        panel.appendChild($elementFromString(inner));

        panel.parentNode.scrollTo(0, panel.parentNode.scrollHeight);
    }

    info(message) {
        let panel = $qs('.jcr-console .jcr-console-content .jcr-console-logs', this.tilda);

        let inner = jsConsoleOutputRowTmpl({
            content: message,
            className: 'info'
        });

        panel.appendChild($elementFromString(inner));

        panel.parentNode.scrollTo(0, panel.parentNode.scrollHeight);
    }
}