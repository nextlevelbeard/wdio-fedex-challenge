import Component from "./Component";

import logger from "@wdio/logger";

export default class Page extends Component {
	constructor(selector = ":root") {
		super(selector);
	}

	get url() {
		const url = new URL(browser.config.baseUrl);
		url.pathname = this.path;
		return url.href;
	}

	open() {
		browser.url(this.url);
	}

}
Page.log = logger(Page.name);
logger.setLevel(Page.name, "info");
