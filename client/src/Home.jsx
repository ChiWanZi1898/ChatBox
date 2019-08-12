import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import {Link} from "react-router-dom";

class Home extends Component {
    render() {

        let greetings;
        if (this.props.email !== undefined) {
            const { nickname } = this.props;
            greetings = (
                <p className="mt-3">
                    Welcome back {nickname}.
                    <Link to="messages" className="ml-2"><Button variant="outline-primary">Chat Now</Button></Link>
                </p>
            );
        } else {
            greetings = (
                <p className="mt-3">
                    <Link to="login"><Button variant="outline-primary">Login</Button></Link>
                    <Link to="register" className="ml-2"><Button variant="outline-primary">Join Now</Button></Link>
                </p>
            );
        }

        return (
            <div className="mt-5">
                <h1>Chat Box</h1>
                { greetings }
            </div>
        );
    }
}

export default Home