import Component from "../components/Component";

export default class SearchForm extends Component {
	constructor(selector = "[data-test='search-form']"){
		super(selector)
	}

	get peopleInput () { return this.container.$('#people'); }

	get peopleLabel () { return this.container.$('label[for="people"]'); }

	get planetsInput () { return this.container.$('#planets'); }

	get planetsLabel () { return this.container.$('label[for="planets"]'); }

	get input() { return this.container.$('#query'); }

	get searchBtn() {
		return this.container.$('button[type="submit"]');
	}

	search(input) {
		input && this.input.setValue(input);
		this.searchBtn.click();
	}
}
