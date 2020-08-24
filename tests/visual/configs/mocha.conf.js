const path = require("path");
const merge = require("deepmerge");
const { config: baseConfig } = require(path.resolve("tests/base.conf"));

exports.config = merge(baseConfig, {
	mochaOpts: {
		ui: "bdd",
		timeout: 120000,
		require: ["@babel/register"]
	},
	automationProtocol: "devtools",
	specs: ["./tests/*.*js"],
	reporters: [
		[
			"allure",
			{
				outputDir: baseConfig._RESULTS_ALLURE,
				disableMochaHooks: true,
				useCucumberStepReporter: false
			}
		]
	]
});
