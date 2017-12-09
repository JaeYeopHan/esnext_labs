import Person from "./Person";

class Controller {
	constructor() {
		this.init();
	}

	init() {
		const p = new Person();

		p.setName("jbee", "han").sayName().setName("jaeyeop", "han").sayName();
	}
}

export default Controller;
