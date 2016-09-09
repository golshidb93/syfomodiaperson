import './utils/init/globals';
import { render } from 'react-dom';
import React from 'react';
import AppRouter from './routers/AppRouter.js';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import sykmeldinger from './reducers/sykmeldinger.js';
import ledetekster from './reducers/ledetekster.js';
import { hentLedetekster } from './actions/ledetekster_actions.js';
import { hentSykmeldinger } from './actions/sykmeldinger_actions.js';
import history from './history.js';

const rootReducer = combineReducers({
    sykmeldinger,
    ledetekster,
    history,
});

const store = createStore(rootReducer,
    applyMiddleware(thunkMiddleware)
);

store.dispatch(hentLedetekster());

render(<Provider store={store}>
        <AppRouter history={history} /></Provider>,
    document.getElementById('maincontent'));


store.dispatch(hentLedetekster());
store.dispatch(hentSykmeldinger());

export {
    store,
    history,
};
