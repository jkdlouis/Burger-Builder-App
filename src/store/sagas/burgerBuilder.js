import { put } from 'redux-saga/effects';
import * as actions from "../actions/index";
import axios from '../../axios-orders';

export function* initialIngredientsSaga(action) {
    try{
        const response = yield axios.get('https://burger-builder-30e7a.firebaseio.com/ingredients.json');
        yield put(actions.setIngredients(response.data));
    } catch (error) {
        yield put(actions.fetchIngredientFailed());
    }
}