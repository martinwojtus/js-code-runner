import {$classes} from "../utils/domHelper";
import ClassToScript from "../utils/classToScript";
import {CODE_TYPE} from "../utils/codeType";

export default class Code {

    constructor(el, codeTransformer) {
        this.el = el;
        this.codeTransformer = codeTransformer;
        this.script = el ? el.innerText : '';
        this.classes = $classes(this.el);
        this.type = ClassToScript.getCodeType(this.classes);
    }

    getCodeType() {
        return this.type;
    }

    getCode() {
        switch (this.type.getType()) {
            case CODE_TYPE.HTML: return this.codeTransformer.html(this.script, this.type.getTransformer());
            case CODE_TYPE.JS: return this.codeTransformer.js(this.script, this.type.getTransformer());
            case CODE_TYPE.CSS: return this.codeTransformer.css(this.script, this.type.getTransformer());
        }

        return Promise.resolve("");
    }

    getElement() {
        return this.el;
    }
}