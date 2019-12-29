
export const CODE_TYPE = {
    "CSS": "CSS Styles",
    "JS": "JavaScript",
    "HTML": "HTML Code",
    "RESOURCES": "Resources"
};

export default class CodeType {

    constructor(cls = null, type = null, transformer = null) {
        this.cls = cls;
        this.type = type;
        this.transformer = transformer;
    }

    getType() {
        return this.type;
    }

    getTransformer() {
        return this.transformer;
    }
}