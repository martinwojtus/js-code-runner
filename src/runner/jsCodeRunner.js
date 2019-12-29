import Code from '../snippet/code';
import Snippet from '../snippet/snippet';
import TransformersLoader from "../transformer/transformersLoader";
import CodeTransformer from "../transformer/codeTransformer";

const defaults = {
    container: '.js-code-runner',
    cdns: {
        BABEL_CDN: 'https://cdn.jsdelivr.net/npm/@babel/standalone@7.0.0-beta.32/babel.min.js',
        PUG_CDN: 'https://cdn.jsdelivr.net/npm/browserified-pug@0.3.0/index.js',
        CSSNEXT_CDN: 'https://cdn.jsdelivr.net/npm/browserified-postcss-cssnext@0.3.0/index.js',
        POSTCSS_CDN: 'https://cdn.jsdelivr.net/npm/browserified-postcss@0.3.0/index.js',
        TYPESCRIPT_CDN: 'https://cdn.jsdelivr.net/npm/browserified-typescript@0.3.0/index.js'
    },
    vendor: {
        SASS_WORKER_JS: '/js-code-runner/vendor/sass/sass.worker.js',
        COFFEESCRIPT_2_JS: '/js-code-runner/vendor/coffeescript-2.js',
        STYLUS_JS: '/js-code-runner/vendor/stylus.js',
        REASON_BS_JS: '/js-code-runner/vendor/reason/bs.js',
        REASON_REFMT_JS: '/js-code-runner/vendor/reason/refmt.js'
    }
};

export default class JsCodeRunner {

    constructor(options) {
        this.options = options || {};

        for (let i in defaults) {
            if (this.options[i] == null) {
                this.options[i] = defaults[i];
            }
        }

        this.snippets = [];

        this.transformersLoader = new TransformersLoader(this.options);
        this.codeTransformer = new CodeTransformer(this.transformersLoader);

        this.init();
    }

    init() {
        let containers = document.querySelectorAll(this.options.container);

        if (containers) {
            containers.forEach(container => {
                let snippet = new Snippet(container);
                let codeElements = container.querySelectorAll('code');

                if (codeElements) {
                    codeElements.forEach(codeElement => {
                        let code = new Code(codeElement, this.codeTransformer);
                        snippet.addCode(code);
                    });
                    snippet.addResources();
                }

                snippet.init();

                this.snippets.push(snippet);
            });
        }
    }
}
