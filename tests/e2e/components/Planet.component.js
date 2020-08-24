import Component from "./Component";

export default class Planet extends Component {
	constructor(selector = "[data-test='planet']"){
		super(selector)
	}

	get name() { return this.container.$("[data-test='planet-name']"); }

	get population() { return this.container.$("[data-test='planet-population']"); }

	get climate() { return this.container.$("[data-test='planet-climate']"); }

	get gravity() { return this.container.$("[data-test='planet-gravity']"); }

	get asModel() {
		const { name, population, climate, gravity } = this;
		const entries = Object.entries({ name, population, climate, gravity });

		return Object.fromEntries(entries.map(([key, element]) => [key, element.getText()]));
	}
}
