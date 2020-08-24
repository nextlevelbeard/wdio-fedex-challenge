import fs from "fs";
import cucumberJson from "wdio-cucumberjs-json-reporter";

export const commands = {
	browser: {
		$now: (fnOrSelector = () => undefined) => {
			const timeouts = browser.getTimeouts();
			let result, error;
			try {
				browser.setTimeout({ implicit: 0 });
				result = fnOrSelector instanceof Function ? fnOrSelector() : $(fnOrSelector);
			} catch (e) {
				error = e;
			} finally {
				browser.setTimeout(timeouts);
			}
			if (error) throw error;
			return result;
		},

		waitUntil$: function (
			fnOrSelector = () => undefined,
			options = undefined
		) {
			return browser.waitUntil(() => browser.$now(fnOrSelector), options);
		},

		saveScreenshot: function (origFn, filePath) {
			origFn(filePath);

			const bitmap = fs.readFileSync(filePath);
			if (bitmap) {
				const base64 = Buffer.from(bitmap).toString("base64");
				cucumberJson.attach(base64, "image/png");
				return base64;
			}

		}
	},

	element: {
		click: function (
			origClickFunction,
			scrollIntoViewOptions = { behavior: "instant", block: "center" }
		) {
			this.scrollIntoView(scrollIntoViewOptions);

			const { browserName } = browser.capabilities;

			if (browserName.includes("afari")) {
				return browser.execute("arguments[0].click();", this);
			}
			return origClickFunction();

		}
	}
};

const setCommands = () => {
	[
		[commands.browser, false],
		[commands.element, true]
	].forEach(([src, onElement]) =>
		Object.entries(src).forEach(([name, fn]) => {
			if (!onElement) {
				browser[name]
					? browser.overwriteCommand(name, fn, onElement)
					: browser.addCommand(name, fn, onElement);
			} else {
				browser.overwriteCommand(name, fn, onElement);
			}
		})
	);
};

export default setCommands;
