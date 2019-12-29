import CodeType, {CODE_TYPE} from "./codeType";


export default class ClassToScript {

    static getCodeType(classes) {
        let type = new CodeType();

        if (classes != null) {
            classes.forEach(cls => {
                    let str = cls.toLowerCase();

                    if (str.includes("html") || str.includes("xhtml")) {
                        type = new CodeType(str, CODE_TYPE.HTML, "html");

                    } else if (str.includes("vue-jsx")) {
                        type = new CodeType(str, CODE_TYPE.JS, "vue-jsx");

                    } else if (str.includes("svelte")) {
                        type = new CodeType(str, CODE_TYPE.JS, "svelte");

                    } else if (str.includes("markup") || str.includes("markdown")) {
                        type = new CodeType(str, CODE_TYPE.HTML, "html");

                    } else if (str.includes("pug")) {
                        type = new CodeType(str, CODE_TYPE.HTML, "pug");

                    } else if (str.includes("javascript") || str.includes("jsx") || str.includes("babel") || str.includes("js")) {
                        type = new CodeType(str, CODE_TYPE.JS, "babel");

                    } else if (str.includes("typescript")) {
                        type = new CodeType(str, CODE_TYPE.JS, "typescript");

                    } else if (str.includes("reason")) {
                        type = new CodeType(str, CODE_TYPE.JS, "reason");

                    } else if (str.includes("coffeescript-2") || str.includes("coffeescript") || str.includes("coffee")) {
                        type = new CodeType(str, CODE_TYPE.JS, "coffeescript-2");

                    } else if (str.includes("rust")) {
                        type = new CodeType(str, CODE_TYPE.JS, "rust");

                    } else if (str.includes("css")) {
                        type = new CodeType(str, CODE_TYPE.CSS, "css");

                    } else if (str.includes("less")) {
                        type = new CodeType(str, CODE_TYPE.CSS, "less");

                    } else if (str.includes("scss") || str.includes("sass")) {
                        type = new CodeType(str, CODE_TYPE.CSS, "sass");

                    } else if (str.includes("stylus")) {
                        type = new CodeType(str, CODE_TYPE.CSS, "stylus");
                    }
                }
            );
        }

        return type;
    }

}