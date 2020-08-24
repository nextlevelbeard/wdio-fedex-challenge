import { Given, When, Then } from "cucumber";

import HomePage from "../pages/Home.page";
const homePage = new HomePage();

const { SearchForm } = homePage;

import _ from "lodash";
import { sanitizeTable } from "../utils/helpers";

const toLowerCase = v => _.isString(v) ? v.toLowerCase() : v;

Then(/^[pP]eople should( not)? be selected$/i,
	flag => expect(SearchForm.peopleInput.isSelected()).toBe(!flag)
);

When(/^I (?:select|press|choose) (?:the )?People( button)?$/i, button => {
	const { peopleInput, peopleLabel } = SearchForm;
	(button ? peopleInput : peopleLabel).click()
});

When(/^I switch to People$/i, () => {
	const { peopleInput } = SearchForm;
	peopleInput.click()
	SearchForm.searchBtn.click()
});

Then(/^I (should(?: not)?) see a list of (?:[pP]eople|[cC]haracters)$/i, should => {

	homePage.loadingMsg.waitForDisplayed({ reverse : true });

	const displayedCharacters = homePage.Characters.filter(p => p.container.isDisplayed()).map(r => r.asModel);

	should.includes("not") ?
		expect(displayedCharacters).toHaveLength(0) :
		expect(displayedCharacters.length).toBeGreaterThan(0);

});

Then(/^each [cC]haracter should display its details$/i, () => {

	homePage.loadingMsg.waitForDisplayed({ reverse : true });

	const { Characters } = homePage;

	expect(Characters.filter(p => p.container.isDisplayed())).not.toHaveLength(0);

	Characters.forEach(({ name, gender, birthYear, eyeColor, skinColor }) =>
		[name, gender, birthYear, eyeColor, skinColor].forEach(prop => {
			expect(prop).toBeDisplayed();
			expect(prop.getText()).not.toHaveLength(0);
		})
	)
});

Then(/^I should see (?:a|some) ([cC]haracters?) listed$/i, (dummy, table) => {

	homePage.loadingMsg.waitForDisplayed({ reverse: true });

	const expectedCharacters = sanitizeTable(table)
		.map(c => _.pickBy(c, d => d !== undefined))
		.map(c => _.mapValues(c, toLowerCase))

	const actualCharacters = homePage.Characters
		.map(c => c.asModel)
		.map(c => _.mapValues(c, toLowerCase))

	expect(actualCharacters).toEqual(expect.arrayContaining(expectedCharacters.map(expect.objectContaining)));
});
