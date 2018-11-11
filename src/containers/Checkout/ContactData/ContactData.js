import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner'
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    };

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Louis Huang',
                address: {
                    street: '123 Test',
                    zipCode: '12345',
                    country: 'USA'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'Fastest'
        };

        axios.post('/orders.json', order)
            .then(response => {
                this.setState( { loading: false });
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ loading: false });
            });
    };

    render() {
        let form = (
            <form>
                <input className={classes.Block} type="text" name="Name" placeholder="Your Name" />
                <input className={classes.Block} type="text" name="Email" placeholder="Your Email" />
                <input className={classes.Block} type="text" name="Street" placeholder="Street Address" />
                <input className={classes.Block} type="text" name="Postal_Code" placeholder="Postal Code" />
                <Button btnType="Success" clicked={ this.orderHandler }>Order</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner/>
        }

        return (
            <div>
                <h4>Enter your Contact Data</h4>
                { form }
            </div>
        )
    }
}

export default ContactData;