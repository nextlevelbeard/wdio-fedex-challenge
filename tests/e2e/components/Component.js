export default class Component {
	constructor(init){
		if(init){
			Array.isArray(init) && (this.element = init)
			typeof init === 'object' && (this.element = init)
			!this.element && (this.selector = init)
		}
		else {
			throw new Error("Component needs to be initialied with either a selector (string) or an Element {object}")
		}
	}

	get container() {
		return (this.element || []).length ? this.element.reverse().pop() : this.element || $(this.selector);
	}

	get containers() {
		return Array.isArray(this.element) ? this.element : this.element || $$(this.selector);
	}
}