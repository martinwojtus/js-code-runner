import CodeType, {CODE_TYPE} from "../utils/codeType";
import resourcesTabTmpl from "../templates/resourcesTabTmpl";

export default class Resources {

    constructor(el, cssList = [], jsList = []) {
        this.el = el;
        this.cssList = cssList;
        this.jsList = jsList;
        this.type = new CodeType('', CODE_TYPE.RESOURCES, "resources");
    }

    getCodeType() {
        return this.type;
    }

    getCode() {
        return Promise.resolve("");
    }

    getElement() {
        return resourcesTabTmpl({
            'cssList': this.cssList,
            'jsList': this.jsList
        });
    }
}