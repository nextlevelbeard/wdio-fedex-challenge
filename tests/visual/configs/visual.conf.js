require("@babel/register");

const fs = require("fs");

const { addLabel, addAttachment } = require("@wdio/allure-reporter").default;

const { buildScreenshotFilename } = require("../../e2e/utils/helpers");

const { config: baseConfig } = require("./mocha.conf.js");
const merge = require("deepmerge");

const { join } = require("path");

module.exports.config = merge(baseConfig, {
	automationProtocol: "devtools",
	capabilities: [
		{
			browserName: "chrome",
			"goog:chromeOptions": { headless: false }
		}
	],
	// port: 4444,
	// path: "/",
	// chromeDriverArgs: ["--port=4444"],
	services: [
		// ["chromedriver", { port: 4444 }],
		[
			"image-comparison",
			{
				baselineFolder: join(process.cwd(), "./tests/visual/snapshots"),
				formatImageName: "{tag}-{logName}-{width}x{height}",
				screenshotPath: baseConfig._VISUAL,
				returnAllCompareData: true,
				savePerInstance: true,
				autoSaveBaseline: true,
				blockOutStatusBar: true,
				blockOutToolBar: true,
				disableCSSAnimation: false,
				hideScrollBars: true,
				tabbableOptions: {
					circle: { size: 18, fontSize: 18 },
					line: { color: "#ff221a", width: 3 }
				},
				fullPageScrollTimeout: 3000
			}
		]
	],
	afterTest: function (
		test,
		context,
		{ error, result, duration, passed, retries }
	) {
		if (context.results) {
			addLabel("testType", "screenshotDiff");
			context.results.folders.expected = context.results.folders.baseline;

			["diff, actual", "expected"]
				.map(arg => [arg, context.results.folders[arg]])
				.forEach(
					([arg, file]) =>
						file &&
                        addAttachment(arg, fs.readFileSync(file), "image/png")
				);
		}

		if (!passed) {
			const filePath = buildScreenshotFilename(test.title);
			browser.saveScreenshot(filePath);
		}
	}
});

module.exports.config.specs = ["./tests/visual/visual.test.js"];
