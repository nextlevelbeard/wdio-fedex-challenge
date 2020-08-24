import HomePage from "tests/e2e/pages/Home.page";

const homePage = new HomePage();

describe("Manufacture", () => {
	it("Home page should look the same", function () {
		homePage.open();
		this.results = browser.checkFullPageScreen("home");
		expect(this.results.misMatchPercentage).toEqual(0);
	});

	it("Home page can be navigated through tabs", function () {
		homePage.open();
		this.results = browser.checkTabbablePage("home-tab");
		expect(this.results.misMatchPercentage).toEqual(0);
	});
});
