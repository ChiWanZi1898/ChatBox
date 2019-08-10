import React, {Component} from 'react';

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
        fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                console.log('Registered');
                alert('Registered Successfully!');
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
            <form onSubmit={this.onSubmit}>
                <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.onInputChange} required/>
                <input type="text" name="nickname" placeholder="Nickname" value={this.state.nickname} onChange={this.onInputChange}/>
                <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onInputChange} required/>
                <input type="submit" value="submit"/>
            </form>
        )
    }
}

export default Register