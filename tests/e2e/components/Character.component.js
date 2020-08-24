import Component from "./Component";

export default class Character extends Component {
	constructor(selector = "[data-test='character']"){
		super(selector)
	}

	get name() { return this.container.$("[data-test='character-name']"); }

	get gender() { return this.container.$("[data-test='character-gender']"); }

	get birthYear() { return this.container.$("[data-test='character-year']"); }

	get eyeColor() { return this.container.$("[data-test='character-eye']"); }

	get skinColor() { return this.container.$("[data-test='character-skin']"); }

	get asModel() {
		const { name, skinColor, gender, birthYear, eyeColor } = this;
		const entries = Object.entries({ name, skinColor, gender, birthYear, eyeColor });

		return Object.fromEntries(entries.map(([name, element]) => [name, element.getText()]));
	}
}

