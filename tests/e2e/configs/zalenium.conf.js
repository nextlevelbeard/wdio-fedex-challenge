require("@babel/register");

const { config: baseConfig } = require("./local.conf.js");
const deepmerge = require("deepmerge");

const ZaleniumService = require("../services/Zalenium.service").default;

delete baseConfig.user;
delete baseConfig.key;

// Filter BrowserStack service
baseConfig.services = (baseConfig.services || []).filter(s => {
	const service = Array.isArray(s) ? s[0] : s;
	return !(service.includes && service.includes("browserstack"));
});

module.exports.config = deepmerge(baseConfig, {
	// user: process.env.BROWSER_STACK_USER,
	// key: process.env.BROWSER_STACK_PSW,
	hostname: "127.0.0.1",
	protocol: "http",
	automationProtocol: "webdriver",
	port: 4444,
	path: "/wd/hub",
	services: [
		[
			ZaleniumService,
			{
				host: "http://127.0.0.1",
				port: "4444",
				build: "edge"
			}
		]
		// ,
		// [
		// "browserstack",
		// {
		// 	browserstackLocal: false,
		// 	preferScenarioName: true
		// }
		// ]
	],
	browserstackLocal: false,
	beforeSession: function (config, capabilities, specs) {
		baseConfig.beforeSession &&
            baseConfig.beforeSession(config, capabilities, specs);
	}
});

module.exports.config.capabilities = module.exports.config.capabilities.map(
	(cap, opts = (cap["bstack:options"] = {})) =>
		deepmerge(cap, {
			"cjson:metadata": {
				device:
                    cap.deviceName ||
                    cap.device ||
                    cap.deviceName ||
                    opts.device,
				platform: {
					name: cap.os || opts.os,
					version: cap.osVersion || opts.osVersion
				}
			}
		})
);
