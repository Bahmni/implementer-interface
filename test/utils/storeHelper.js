import sinon from 'sinon';

const defaultState = {
  controlDetails: {},
};

export function getStore(state = defaultState) {
  return {
    subscribe: sinon.spy().named('subscribe'),
    dispatch: sinon.spy().named('dispatch'),
    getState: sinon.spy(() => state).named('getState'),
  };
}
