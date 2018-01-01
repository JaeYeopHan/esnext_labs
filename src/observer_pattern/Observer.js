export default class Observer {
	constructor() {
		this._observers = [];
	}

	add(observer) {
		this._observers.push(observer);
	}

	remove(observer) {
		const idx = this._observers.indexOf(observer);

		this._observers.slice(idx, 1);
	}

	notify(val) {
		this._observers.forEach(value => {
			value.update(val);
		});
	}
}
