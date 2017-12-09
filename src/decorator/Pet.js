function decoratorToClass(target, name, descriptor) {
	console.log(target);
	console.log(target.name);
}

function decoratorToMethod(target, name, descriptor) {
	console.log(target);
	console.log(name);
	console.log(descriptor);
}
  
@decoratorToClass
class Pet {
	constructor(name) {
		this.name = name;
	}

	@decoratorToMethod
	bark() {

	}
}

export default Pet;
