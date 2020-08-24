const merge = require("deepmerge");
const path = require("path");
const child = require("child_process");

require("@babel/register");

const { config: baseConfig } = require("./../../e2e/configs/cucumber.conf");
const { CI_BRANCH, CI_COMMIT, GITHUB_SHA, GITHUB_HEAD_REF } = process.env;

const
	branch = CI_BRANCH || GITHUB_HEAD_REF,
	revision = CI_COMMIT || GITHUB_SHA;

const baseCapability = {
	"bstack:options": {
		debug: true,
		local: true,
		// localIdentifier: localIdentifier,
		resolution: "1920x1080",
		seleniumVersion: "4.0.0-alpha-2",
		projectName: baseConfig.project || "FedEx",
		appiumVersion: "1.17.0",
		timezone: "Europe/Amsterdam",
		buildName: `${branch} @ ${revision}`,
		userName: process.env.BROWSER_STACK_USER,
		accessKey: process.env.BROWSER_STACK_PSW
	}
	// "moz:firefoxOptions": {
	//     prefs: {
	//         "dom.storage.enabled": true,
	//     },
	// },
};

const capabilities = [
	{
		browserName: "chrome",
		"bstack:options": {
			os: "Windows",
			osVersion: "10"
		}
	},
	{
		browserName: "firefox",
		"bstack:options": {
			os: "Windows",
			osVersion: "10"
		}
	},
	{
		browserName: "Edge",
		"bstack:options": {
			os: "Windows",
			osVersion: "10"
		}
	},
	{
		"bstack:options": {
			os: "Windows",
			osVersion: "10",
			ie: {
				noFlash: "true",
				enablePopups: "true"
			},
			seleniumVersion: "3.141.59"
		},
		browserName: "IE",
		browserVersion: "11.0"
	}
];

module.exports.config = merge(baseConfig, {
	user: process.env.BROWSER_STACK_USER,
	key: process.env.BROWSER_STACK_PSW,
	capabilities: baseConfig.filterCaps(
		capabilities.map(cap => merge(baseCapability, cap))
	),
	browserstackLocal: true,
	services: [
		[ "browserstack", {
			browserstackLocal: true,
			preferScenarioName: true,
			opts: {
				browserstackLocal: true,
				verbose: true,
				logFile: path.join(baseConfig._LOGS, "tunnel.log"),
				key: process.env.BROWSER_STACK_PSW
			}
		}]
	]
});
