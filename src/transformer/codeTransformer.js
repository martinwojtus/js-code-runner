import axios from 'axios';

let defaultPresets = [
    [
        'es2015',
        {
            modules: false
        }
    ],
    'es2016',
    'es2017',
    'stage-0'
];

export default class CodeTransformer {

    constructor(transformersLoader) {
        this.transformersLoader = transformersLoader;
        this.transformers = transformersLoader.getTransformers();
    }

    js(code, transformer) {
        if (transformer === 'js') {
            return Promise.resolve(code);

        } else if (transformer === 'babel' || transformer === 'jsx' /* @deprecated, use "babel" */) {
            return new Promise((resolve, reject) => {
                this.transformersLoader.loadBabel().then(() => {
                    try {
                        let result = window.Babel.transform(code, {
                            presets: [...defaultPresets, 'flow', 'react']
                        }).code;

                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                });
            });

        } else if (transformer === 'typescript') {
            return new Promise((resolve, reject) => {
                this.transformersLoader.loadTypescript().then(() => {
                    const res = window.typescript.transpileModule(code, {
                        fileName: '/foo.ts',
                        reportDiagnostics: true,
                        compilerOptions: {
                            module: 'es2015'
                        }
                    });
                    resolve(res.outputText);
                });
            });

        } else if (transformer === 'vue-jsx') {
            return new Promise((resolve, reject) => {
                this.transformersLoader.loadBabel().then(() => {
                        resolve(window.Babel.transform(code, {
                            presets: [...defaultPresets, 'flow', this.transformers.get('VuePreset')]
                        }).code.replace(
                            /import [^\s]+ from ['"]babel-helper-vue-jsx-merge-props['"];?/,
                            this.transformers.get('VueJSXMergeProps')));
                    }
                )
            });
        } else if (transformer === 'svelte') {
            return new Promise((resolve, reject) => {
                this.transformersLoader.loadSvelte().then(() =>
                    resolve(this.transformers.get('svelte').compile(code, {
                        format: 'es'
                    }).code.replace(
                        /^export default SvelteComponent;/m,
                        'new SvelteComponent({target: document.body})'
                    )))
            });

        } else if (transformer === 'reason') {
            return new Promise((resolve, reject) => {
                this.transformersLoader.loadReason().then(() => {
                    const wrapInExports = code =>
                        `;(function(exports) {\n${code}\n})(window.exports = {})`;

                    try {
                        const ocamlCode = window.printML(window.parseRE(code));
                        const res = JSON.parse(window.ocaml.compile(ocamlCode));
                        if (res.js_error_msg) return res.js_error_msg;
                        resolve(wrapInExports(res.js_code));
                    } catch (err) {
                        console.error(err);
                        reject(`${err.message}${
                            err.location ? `\n${JSON.stringify(err.location, null, 2)}` : ''
                            }`);
                    }
                });
            });
        } else if (transformer === 'coffeescript-2') {
            return new Promise((resolve, reject) => {
                this.transformersLoader.loadCoffeeScript2().then(() => {
                    const esCode = window.CoffeeScript.compile(code);
                    resolve(window.Babel.transform(esCode, {
                        presets: [...defaultPresets, 'react']
                    }).code);
                });
            });
        } else if (transformer === 'rust') {
            return new Promise((resolve, reject) => {

                axios.post('https://play.rust-lang.org/evaluate.json', {
                    code,
                    optimize: '0',
                    version: 'beta'
                }).then(result => {
                    const data = result.data;
                    const output = data.result;

                    resolve(`console.log(${JSON.stringify(output.trim())})`);
                }).catch(error => reject(error));
                // if (data.error) {
                //     return data.error.trim()
                // }
                // resolve(`console.log(${JSON.stringify(data.result.trim())})`
            });
        }

        throw new Error(`Unknow transformer: ${transformer}`)
    }


    html(code, transformer) {
        if (transformer === 'html') {
            return Promise.resolve(code);
        } else if (transformer === 'pug') {
            return new Promise((resolve, reject) => {
                this.transformersLoader.loadPug().then(() => {
                    try {
                        resolve(window.pug.render(code));
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        } else if (transformer === 'markdown') {
            return Promise.resolve(this.transformers.get('markdown')(code));
        }
        throw new Error(`Unknow transformer: ${transformer}`)
    }


    css(code, transformer) {
        switch (transformer) {
            case 'css':
                return Promise.resolve(code);
            case 'cssnext':
                return new Promise((resolve, reject) => {
                    this.transformersLoader.loadCssnext().then(() => {
                        try {
                            resolve(window
                                .postcss([window.cssnext])
                                .process(code)
                                .then(res => res.css));
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            case 'less':
                return new Promise((resolve, reject) => {
                    this.transformersLoader.loadLess().then(() => {
                        try {
                            resolve(this.transformers
                                .get('less')
                                .render(code)
                                .then(res => res.css));
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            case 'scss':
            case 'sass':
                return new Promise((resolve, reject) => {
                    this.transformersLoader.loadSass().then(() => {
                        this.transformers.get('sass').compile(code, {
                            indentedSyntax: transformer === 'sass'
                        }, result => {
                            if (result.status === 0) return resolve(result.text);
                            reject(new Error(result.formatted));
                        })
                    });
                });
            case 'stylus':
                return new Promise((resolve, reject) => {
                    this.transformersLoader.loadStylus().then(() => {
                        window.stylus.render(code, {filename: 'codepan.styl'}, (err, css) => {
                            if (err) return reject(err);
                            resolve(css);
                        });
                    });
                });
            default:
                throw new Error(`Unknown transformer: ${transformer}`)
        }
    }
}