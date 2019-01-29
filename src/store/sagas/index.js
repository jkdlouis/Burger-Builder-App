import { takeEvery } from 'redux-saga/effects';
import { authUserSaga, checkAuthTimeoutSaga, logoutSaga, authCheckStateSaga } from "./auth";
import * as actionTypes from '../actions/actionTypes';
import { initialIngredientsSaga } from "./burgerBuilder";

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
    yield takeEvery(actionTypes.AUTH_USER, authUserSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);
}

export function* watchBurgerBuilder() {
    yield takeEvery(actionTypes.INIT_INGREDIENTS, initialIngredientsSaga)
}