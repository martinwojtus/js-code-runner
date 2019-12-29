import snippetRunPanelTmpl from "../templates/snippetRunPanelTmpl";
import {$findById, $newElement, $on, $qs} from "../utils/domHelper";
import JsConsole from "../output/jsConsole";
import {CODE_TYPE} from "../utils/codeType";
import PreviewOutput from "../output/previewOutput";
import proxyConsole from '!raw-loader!../output/proxyConsole';
import TabsManager from "../tabs/tabsManager";
import ButtonsManager from "../buttons/buttonsManager";
import Resources from "./resources";

const replaceQuote = str => str.replace(/__QUOTE_LEFT__/g, '<');
const createElement = tag => (content = '', attrs = {}) => {
    attrs = Object.keys(attrs)
        .map(key => {
            return `${key}="${attrs[key]}"`;
        })
        .join(' ');
    return replaceQuote(`__QUOTE_LEFT__${tag} ${attrs}>${content}__QUOTE_LEFT__/${tag}>`);
};

export default class Snippet {

    constructor(el) {
        this.el = el;
        this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.codes = [];

        this.outputPreview = new PreviewOutput(this.id);

        this.tabsManager = new TabsManager(this.id);
        this.jsConsole = new JsConsole(this.id);
        this.jsConsole.onenter = (script) => this.outputPreview.runScript(script);

        this.buttonsManager = new ButtonsManager(this.id);
        this.buttonsManager.close = () => {
            this.outputPreview.hide();
            this.jsConsole.close();
            this.buttonsManager.hidePanel();
        };

        this.buttonsManager.increase = () => this.outputPreview.increaseHeight();
        this.buttonsManager.decrease = () => this.outputPreview.decreaseHeight();
        this.buttonsManager.openConsole = () => {
            this.buttonsManager.hideConsoleButton();
            this.jsConsole.open();
        };

        this.jsConsole.onclose = () => {
            this.buttonsManager.showConsoleButton();
        };

        window[`jsCodeRunnerResultMessage${this.id}`] = (msg) => this.snippetPostResultMessage(msg);
    }

    addCode(code) {
        this.codes.push(code);
        this.tabsManager.addTab(code);
    }

    addResources() {
        let cssList = this.getCssList();
        let jsList = this.getJsList();

        if (cssList.length !== 0 || jsList.length !== 0) {
            this.tabsManager.addTab(new Resources(this.el, cssList, jsList));
        }
    }

    getJsList() {
        return this.el.dataset.css ? JSON.parse(this.el.dataset.js.replace(/'/g, '"')) : [];
    }

    getCssList() {
        return this.el.dataset.css ? JSON.parse(this.el.dataset.css.replace(/'/g, '"')) : [];
    }

    init() {
        let div = $newElement('DIV');
        div.innerHTML = snippetRunPanelTmpl({'id': this.id});
        this.el.appendChild(div);

        $on($qs('.jcr-run-button', $findById(`jcr-${this.id}`)), 'click', ({target}) => this.run());

        this.jsConsole.init();
        this.outputPreview.init();
        this.tabsManager.init();
        this.buttonsManager.init();
    }

    run() {
        let js = this.codes.filter(code => code.getCodeType().getType() === CODE_TYPE.JS)
            .map(code => code.getCode());

        let css = this.codes.filter(code => code.getCodeType().getType() === CODE_TYPE.CSS)
            .map(code => code.getCode());

        let html = this.codes.filter(code => code.getCodeType().getType() === CODE_TYPE.HTML)
            .map(code => code.getCode());

        try {
            Promise.all([
                Promise.all(js),
                Promise.all(css),
                Promise.all(html)])
                .then(vals => {
                    this.prepareOutput(vals[0], vals[1], vals[2], this.getJsList(), this.getCssList());
                })
                .catch(e => {
                    console.error(e.message);
                    this.jsConsole.error(e.frame ? e.message + '\n' + e.frame : e.stack);
                });
        } catch (err) {
            console.error(err);
            this.jsConsole.error(err.message.trim());
        }
    }

    prepareOutput(jsList, cssList, htmlList, jsScripts, cssLibraries) {
        this.buttonsManager.showPanel();
        this.jsConsole.clearBeforeRun();

        let js = jsList.join("\n");
        let html = htmlList.join("\n");
        let css = cssList.join("\n");

        js = js.replace(/<\/script>/, '<\\/script>');
        js = `
           window.parent.jsCodeRunnerResultMessage${this.id}({ type: 'iframe-success' }, '*');
            try {
              ${js}
            } catch (err) {
              window.parent.jsCodeRunnerResultMessage${this.id}(
                {
                  type: 'iframe-error',
                  message: err.message,
                  stack: err.frame ? err.message + '\\n' + err.frame : err.stack
                },
                '*'
              )
            }
          `;

        const headStyle = createElement('style')(css);// +
        cssLibraries
            .map(cssLib =>
                createElement('link')('', {
                    href: cssLib,
                    rel: 'stylesheet'
                })
            )
            .join('\n');

        const codePanRuntime = createElement('script')(`window.snippetId = '${this.id}';`) +
            createElement('script')(`window.process = window.process || { env: { NODE_ENV: 'development' } }`) +
            jsScripts
                .map(script =>
                    createElement('script')('', {
                        src: script
                    })
                )
                .join('\n') +
            createElement('script')(proxyConsole);

        const head = headStyle + codePanRuntime;
        const body = html + createElement('script')(js);

        this.outputPreview.setOutput({head, body});
        this.showPanels(js, html);
    }

    showPanels(js, html) {
        if (html) {
            this.outputPreview.show();

            this.buttonsManager.showCloseButton();
            this.buttonsManager.showIncreaseButton();
            this.buttonsManager.showDecreaseButton();
        }

        if (js.indexOf('console.') !== -1) {
            this.jsConsole.open();
            this.buttonsManager.hideConsoleButton();
        } else {
            this.buttonsManager.showConsoleButton();
        }
    }

    snippetPostResultMessage({type, message, method, args}) {
        if (type === 'iframe-error' || type === 'error') {
            this.jsConsole.error(message.trim());

        } else if (type === 'codepan-console') {
            if (method === 'clear') {
                this.jsConsole.clearBeforeRun();
            } else {
                if (method === 'error') {
                    this.jsConsole.error(args);
                } else {
                    this.jsConsole.info(args);
                }
            }
        }
    }
}