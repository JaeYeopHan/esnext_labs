import Model from "./Model";
import {Header, Footer} from "./components";

export default class Controller {
	constructor() {
		const model = new Model();

		const header = new Header();
		const footer = new Footer();

		model.add(header);
		model.add(footer);

		model.setItem("Apple");
		model.reload();
	}
}
