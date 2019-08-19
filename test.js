import React from 'react';
import renderer from 'react-test-renderer';
import Comp from '.';

const Test = ({ text }) => <em>{text}</em>;

test('Comp::contramap - the props are mapped before hitting the component', () => {
  const TestComp = Comp(Test).contramap(props => ({ text: props.value }));

  const component = renderer.create(<TestComp.Render value='contramapped' id='1.618' />);

  expect(component.toJSON()).toMatchSnapshot();
});

test('Comp::map - the component should be passed as children to the next mapping component', () => {
  const TestComp = Comp(Test).map(function Parent({ children, text, id }) {
    return (
      <div>
        <p>Original Props</p>
        <p>{`Text: ${text}`}</p>
        <p>{`Id: ${id}`}</p>
        {children}
      </div>
    );
  });

  const component = renderer.create(<TestComp.Render text='mapped' id='2.718' />);

  expect(component.toJSON()).toMatchSnapshot();
});

test('Comp::promap - should behave as contramap and map applied together', () => {
  function Parent({ children, value, id }) {
    return (
      <div>
        <p>Original Props</p>
        <p>{`Value: ${value}`}</p>
        <p>{`Id: ${id}`}</p>
        {children}
      </div>
    );
  }

  const TestComp = Comp(Test).promap(props => ({ text: props.value }), Parent);

  const component = renderer.create(<TestComp.Render value='promapped' id='3.141' />);

  expect(component.toJSON()).toMatchSnapshot();
});

test('Comp::concat should concatenate two or more components, one after another', () => {
  const TestComp = Comp(Test).concat(Comp(function Another({ text }) {
    return <span>{text}</span>;
  }));

  const component = renderer.create(<TestComp.Render text='concatenating' />);

  expect(component.toJSON()).toMatchSnapshot();
});

test('Comp::empty should be a neutral element under concatenation', () => {
  const TestComp = Comp(Test).concat(Comp.empty());

  const component = renderer.create(<TestComp.Render text='concatenating with empty' />);

  expect(component.toJSON()).toMatchSnapshot();
});
