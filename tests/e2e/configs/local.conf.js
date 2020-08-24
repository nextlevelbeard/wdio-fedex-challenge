const { config } = require("./cucumber.conf.js");
const merge = require("deepmerge");
const { argv } = require("yargs");
const { headless } = argv

module.exports.config = merge(config, {
	automationProtocol: "devtools",
	capabilities: config.filterCaps([
		// {
		// 	browserName: "MicrosoftEdge",
		// 	"ms:edgeOptions": {
		// 		headless
		// 	}
		// },
		{
			browserName: "firefox",
			'moz:firefoxOptions': {
				binary: '/home/trinity/Downloads/nightly/firefox'
			}
		}
		,
		{
			browserName: "chrome",
			"goog:chromeOptions": {
				headless
			}
		}
	]),

	// services: [["selenium-standalone", { port: "4444" }]],
	// //geckoDriverRandomPort: true,
	// services: [["chromedriver", { port: 4444 }]],
	port: 4444,
	path: "/"
	// chromeDriverArgs: ["--port=4444"],
});
