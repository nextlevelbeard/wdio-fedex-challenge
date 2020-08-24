const path = require("path");
const fs = require("fs-extra");
const merge = require("deepmerge");
const glob = require("glob");
const { argv } = require("yargs");

const { spec: argSpecs, suite: argSuites, parallel } = argv;
const { config: baseConf } = require("../../base.conf.js");

const _FEATURES = path.resolve("tests/e2e/features");
const _PARALLEL_FEATURES = path.join(baseConf.RUN_PATH, "features");

const htmlReporter = require("multiple-cucumber-html-reporter");
const parallelParser = require("wdio-cucumber-parallel-execution");

function parallelize (specArray = []) {
	specArray = Array.isArray(specArray) ? specArray : [specArray];

	specArray = specArray
		.map(s => path.resolve(s))
		.map(s => glob.sync(s))
		.map(files => files.map(file =>
			path.join(
				_PARALLEL_FEATURES,
				path.basename(file).replace(/.feature$/, "_*.feature"))
		))

	const result = [...new Set(specArray)]
		.flat()
		.map(s => glob.sync(s))
		.map(files => files.map(file => file))
		.flat()

	return result
}

module.exports.config = merge(baseConf, {
	specs: [ path.join(_FEATURES, "**/*.feature") ],
	suites: Object.fromEntries(
		Object.entries({
			character: [ "SearchCharacter/**/*.feature" ],
			planet: [ "SearchCharacter/**/*.feature" ],
			search: [ "Search*/**/*.feature" ]
		})
			.map(([name, value]) => [
				name,
				Array.isArray(value)
					? value.map(spec => path.join(_FEATURES, spec))
					: path.join(_FEATURES, value)
			])
	),
	framework: "cucumber",
	cucumberOpts: {
		requireModule: ["@babel/register"],
		require: [
			"./tests/e2e/steps/**/*.*js",
			"./tests/e2e/components/**/*.*js",
			"./tests/e2e/pages/**/*.*js",
			"./tests/e2e/utils/**/*.*js",
			"./tests/e2e/services/**/*.*js"
		],
		tagsInTitle: false,
		timeout: 120000
		//tagExpression: "@TestRailID=C35"
	},
	reporters: [
		[ "cucumberjs-json", { jsonFolder: baseConf._RESULTS_JSON } ],
		[ "allure", {
			outputDir: baseConf._RESULTS_ALLURE,
			disableMochaHooks: true,
			useCucumberStepReporter: true
		}]
	],
	onPrepare(config, capabilities) {
		baseConf.onPrepare && baseConf.onPrepare(config, capabilities);
		capabilities = capabilities.map(
			(cap, opts = (cap["bstack:options"] = {})) =>
				merge(cap, {
					"cjson:metadata": {
						device:
                        cap.deviceName ||
                        cap.device ||
                        opts.deviceName ||
                        opts.device,
						platform: {
							name: cap.os || opts.os,
							version: cap.osVersion || opts.osVersion
						}
					}
				})
		);

		fs.emptyDirSync(baseConf._RESULTS_JSON);

		if (parallel) {
			// Create directory
			fs.ensureDirSync(_PARALLEL_FEATURES);
			// Split features
			parallelParser.performSetup({
				sourceSpecDirectory: path.join(_FEATURES, "**"),
				tmpSpecDirectory: _PARALLEL_FEATURES,
				cleanTmpSpecDirectory: true
			});
			// Parallelize the default specs
			config.specs = parallelize(config.specs)
			config.suites = Object.fromEntries(
				Object.entries(config.suites)
					.map(([name, pattern]) => [name, parallelize(pattern)])
			);
			// Parallelize the CLI specs
			if (argSpecs) {
				config.specs = parallelize(argSpecs);
			}
			// Filter the (already parallelized) suites
			if (argSuites) {
				config.suites = Object.fromEntries(
					Object.entries(config.suites)
						.filter(([name]) => argSuites.includes(name))
				);
			}
		}
	},
	onComplete(exitCode, config, capabilities, results) {
		baseConf.onComplete &&
            baseConf.onComplete(exitCode, config, capabilities, results);
		const host = new URL(config.baseUrl).host.toLowerCase();
		const env = host.split(".").reverse().pop();

		if (parallel) {
			// Grab result JSON
			const resultJSON = parallelParser.getConsolidatedData({
				parallelExecutionReportDirectory: this._RESULTS_JSON
			});
			// Remove previous results
			fs.emptyDirSync(this._RESULTS_JSON);
			// Write new JSON result file
			fs.writeFileSync(
				path.join(this._RESULTS_JSON, "results.json"),
				JSON.stringify(resultJSON, null, 4)
			);
		}
		// Remove previous report
		fs.emptyDirSync(baseConf._REPORTS_CUCUMBER);
		// Write new report
		htmlReporter.generate({
			reportName: `${config.project} Test Report - ${env}`,
			pageTitle: this.reportName,
			jsonDir: baseConf._RESULTS_JSON,
			reportPath: baseConf._REPORTS_CUCUMBER
		});
	},
	_FEATURES,
	_PARALLEL_FEATURES,
	parallelize
});
