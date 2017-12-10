# Decorator

이번 포스팅에서는 현재 [ts39/proposal stage-2](https://github.com/tc39/proposal-decorators)에 올라와있는 `Decorator`에 대해 알아보겠습니다. 자바스크립트 babel환경에서 데코레이터를 테스트해보기 위해서는 babel 플러그인이 추가적으로 필요합니다.
```bash
$ npm install babel-core babel-plugin-transform-decorators-legacy --save-dev
```
`babel-core`를 기본으로 하며, babel-plugin을 추가적으로 설치해줍니다.
```json .babelrc
{
  //...
  "plugins": ["transform-decorators-legacy"]
}
```
해당 프로젝트의 babel설정을 담고 있는 `.babelrc`파일에 설치한 플러그인을 추가해줍니다. 보다 구체적인 해당 개발환경은 [여기](https://github.com/JaeYeopHan/esnext_labs)를 참고해주세요.

TyeScript에서는 `tsconfig.json`의 `compilerOption`을 다음과 같이 변경해줍니다.
```json tsconfig.json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

</br>

## Intro
JavaScript (or TypeScript)에서 `@`이라는 character로 사용하는 문법을 `Decorator(데코레이터)`라고 합니다. 자바를 경험해보신 분이라면 `Annotation`인가?라고 생각하기 쉬운데요, 조금 다릅니다. 자바스크립트에서 데코레이터는 **함수** 라고 할 수 있습니다. 데코레이터는 말 그대로 코드 조각을 장식해주는 역할을 하며 자바스크립트에서는 그 기능을 함수로 구현할 수 있습니다.

#### 참조(reference)
데코레이터는 `@decorator`과 같이 사용할 수 있으며 `@[name]`의 형식일 때 `name`에 해당하는 이름의 함수를 참조하게 됩니다.

#### 실행 시점(execute time)
이렇게 데코레이터로 정의된 함수는 데코레이터가 적용된 메소드가 실행되거나 클래스가 `new`라는 키워드를 통해 인스턴스화 될 때가 아닌 자바스크립트가 컴파일될 때 실행됩니다. 즉, 매번 실행되지 않습니다. ES6에서의 메소드는 결국 prototype으로 들어가게 되는데, 메소드에 적용된 데코레이터 함수의 return value로 prototype에 들어가게 되는 것입니다.

#### Signature
`decorator` 함수에 인자로 넘겨준 `arguments`는 `Object.defineProperty` 함수의 signature와 동일합니다. `@`이라는 character가 그 역할을 대신 수행해주고 있는 것입니다.

_그럼 데코레이터가 메소드에 적용되는 경우와 클래스에 적용되는 경우, 두 가지로 나누어 코드를 살펴보겠습니다._

### Decorator to Method
```js sample.js
function decorator(target, name, descriptor) {
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

class Pet {
  @decorator
  bark() {
  }
}

const pet = new Pet();
```

`Pet`클래스에서 `bark`라는 메소드는 `Pet.prototype.bark`로 됩니다. class syntax 내부에서 `Object.defineProperty()`를 통해 이를 정의하고 있기 때문입니다. 위 코드에서는 `bark`라는 메소드가 `Pet`의 prototype의 프로퍼티로 추가되기 전에 `decorate` 함수가 실행되어 본래 `bark`라는 메소드에서 정의된 것에 추가적인 **'장식'** 을 더해 prototype에 추가되도록 합니다. 

> _cf) `Object.defineProperty`의 signature_
> - target : 속성을 정의하고자 하는 객체
> - name : 속성의 이름
> - descriptor : 새로 정의하고자 하는 속성에 대한 설명

`defineProperty`에 해당하는 보다 자세한 내용은 [여기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)에서 살펴보실 수 있습니다.

그렇다면 해당 자바스크립트가 컴파일 되었을 때의 console창을 보겠습니다.
```js
console.log(target); /// {constructor: f, bark: f}
console.log(name); // bark
console.log(descriptor); // {writable: true, enumerable: false, ...}
```
`target`은 해당 메소드가 속해있는 클래스 프로토타입을 가리키게 되며 `Pet`의 프로토타입에는 `constructor`와 `bark`메소드가 있는 것을 확인할 수 있습니다. `name`은 데코레이터가 적용된 메소드의 이름이 됩니다. `descriptor`는 `defineProperty`에서 정의할 수 있는 각각의 속성값들이 됩니다.

</br>

### Decorator to Class
하지만 데코레이터가 class에 적용되었을 때는 그 signature가 조금 달라집니다.

```js
function component(target, name, descriptor) {
  console.log(target); // ...
  console.log(name); // undefined
  console.log(descriptor); //undefined
}

@component
class Pet {
  constructor(name) {
    // ...
  }
}
```
데코레이터 함수로 정의한 `component`도 메소드에 정의했던 데코레이터 함수와 마찬가지로 컴파일될 때 실행이 됩니다. 하지만 클래스에 정의한 데코레이터 함수에는 하나의 인자만이 전달되는 것을 확인할 수 있습니다.
```js
console.log(target); // function Pet(name) { ... }
```
여기서의 `target`은 함수입니다. 자바스크립트에서 클래스 역시 함수인데요, 클래스를 구성하는 생성자 함수 자체가 `target`이 됩니다. 따라서 자연스럽게 `target.name`은 `Pet`이 됩니다.

</br>

## Use Case
### Chaining
```js
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
  
  sayName() {
    console.log(`I'm ${this.last} ${this.first});
  }
}

const p = new Person();
p.setName("jbee", "han").sayName(); // I'm han jbee 
```

### log

### immutable object

### check executing time



감사합니다.

### Reference
* https://github.com/wycats/javascript-decorators
* https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841
* https://www.sitepoint.com/javascript-decorators-what-they-are/
* https://cabbageapps.com/fell-love-js-decorators/
* https://javarouka.github.io/blog/2016/09/30/decorator-exploring/#class-il-gyeongu
* https://github.com/jayphelps/core-decorators
