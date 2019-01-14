import * as actionTypes from '../actions/actionTypes';
import { updateObject } from "../utility";

const initialState = {
    ingredients: null,
    totalPrice: 4,
    loading: false,
    error: false,
    building: false
};

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

const addRemoveIngredient = (state, action, type) => {
    let updatedIngredient;

    if (type === 'add') {
        updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
    }

    if (type === 'remove') {
        updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
    }

    const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true
    };

    return updateObject(state, updatedState);
};

const setIngredient = (state, action) => {
    return updateObject(state, {
        ingredients: {
            salad: action.ingredients.salad,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat
        },
        totalPrice: 4,
        error: false,
        building: false
    });
};

const burgerBuilder = (state = initialState, action) => {
   switch (action.type) {
       case actionTypes.ADD_INGREDIENT: return addRemoveIngredient(state, action, 'add');
       case actionTypes.REMOVE_INGREDIENT: return addRemoveIngredient(state, action, 'remove');
       case actionTypes.SET_INGREDIENT: return setIngredient(state, action);
       case actionTypes.FETCH_INGREDIENT_FAILED: return updateObject(state, { error: true });
       default:
           return state;
   }
};

export default burgerBuilder;
