import logger from "@wdio/logger";
import path from "path";
import got from "got";

const log = logger("Zalenium");

export default class ZaleniumService {
	constructor({ host, port, build } = {}) {
		this.host = host;
		this.port = port;
		this.build = build;
		this.baseUrl = `${host}:${port}`;

		this.INFORMATION = `${this.baseUrl}/dashboard/information`;
		this.STATUS = `${this.baseUrl}/wd/hub/status`;

		log.info(`[CONFIG] ${JSON.stringify(this, null, 4)}`);
	}

	async onPrepare(config) {
		return got(this.STATUS);
	}

	get name() {
		return this._name;
	}

	set name(specFile) {
		!specFile && (this._name = undefined);

		specFile = Array.isArray(specFile) ? specFile.pop() : specFile || "";
		// Get file name
		let name = path.basename(specFile).split(".");
		// Remove extension
		name.length > 1 && name.pop();
		// Grab name
		name = name.length > 1 ? name.join(".") : name.pop();

		log.info(
			`[CONFIG] Set test name to "${name}" from spec file ${specFile}`
		);
		this._name = name;
	}

	beforeSession(config, capabilities, specs) {
		this.name = specs;
		this.build = this.build || undefined;

		if (browser.isMultiremote) {
			Object.keys(capabilities).forEach(
				(browser, cap = capabilities[browser].capabilities) => {
					cap["zal:build"] = this.build;
					cap["zal:name"] = this.name;
					cap["bstack:options"] = cap["bstack:options"] || {};
					cap["bstack:options"].sessionName = this.name;
				}
			);
		} else {
			capabilities["zal:build"] = this.build;
			capabilities["zal:name"] = this.name;
			capabilities["bstack:options"] =
                capabilities["bstack:options"] || {};
			capabilities["bstack:options"].sessionName = this.name;
		}
	}

	after(result) {
		const passed = result === 0;
		const passedCookie = {
			name: "zaleniumTestPassed",
			value: passed ? "true" : "false"
		};
		try {
			browser.addCookie(passedCookie);
		} catch (e) {
			// browser session does not exist? Whatever
		}
	}

	beforeScenario(uri, feature, scenario, sourceLocation) {
		try {
			browser.addCookie({
				name: "zaleniumMessage",
				value: `Test: ${scenario.name}`
			});
		} catch (e) {
			// browser session does not exist? Whatever
		}
	}
}
