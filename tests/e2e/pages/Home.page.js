import Page from "../components/Page.component";

import Character from "../components/Character.component";
import Planet from "../components/Planet.component";
import SearchForm from "../components/SearchForm.component";

export default class HomePage extends Page {
	constructor() {
		super();
		this.SearchForm = new SearchForm();
	}

	open() {
		browser.url("/");
	}

	get characters() { return $$("[data-test='character']"); }

	get Characters() { return this.characters.map(c => new Character(c)); }

	get planets() { return $$("[data-test='planet']"); }

	get Planets() { return this.planets.map(p => new Planet(p)); }

	get notFoundMsg() { return $("[data-test='app-notfound']") }

	get loadingMsg() { return $("[data-test='app-loading']") }

	get searchResults() { return [this.characters, this.planets].flat() }

	get SearchResults() { return [this.Characters, this.Planets].flat() }

}
