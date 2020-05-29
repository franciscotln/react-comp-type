# react-comp-type

Comp type for functional components composition in ReactJs.

Small demo app [here](https://codesandbox.io/s/xenodochial-firefly-0ghdu) in this sandbox.

`npm install react-comp-type`

## Implementations

### Monoid
* Concatenation
```js
Comp1.concat(Comp2.concat(Comp3)) == Comp1.concat(Comp2).concat(Comp3) 

// or equivalently
Comp1.concat(Comp2.concat(Comp3)) == Comp1.concat(Comp2, Comp3);
```
* Neutral element
```js
Comp.empty().concat(Comp1) == Comp1;
```

### Contravariant
* Identity:
```js
Comp1.contramap(props => props) == Comp1;
```
* Composition:
```js
Comp1.contramap(f).contramap(g) == Comp1.contramap(props => f(g(props)));
```

### Functor
Since it's intended to be used with React we can re-define the Functor::map operation in order to get idiomatic React while passing components references to other components and also to maintain meaningful devTools access

* Identity:
```js
Comp1.map(({ children, ...props }) => children) == Comp1;
```

* Composition:
```js
Comp1.map(ComponentA).map(ComponentB) == Comp1.map(function ComponentC({ children, ...props }) {
  return ComponentB({
    ...props,
    children: ComponentA({
      ...props,
      children
    })
  });
}

// Alternatively in JSX format:

Comp1.map(ComponentA).map(ComponentB) == Comp1.map(function ComponentC({ children, ...props }) {
  return (
    <ComponentB {...props}>
      <ComponentA {...props}>
        {children}
      </Component>
    </ComponentB>
  )
});

// In this form it's easier to notice that mapping is a form of "transclusion" used in Angular apps
```

### Profunctor
Using the Functor implementation from above and the Contravariant, we can define Profunctor

* Promap
```js
import React from 'react';
import Comp from 'react-comp-type';

const SomeComponent = ({ quantity }) => (
  <div className='SomeComponent'>
    Quantity: <b>{quantity}</b>
  </div>
);

const toComp1Props = props => ({ quantity: props.value });

const MyComponent = ({ children: someComponent, ...props }) => (
  <section className='MyComponent'>
    <h2>
      Now we can use the component instance below while the original props are still available
    </h2>
    {someComponent}
  </section>
);

Comp(SomeComponent).contramap(toComp1Props).map(MyComponent)
  == Comp(SomeComponent).promap(toComp1Props, MyComponent);
```
