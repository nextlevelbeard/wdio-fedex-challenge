require("@babel/register");

const { config: baseConfig } = require("./local.conf.js");
const deepmerge = require("deepmerge");

module.exports.config = deepmerge(baseConfig, {
	hostname: "127.0.0.1",
	protocol: "http",
	automationProtocol: "webdriver",
	port: 4444,
	path: "/wd/hub",
	services: [
		['selenium-standalone', { logPath: baseConfig._LOGS }]
	]
});
