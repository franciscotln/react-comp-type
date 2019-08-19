import React from 'react';

const CONTRAMAP = 'Contramap';
const MAP = 'Map';
const PROMAP = 'Promap';
const CONCAT = 'Concat';

const setDisplayName = (hoc, [source, context]) => {
  hoc.displayName = `${context}(${source.displayName || source.name})`;
  return hoc;
};

const Comp = Render => ({
  Render,
  contramap: f =>
    Comp(
      setDisplayName(props => <Render {...f(props)} />, [Render, CONTRAMAP])
    ),
  map: G =>
    Comp(
      setDisplayName(
        props => (
          <G {...props}>
            <Render {...props} />
          </G>
        ),
        [G, MAP]
      )
    ),
  promap: (f, G) =>
    Comp(
      setDisplayName(
        props => (
          <G {...props}>
            <Render {...f(props)} />
          </G>
        ),
        [G, PROMAP]
      )
    ),
  concat: (...Comps) =>
    Comp(
      setDisplayName(
        props => (
          <>
            <Render {...props} key={0} />
            {Comps.map((Other, idx) => (
              <Other.Render {...props} key={idx + 1} />
            ))}
          </>
        ),
        [Render, CONCAT]
      )
    )
});

Comp.empty = () =>
  Comp(function Empty() {
    return null;
  });

export default Comp;
