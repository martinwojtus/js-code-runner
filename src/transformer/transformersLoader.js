import loadjs from 'loadjs';
import pify from 'pify'
import Transformers from "./transformers";

export default class TransformersLoader {

    constructor(options) {
        this.transformers = new Transformers();
        this.transformers.set('rust', true);
        this.vendor = options.vendor;
        this.cdns = options.cdns;
    }

    getTransformers() {
        return this.transformers;
    }

    asyncLoad(resources, name) {
        return new Promise((resolve, reject) => {
            if (loadjs.isDefined(name)) {
                resolve();
            } else {
                loadjs(resources, name, {
                    success() {
                        resolve();
                    },
                    error() {
                        reject(new Error('network error'));
                    }
                });
            }
        })
    }

    loadBabel() {
        if (loadjs.isDefined('babel')) return Promise.resolve();

        return new Promise((resolve, reject) => {
            Promise.all([
                this.asyncLoad(this.cdns.BABEL_CDN, 'babel'),
                import(/* webpackChunkName: "babel-present-2" */ 'babel-preset-vue/dist/babel-preset-vue'), // use umd bundle since we don't want to parse `require`
                import(/* webpackChunkName: "vue-jsx-merge-props" */ '!raw-loader!./vueJsxMergeProps')
            ]).then(vals => {
                this.transformers.set('VuePreset', vals[1]);
                this.transformers.set('VueJSXMergeProps', vals[2]);

                resolve();
            });
        });
    }

    loadPug() {
        if (loadjs.isDefined('pug')) return Promise.resolve();

        return new Promise((resolve, reject) => {
            Promise.all([
                this.asyncLoad(this.cdns.PUG_CDN, 'pug')
            ]).then(vals => {
                resolve();
            });
        });
    }

    loadSvelte() {
        if (!this.transformers.get('svelte')) {

            return new Promise((resolve, reject) => {
                Promise.all([import('svelte')]).then(vals => {
                    this.transformers.set('svelte', vals[0]);
                    resolve();
                });
            });
        }

        return Promise.resolve();
    }

    loadReason() {
        if (loadjs.isDefined('reason')) return Promise.resolve();

        return new Promise((resolve, reject) => {
            this.asyncLoad([this.vendor.REASON_BS_JS, this.vendor.REASON_REFMT_JS], 'reason').then(() => {
                resolve();
            });
        });
    }

    loadCoffeeScript2() {
        if (loadjs.isDefined('coffeescript-2')) return Promise.resolve();

        return new Promise((resolve, reject) => {
            Promise.all([
                this.asyncLoad(
                    [
                        this.vendor.COFFEESCRIPT_2_JS,
                        // Need babel to transform JSX
                        this.cdns.BABEL_CDN
                    ],
                    'coffeescript-2'
                )])
                .then(vals => {
                    resolve();
                });
        });
    }

    loadCssnext() {
        if (loadjs.isDefined('cssnext')) return Promise.resolve();

        return new Promise((resolve, reject) => {
            this.asyncLoad([this.cdns.CSSNEXT_CDN, this.cdns.POSTCSS_CDN], 'cssnext').then(() => {
                resolve();
            })
        });
    }

    loadLess() {
        if (!this.transformers.get('less')) {
            const less = import('less');
            this.transformers.set('less', pify(less));
        }

        return Promise.resolve();
    }

    loadSass() {
        if (!this.transformers.get('sass')) {
            return new Promise((resolve, reject) => {
                Promise.all([
                    import(/* webpackChunkName: "sass" */ '../../vendor/sass/sass')
                ]).then(vals => {
                    try {
                        let Sass = vals[0];

                        console.log(this.vendor.SASS_WORKER_JS);

                        Sass.setWorkerUrl(this.vendor.SASS_WORKER_JS);
                        this.transformers.set('sass', new Sass());
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }

        return Promise.resolve();
    }

    loadTypescript() {
        if (loadjs.isDefined('typescript')) return Promise.resolve();

        return new Promise((resolve, reject) => {
            return this.asyncLoad([this.cdns.TYPESCRIPT_CDN], 'typescript').then(() => {
                resolve();
            })
        });
    }

    loadStylus() {
        if (loadjs.isDefined('stylus')) return Promise.resolve();

        return new Promise((resolve, reject) => {
            this.asyncLoad(this.vendor.STYLUS_JS, 'stylus').then(() => {
                resolve();
            })
        });
    }
}