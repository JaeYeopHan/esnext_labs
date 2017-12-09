function chaining(target, name, descriptor) {
	const fn = descriptor.value;
	
	descriptor.value = function(...args) {
		fn.apply(target, args);
  
		return target;
	}
}

class Person {
	@chaining
	setName(first, last) {
	  this.first = first;
	  this.last = last;
	}

	@chaining
	sayName() {
		console.log(`I'm ${this.last} ${this.first}`);
	}
}

export default Person;
