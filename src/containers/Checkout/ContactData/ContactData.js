import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';

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
        },
        loading: false
    };

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const formData = {};

        for (let formElementIdentifier in this.state.orderForm) {
            formData[ formElementIdentifier ] = this.state.orderForm[ formElementIdentifier ].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            orderData: formData

        };

        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
            });
    };

    inputChangeHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updatedOrderForm[ inputIdentifier ]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;

        updatedOrderForm[ inputIdentifier ] = updatedFormElement;

        let formIsValid = true;

        for(let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({ orderForm: updatedOrderForm, formIsValid });
    };

    checkValidity = (value, rules) => {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
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

        if (this.state.loading) {
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
        ingredients: state.ingredients,
        totalPrice: state.totalPrice
    }
};

export default connect(mapStateToProps)(ContactData);