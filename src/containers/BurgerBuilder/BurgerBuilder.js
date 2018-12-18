import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/action.constant';


class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: null
    };

    componentDidMount() {
        // axios.get('/ingredients.json')
        //     .then(response => {
        //         this.setState({ ingredients: response.data });
        //     })
        //     .catch(error => {
        //         this.setState({ error : true });
        //     })
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(ingredientKey => ingredients[ingredientKey])
            .reduce((prevValue, currentValue) => {
                return prevValue + currentValue;
            }, 0);
        return sum > 0;
    };

    // addIngredientHandler = (type) => {
    //     const oldCount = this.props.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.props.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    //     this.updatePurchaseState(updatedIngredients);
    // };
    //
    // removeIngredientHandler = (type) => {
    //     const oldCount = this.props.ingredients[type];
    //     if (oldCount <= 0) return;
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.props.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
    //     this.updatePurchaseState(updatedIngredients);
    // };

    purchaseHandler = () => {
        this.setState({purchasing: true});
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    };

    render() {
        const disabledInfo = {
            ...this.props.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

        if (this.props.ingredients) {
            burger = <Fragment>
            <Burger ingredients={this.props.ingredients}/>
            <BuildControls ingredientAdded={this.props.onIngredientAdded}
                           ingredientRemoved={this.props.onIngredientRemoved}
                           disabled={disabledInfo}
                           price={this.props.totalPrice}
                           purchasable={this.updatePurchaseState(this.props.ingredients)}
                           ordered={this.purchaseHandler}/>
                     </Fragment>;

            orderSummary = <OrderSummary
                ingredients={this.props.ingredients}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.totalPrice}/>;
        }

        if (this.state.loading) {
            orderSummary = <Spinner/>;
        }

        return (
            <Fragment>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                { burger }
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
  return {
      ingredients: state.ingredients,
      totalPrice: state.totalPrice
  }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch({ type: actionTypes.ADD_INGREDIENTS, ingredientName }),
        onIngredientRemoved: (ingredientName) => dispatch({ type: actionTypes.REMOVE_INGREDIENTS, ingredientName })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));