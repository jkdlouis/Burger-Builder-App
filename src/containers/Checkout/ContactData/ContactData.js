import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { updateObject, checkValidity } from "../../../shared/utility";
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    setUpFormFieldObj = (type, placeholder) => {
        return {
            elementType: 'input',
            elementConfig: {
                type: type,
                placeholder: placeholder
            },
            value: '',
            validation: {
                required: true,
                minLength: 2,
                maxLength: 30
            },
            valid: false,
            touched: false
        }
    };

    state = {
        orderForm: {
            name: this.setUpFormFieldObj('text', 'Your Name'),
            email: this.setUpFormFieldObj('email', 'Email'),
            street: this.setUpFormFieldObj('text', 'Street Address'),
            zipCode: this.setUpFormFieldObj('text', 'Zip Code'),
            country: this.setUpFormFieldObj('text', 'Country'),
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ]
                },
                value: 'fastest',
                valid: true,
                validation: {}
            }
        }
    };

    orderHandler = (event) => {
        event.preventDefault();
        const formData = {};

        for (let formElementIdentifier in this.state.orderForm) {
            formData[ formElementIdentifier ] = this.state.orderForm[ formElementIdentifier ].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            orderData: formData,
            userId: this.props.userId
        };

        this.props.onOrderBurger(order, this.props.token);
        this.props.history.push('/');
    };

    inputChangeHandler = (event, inputIdentifier) => {
        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
            touched: true
        });

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [ inputIdentifier ]: updatedFormElement
        });

        let formIsValid = true;

        for(let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({ orderForm: updatedOrderForm, formIsValid });
    };

    render() {
        const formElementArray = [];

        for (let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={ this.orderHandler }>
                {formElementArray.map(formElement => (
                    <Input
                        key={ formElement.id }
                        elementType={ formElement.config.elementType }
                        elementConfig={ formElement.config.elementConfig }
                        value={ formElement.config.value }
                        invalid={ !formElement.config.valid }
                        shouldValidate={ formElement.config.validation }
                        touched={ formElement.config.touched }
                        fieldName={ formElement.id }
                        changed={ (event) => this.inputChangeHandler(event, formElement.id) }/>
                ))
                }
                <Button btnType="Success" disabled={ !this.state.formIsValid }>Order</Button>
            </form>
        );

        if (this.props.loading) {
            form = <Spinner/>
        }

        return (
            <div>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));