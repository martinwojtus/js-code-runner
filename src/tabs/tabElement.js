import {
    $addClassIfNotExists,
    $elementFromString,
    $findById,
    $hasClass,
    $on,
    $qs,
    $removeClassIfExists
} from "../utils/domHelper";
import tabTmpl from "../templates/tabTmpl";
import tabContentTmpl from "../templates/tabContentTmpl";
import {CODE_TYPE} from "../utils/codeType";

export default class TabElement {

    constructor(id, code) {
        this.id = id;
        this.code = code;

        this.tabId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.tabEl = null;
        this.tabContentEl = null;

        this.onclick = () => null;
    }

    setActive() {
        $addClassIfNotExists(this.tabEl, "active");
        $addClassIfNotExists(this.tabContentEl, "active");
    }

    setNotActive() {
        $removeClassIfExists(this.tabEl, "active");
        $removeClassIfExists(this.tabContentEl, "active");
    }

    init() {
        this.initTab();
        this.initTabContent();
    }

    getTabTitle() {
        let codeType = this.code.getCodeType();

        if (codeType.getType() === CODE_TYPE.RESOURCES) {
            return CODE_TYPE.RESOURCES;
        }

        let codeEl = this.code.getElement();

        if (codeEl.dataset.jcrFilename) {
            return codeEl.dataset.jcrFilename;
        }

        switch (codeType.getType()) {
            case CODE_TYPE.HTML: return "HTML";
            case CODE_TYPE.JS: return "JavaScript";
            case CODE_TYPE.CSS: return "CSS";
        }

        return "Unknown";
    }

    initTab() {
        let tab = tabTmpl({
            id: this.tabId,
            title: this.getTabTitle()
        });

        let tabsEl = $qs(`.jcr-tabs ul`, $findById(`jcr-${this.id}`));
        tabsEl.appendChild($elementFromString(tab));

        this.tabEl = $qs(`.jcr-tab-${this.tabId}`, $findById(`jcr-${this.id}`));

        $on(this.tabEl, 'click', ({target}) => this.onclick());
    }

    initTabContent() {
        let codeType = this.code.getCodeType();

        let tabContent = tabContentTmpl({
            id: this.tabId,
        });

        let tabsContentEl = $qs(`.jcr-tabs-content`, $findById(`jcr-${this.id}`));
        tabsContentEl.appendChild($elementFromString(tabContent));

        let element = this.code.getElement();
        this.tabContentEl = $qs(`.jcr-tab-content-${this.tabId}`, $findById(`jcr-${this.id}`));

        if (codeType.getType() === CODE_TYPE.RESOURCES) {
            this.tabContentEl.appendChild($elementFromString(element));
        } else {
            let firstParent = element.parentNode;
            if (firstParent == null) {
                this.tabContentEl.appendChild(element);
            } else {
                let secondParent = firstParent.parentNode;

                if (secondParent != null && $hasClass(secondParent, 'jcr-code-container')) {
                    this.tabContentEl.appendChild(secondParent);
                } else {
                    this.tabContentEl.appendChild(firstParent);
                }
            }
        }
    }
}