import { Given, When, Then } from "cucumber";

import HomePage from "../pages/Home.page";
const homePage = new HomePage();

const { SearchForm } = homePage;

Given(/^I (?:navigate to "localhost"|(?:open|am on) the (?:app|Home page))$/i, () => homePage.open());

When(/^I search for "?((?:[^"]|"")*)"?$/i, query => SearchForm.search(query));

Then(/^I should( not)? see a "?Not Found"? message$/i, notSee => {
	const { loadingMsg, notFoundMsg } = homePage;

	loadingMsg.waitForDisplayed({ reverse : true });

	notSee ?
		expect(notFoundMsg).not.toBeDisplayed() :
		expect(notFoundMsg).toBeDisplayed()
});
When(/^I (?:type|enter) "((?:[^"]|"")*)"(?: in the(?: Search)? form)?$/i, query => SearchForm.input.setValue(query));
When(/^I clear the (?:form|query|search|input)$/i, () => SearchForm.input.clearValue());
When(/^I press Search$/i, () => SearchForm.searchBtn.click());
When(/^I press Enter$/i, () => browser.keys("Enter"));
When(/^I press Enter( on the Search form)$/i, dummy => {
	const { input } = SearchForm;
	!input.isFocused() && input.click();
	browser.keys("Enter");
});

Then(/^I should( not)? see any search results$/i, shouldNot => {

	homePage.loadingMsg.waitForDisplayed({ reverse : true });

	const { Characters, Planets } = homePage;

	const displayedResults = [Planets, Characters]
		.flat()
		.filter(c => c.container.isDisplayed())
		// Better assertion output on failure
		.map(r => r.asModel);

	shouldNot ?
		expect(displayedResults).toHaveLength(0) :
		expect(displayedResults.length).toBeGreaterThan(0);
});

Then(/^I should see (multiple|(?:a single)) (Pe(?:rson|ople)|[cC]haracters?|[pP]lanets?)$/i, (choice, type) => {

	const plural = choice.toLowerCase() === "multiple";
	const planets = type.toLowerCase().includes("planet");

	homePage.loadingMsg.waitForDisplayed({ reverse: true });

	const { Characters, Planets } = homePage;

	const displayedResults = (planets ? Planets : Characters)
		.filter(c => c.container.isDisplayed())
		.map(r => r.asModel);

	plural ?
		expect(displayedResults.length).toBeGreaterThan(1) :
		expect(displayedResults).toHaveLength(1)

});

Then(/^the ([pP]lanets|[cC]haracters)'? names (should(?: not)?) contain "?((?:[^"])+)"?$/i, (type, flag, text) => {

	const forPlanets = type.toLowerCase() === "planets";
	text = text.toLowerCase();

	homePage.loadingMsg.waitForDisplayed({ reverse: true });

	const { Characters, Planets } = homePage;

	const displayedNames = (forPlanets ? Planets : Characters)
		.filter(c => c.container.isDisplayed())
		.map(r => r.name.getText().toLowerCase());

	expect(displayedNames).toEqual(expect.arrayContaining([expect.stringContaining(text)]));
});
