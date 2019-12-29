import {$findById, $qs} from "../utils/domHelper";
import TabElement from "./tabElement";

export default class TabsManager {

    constructor(id) {
        this.id = id;
        this.tabs = [];
        this.tabsEl = $qs('.jcr-tabs', $findById(`jcr-${this.id}`));
        this.tabsContentEl = $qs('.jcr-tabs-content', $findById(`jcr-${this.id}`));
    }

    addTab(code) {
        let tab = new TabElement(this.id, code);
        tab.onclick = () => {
            this.allNotActive();
            tab.setActive();
        };

        this.tabs.push(tab);
    }

    init() {
        this.tabs.forEach(tab => tab.init());
        if (this.tabs.length > 0) {
            this.tabs[0].setActive();
        }
    }

    allNotActive() {
        this.tabs.forEach(tab => tab.setNotActive());
    }
}