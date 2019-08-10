import React, {Component} from 'react';
import { withCookies } from 'react-cookie';



class Logout extends Component {

    constructor(props) {
        super(props);
        this.onLogout = this.onLogout.bind(this);
    }

    onLogout = () => {
        const { cookies } = this.props;
        cookies.remove('token');
        console.log('haha');
    };

    render() {
        return (
            <button onClick={this.onLogout}>Log out</button>
        )
    }
}

export default withCookies(Logout);