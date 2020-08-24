import { Given, When, Then } from "cucumber";

import HomePage from "../pages/Home.page";
const homePage = new HomePage();

const { SearchForm } = homePage;

import _ from "lodash";
import { sanitizeTable } from "../utils/helpers";

const toLowerCase = v => _.isString(v) ? v.toLowerCase() : v;

Then(/^pPlanets should( not)? be selected$/i, flag =>
	expect(SearchForm.planetsInput.isSelected()).toBe(!flag)
);

When(/^I (?:select|press|choose) (?:the )?Planets( button)?$/i, button => {
	const { planetsInput, planetsLabel } = SearchForm;
	(button ? planetsInput : planetsLabel).click()
});

When(/^I switch to Planets$/i, () => {
	const { planetsInput, planetsLabel } = SearchForm;
	planetsInput.click()
	SearchForm.searchBtn.click()
});

Then(/^I should( not)? see a list of [pP]lanets$/i, notSee => {

	homePage.loadingMsg.waitForDisplayed({ reverse : true });

	const displayedPlanets = homePage.Planets.filter(p => p.container.isDisplayed()).map(p => p.asModel);

	notSee ?
		expect(displayedPlanets).toHaveLength(0) :
		expect(displayedPlanets.length).toBeGreaterThan(0);
});

Then(/^each [pP]lanet should display its details$/i, () => {

	homePage.loadingMsg.waitForDisplayed({ reverse : true });

	const { Planets } = homePage;

	expect(Planets.filter(p => p.container.isDisplayed())).not.toHaveLength(0);

	Planets.forEach(({ name, climate, population, gravity }) =>
		[name, climate, population, gravity].forEach(prop => {
			expect(prop).toBeDisplayed();
			expect(prop.getText()).not.toHaveLength(0);
		})
	)
});

Then(/^I should see (?:a|some) ([pP]lanets?) listed$/i, (dummy, table) => {

	homePage.loadingMsg.waitForDisplayed({ reverse: true });

	const expectedPlanets = sanitizeTable(table).map(c => _.mapValues(c, toLowerCase))
	const actualPlanets = homePage.Planets.map(p => _.mapValues(p.asModel, toLowerCase))

	expect(actualPlanets).toEqual(expect.arrayContaining(expectedPlanets.map(expect.objectContaining)));
});

