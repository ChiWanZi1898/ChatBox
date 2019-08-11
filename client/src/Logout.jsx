import React, {Component, Fragment} from 'react';
import {withCookies} from 'react-cookie';
import {Modal, Button, Nav} from 'react-bootstrap';
import {withRouter} from "react-router-dom";


class Logout extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);

        this.state = {
            show: false
        }
    }

    handleClose() {
        this.setState({
            show: false
        });
    }

    handleShow() {
        this.setState({
            show: true
        });
    }


    render() {
        return (
            <Fragment>
                <Nav.Link onClick={this.handleShow}>Logout</Nav.Link>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Logout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you want to logout?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {
                            const {cookies} = this.props;
                            cookies.remove('token');
                            this.handleClose();
                            this.props.history.push('/login')
                            this.props.callback();
                        }}>
                            Logout
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}

export default withRouter(withCookies(Logout));