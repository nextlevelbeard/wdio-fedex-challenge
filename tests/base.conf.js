require("@babel/register");

const fs = require("fs-extra");
const path = require("path");
const argv = require("yargs").argv;

const { setAllureCustomLogo, buildScreenshotFilename } = require("./e2e/utils/helpers");
const setCommands = require("./e2e/utils/commands").default;

const _ASSETS = path.resolve("assets");
const RUN_PATH = path.join(process.cwd(), ".run");
const _PATHS = {
	_LOGS: "logs",
	_SHOTS: "shots",
	_RESULTS: "results",
	_RESULTS_ALLURE: "results/allure",
	_RESULTS_JSON: "results/json",
	_REPORTS: "reports",
	_REPORTS_ALLURE: "reports/allure",
	_REPORTS_CUCUMBER: "reports/cucumber",
	_VISUAL: "results/visual"
};

// Make all the run dirs
Object.entries(_PATHS).forEach(([k, p]) =>
	fs.ensureDirSync((_PATHS[k] = path.join(RUN_PATH, p)))
);

module.exports.config = {
	project: "FedEx",
	baseUrl: "http://localhost:4200",
	runner: "local",
	maxInstances: 4,
	sync: true,
	logLevel: "debug",
	logLevels: {
		webdriver: "debug",
		browserstack: "debug",
		"@wdio/browserstack-service": "debug",
		"@wdio/applitools-service": "info",
		devtools: "info",
		"wdio-multiple-cucumber-html-reporter": "debug"
	},
	bail: 0,
	waitforTimeout: 20000,
	connectionRetryTimeout: 90000,
	connectionRetryCount: 3,
	outputDir: _PATHS._LOGS,
	logDir: _PATHS._LOGS,
	seleniumLogs: _PATHS._LOGS,
	reporters: [
		"@wdio/spec-reporter",
		[
			"allure",
			{
				outputDir: _PATHS._RESULTS_ALLURE,
				disableWebdriverStepsReporting: true,
				disableWebdriverScreenshotsReporting: false
			}
		]
	],
	onPrepare: function(config, capabilities) {
		require("@babel/register");

		setAllureCustomLogo(
			path.join(_ASSETS, "custom-logo.svg"),
			path.join(_ASSETS, "custom-logo-collapsed.svg"),
			path.join(_ASSETS, "styles.css")
		);
	},
	before: function (capabilities, specs) {
		const { config, isMobile } = browser;
		const { automationProtocol } = config;
		const { hostname } = new URL(config.baseUrl)

		// browser.setTimeout({ implicit: 10000 });

		// Pupeteer limitation
		!isMobile && automationProtocol !== "devtools" && browser.maximizeWindow();

		setCommands();
	},
	beforeStep: function ({ uri, feature, step }, context) {
		const { keyword, text } = step.step;
		// console.log(`Next step: ${keyword}${text}`);
		// browser.debug();
	},
	after: function (result, capabilities, specs) {

	},
	afterTest: function (test, context, { result }) {
		browser.saveScreenshot(buildScreenshotFilename(test.title))
	},
	filterCaps: function(capabilities) {
		return capabilities.filter(cap =>
			Object.keys(cap).every(key => {
				const
					capKeyValue = cap[key],
					cliValues = [argv[key]].flat(),
					capKeyValueIsObj = typeof capKeyValue === "object",
					capKeyValueStr = `${capKeyValue || ""}`.toLowerCase();

				return capKeyValueIsObj && this.filterCaps([capKeyValue]).length ||
					cliValues.length ? cliValues.some(k => capKeyValueStr.includes(`${k || ""}`.toLowerCase())) : true
			})
		)
	},
	RUN_PATH,
	_ASSETS,
	..._PATHS
};
