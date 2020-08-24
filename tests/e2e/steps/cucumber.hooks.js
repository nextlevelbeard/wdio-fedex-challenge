import { After, Before, Status } from "cucumber";
import { buildScreenshotFilename } from "../utils/helpers";

const { clearSession } = require("tests/e2e/utils/helpers");

Before(function(scenario){ this.scenario = scenario });

After(function (scenario) {
	if (scenario.result.status === Status.FAILED) {
		const screenShot = browser.saveScreenshot(buildScreenshotFilename(scenario.pickle.name))
		this.attach(screenShot, 'image/png');
	}
});

// Skip test for certain tags
Before("@skip or @wip or @WIP or @pending", () => "skipped");

// Create user per test
// Only initiates request, returns Promise
// Use browser.call to wait for request to finish
// Before(function () { this.user = signUp() });

// Clear session before and after each test
[Before, After].forEach(hook => hook(clearSession));
