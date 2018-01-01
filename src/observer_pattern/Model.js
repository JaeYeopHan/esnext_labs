import Observer from "./Observer";

export default class Model extends Observer {
	setItem(item) {
		this.notify(item);
	}

	reload() {
		this.notify();
	}
}
