import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            nickname: ''
        };
    }

    onInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        fetch('/api/account/register', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                console.log('Registered');
                alert('Registered successfully!');
                this.props.history.push('/login');
            } else {
                throw new Error(res.error);
            }
        }).catch(err => {
            console.error(err);
            alert('Unable to register! Please try again.')
        })
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="formGroupEmail" value={this.state.email} onChange={this.onInputChange} required >
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email"/>
                </Form.Group>
                <Form.Group controlId="formGroupPassword" value={this.state.password} onChange={this.onInputChange} required>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password"/>
                </Form.Group>
                <Form.Group controlId="formGroupNickname"  value={this.state.nickname} onChange={this.onInputChange}>
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control type="text" placeholder="Nickname" name="nickname"/>
                </Form.Group>
                <Button variant="outline-primary" type="submit">
                    Register
                </Button>
            </Form>
        )
    }
}

export default withRouter(Register)