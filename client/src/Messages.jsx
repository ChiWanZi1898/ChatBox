import React, {Component} from 'react';
import {withCookies} from 'react-cookie';
import {Form, InputGroup, FormControl, Button, ListGroup } from 'react-bootstrap'
import openSocket from 'socket.io-client';
// const socket = openSocket('http://10.0.0.100:8080');

class Messages extends Component {
    constructor(props) {
        super(props);


        this.state = {
            lastTimestamp: new Date(Date.now()),
            messages: [],
            input: '',
            socket: openSocket('http://18.217.70.32:8080')
        };

        // socket.connect();
        // alert(socket.connected);

        const document = this;
        this.state.socket.on('broadcast', data => {
            const payload = JSON.parse(data);
            payload.date = new Date(Date.parse(payload.date));
            // console.log(payload.date, document.state.lastTimestamp, payload.date > document.state.lastTimestamp, payload.date < document.state.lastTimestamp);
            if (payload.date < document.state.lastTimestamp) {
                document.setState({
                    messages: [...document.state.messages, payload],
                    lastTimestamp: payload.date
                });

            } else {
                const sortedMessages = [...document.state.messages, payload].sort((a, b) => {
                    return a.date - b.date;
                });
                document.setState({
                    messages: sortedMessages,
                });
            }

        });

    }

    send = (content) => {
        const {cookies} = this.props;
        const payload = {
            content,
            token: cookies.get('token')
        };
        this.state.socket.emit('send', JSON.stringify(payload));
    };

    componentWillUnmount() {
        this.state.socket.close();
    }

    onInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        })
    };

    onSend = (event) => {
        event.preventDefault();
        this.send(this.state.input);
        // this.setState({
        //     input: ""
        // });
    };

    formatDate = (date) => {
        // const diff = Date.now() - date.getTime();
        // if (diff < 1000 * 60) {
        //     return `${Math.round(diff / 1000)} seconds ago`;
        // } else if (diff < 1000 * 60 * 60) {
        //     return `${Math.round(diff / 1000 / 60)} minutes ago`;
        // } else {
        return date.toLocaleString();
        // }
    };

    render() {
        const scrollContainerStyle = {flex: "1", height: "100%"};
        return (
            <div style={scrollContainerStyle} className="d-flex flex-column">

                <div className="overflow-auto" style={{overflowY: "scroll", flex: "initial", height: "60%"}}>
                    <ListGroup variant="">

                        {this.state.messages.slice(0).reverse().map((message, idx) => {
                            return (
                                <ListGroup.Item key={message._id} className="flex-column align-items-start">
                                    <div className="d-flex w-100 justify-content-between">
                                        <p className="text-break ">{message.content}</p>
                                        <small className="col-2">{this.formatDate(message.date)}</small>
                                    </div>
                                    <small>{message.email} </small>
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </div>

                <div style={{position: "fixed", bottom: "0", width: "auto"}}>
                    <Form onSubmit={this.onSend} className="">
                        <InputGroup className="shadow-none mb-3">
                            <FormControl as="textarea" rows="2" className="shadow-none" name="input"
                                         onChange={this.onInputChange} value={this.state.input}
                                         style={{resize: "none"}}/>
                            <InputGroup.Append>
                                <Button variant="outline-primary" className="shadow-none" type="submit">Send</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </div>

            </div>
        )
    }
}

export default withCookies(Messages)