import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import {Navbar, Nav, Container} from 'react-bootstrap';
import {withCookies} from 'react-cookie';
import axios from 'axios'

import Register from './Register'
import Login from './Login'
import Messages from './Messages'
import Logout from './Logout'
import Home from './Home'
import NotFound from './NotFound'
import Unauthorized from './Unauthorized'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: true,
            messageBoxHeight: 0,
            email: "",
            nickname: ""
        };

    }

    handleLogin = () => {
        this.setState({
            isLoggedIn: true
        });
        this.getUserInfo();
    };

    handleLogout = () => {
        this.setState({
            isLoggedIn: false,
            email: undefined,
            nickname: undefined
        });
        const {cookies} = this.props;
        cookies.remove('token');
    };

    componentDidMount() {
        this.getUserInfo();
        this.updateWindowHeight();
        window.addEventListener('resize', this.updateWindowHeight);
    }

    getUserInfo = () => {
        if (this.props.cookies.get('token') === undefined) {
            this.setState({
                isLoggedIn: false,
                email: undefined,
                nickname: undefined
            });
            return;
        }

        axios.get('/api/account/user-info').then(res => {
            this.setState({
                isLoggedIn: true,
                email: res.data.email,
                nickname: res.data.nickname
            })
        }).catch(err => {
            this.setState({
                isLoggedIn: false,
                email: undefined,
                nickname: undefined
            });
            const {cookies} = this.props;
            cookies.remove('token');
        });
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowHeight);
    }

    updateWindowHeight = () => {
        this.setState({messageBoxHeight: window.innerHeight});
    };

    render() {

        let navBarContents;

        if (this.state.isLoggedIn) {
            navBarContents = (
                <Nav className="ml-auto">
                    <Nav.Link>{this.state.nickname}</Nav.Link>
                    <Link className="nav-link" to="messages">Chat</Link>
                    <Logout callback={this.handleLogout}/>
                </Nav>
            )
        } else {
            navBarContents = (
                <Nav className="ml-auto">
                    <Link className="nav-link" to="register">Register</Link>
                    <Link className="nav-link" to="login">Login</Link>
                </Nav>)
        }

        const mainContainerStyle = {
            messageBoxHeight: `${this.state.messageBoxHeight}px`,
            width: '100%',
        };


        return (
            <div className="d-flex flex-column" style={mainContainerStyle}>
                <Navbar bg="light" expand="sm">
                    <Container style={{maxWidth: "800px"}}>
                        <Link to='/'><Navbar.Brand>Chat Box</Navbar.Brand></Link>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse>
                            {navBarContents}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>


                <Container className="mt-3 flex-grow-1 d-flex flex-column" style={{maxWidth: "800px", flex: "1"}}>
                    <Switch>
                        <Route path="/" exact
                               render={() => <Home isLoggedIn={this.state.isLoggedIn} email={this.state.email}
                                                   nickname={this.state.nickname}/>}/>
                        <Route path="/register" render={() => <Register isLoggedIn={this.state.isLoggedIn}
                                                                        callback={this.handleLogin}/>}/>
                        <Route path="/login"
                               render={() => <Login isLoggedIn={this.state.isLoggedIn} callback={this.handleLogin}/>}/>
                        <Route path="/messages" render={() => this.state.isLoggedIn ?
                            <Messages email={this.state.email} nickname={this.state.nickname}/> : <Unauthorized/>}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Container>
            </div>

        )
    }

}

export default withCookies(App);
