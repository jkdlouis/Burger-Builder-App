import React, { Component, Fragment } from 'react';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {

    render() {
        const ingredientSummary = Object.keys(this.props.ingredients)
            .map((ingredientKey, i) => {
                return <li key={ingredientKey + i}>
              <span style={{ textTransform: 'capitalize' }}>
              { ingredientKey }
              </span>: { this.props.ingredients[ingredientKey] }
                </li>
            });

        return (
            <Fragment>
                <h3>Your Order</h3>
                <p>A delicious burger with the following ingredients:</p>
                <ul>
                    { ingredientSummary }
                </ul>
                <p><strong>Total Price: ${ this.props.price.toFixed(2) }</strong></p>
                <p>Continue to Checkout?</p>
                <Button btnType="Danger" clicked={ this.props.purchaseCanceled }>Cancel</Button>
                <Button btnType="Success" clicked={ this.props.purchaseContinued }>Continue</Button>
            </Fragment>
        )
    }
};

export default OrderSummary;