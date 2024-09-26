import { createStore,applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { dataReducer } from './CategoriesRedux';

const store = createStore(dataReducer, applyMiddleware(thunk));

export default store;