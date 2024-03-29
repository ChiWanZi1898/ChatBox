import React, {Component, createRef} from 'react';
import {withCookies} from 'react-cookie';
import {withRouter} from 'react-router-dom';
import {Form, InputGroup, FormControl, Button, ListGroup, Badge} from 'react-bootstrap'
import openSocket from 'socket.io-client';
import axios from 'axios'

class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstID: -1,
            lastID: -1,
            messages: [],
            input: '',
            socket: openSocket('http://www.zhuhongyu.org:8080'),
            // socket: openSocket('http://10.0.0.100:8080'),
            // socket: openSocket('http://127.0.0.1:8080'),
            width: undefined,
            messageBoxHeight: undefined,

            toBottomHeight: 0
        };


        const document = this;
        this.state.socket.on('broadcast', data => {

            const payload = JSON.parse(data);
            payload.date = new Date(Date.parse(payload.date));
            payload.seq = parseInt(payload.seq);

            if (payload.seq === this.state.lastID + 1) {
                document.setState({
                    messages: [...document.state.messages, payload],
                    lastID: payload.seq
                });
                this.scrollToBottom();
            } else {
                document.fetchLost(this.state.lastID + 1, payload.seq);
            }

        });

        this.mainRef = createRef();
        this.messageBoxRef = createRef();
        this.inputRef = createRef();
    }

    updateWindowSize = () => {

        const messageBoxTop = this.mainRef.current.getBoundingClientRect().top;
        const inputTop = this.inputRef.current.getBoundingClientRect().top;
        const messageBoxHeight = inputTop - messageBoxTop - 15;

        this.setState({
            width: this.mainRef.current.offsetWidth,
            messageBoxHeight: messageBoxHeight
        });
    };

    componentDidMount() {
        this.updateWindowSize();
        window.addEventListener('resize', this.updateWindowSize);
        document.addEventListener('keypress', this.handleKeyPress);
        this.fetchHistory(-1, -1);
    }

    componentWillUnmount() {
        this.state.socket.close();
        window.removeEventListener('resize', this.updateWindowSize);
        document.removeEventListener('keyup', this.handleKeyPress);
    }

    send = (content) => {
        const {cookies} = this.props;
        const payload = {
            content,
            token: cookies.get('token')
        };
        this.state.socket.emit('send', JSON.stringify(payload));
    };

    onInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value[value.length - 1] === '\n' ? value.slice(0, value.length - 1) : value
        })
    };

    onSend = (event) => {
        event.preventDefault();

        if (!/^\s*$/.test(this.state.input)) {
            this.send(this.state.input);

            this.setState({
                input: ''
            })
        }
    };

    onScroll = () => {

        this.setState({
            toBottomHeight: this.messageBoxRef.current.scrollHeight - this.messageBoxRef.current.scrollTop
        });

        const scrollTop = this.messageBoxRef.current.scrollTop;
        if (scrollTop === 0) {
            this.fetchHistory(-1, this.state.firstID);
        }
    };

    formatDate = (date) => {
        let dateString =  date.toLocaleString(
            'en-US-u-nu-latn-ca-iso8601-hc-h24',
            {
                dateStyle: 'medium',
                timeStyle: 'medium'
            }
        );
        dateString = dateString.replace(/,/g, '');
        return dateString
    };

    scrollToBottom = () => {
        const scrollHeight = this.messageBoxRef.current.scrollHeight;
        const height = this.messageBoxRef.current.clientHeight;
        const maxScrollTop = scrollHeight - height;

        this.setState({
            toBottomHeight: 0
        });

        this.messageBoxRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    };

    fetchHistory = (startID, endID) => {
        this.fetchMessages(startID, endID, () => {
            this.messageBoxRef.current.scrollTop = this.messageBoxRef.current.scrollHeight - this.state.toBottomHeight;
        });
    };

    fetchLost = (startID, endID) => {
        this.fetchMessages(startID, endID, this.scrollToBottom);
    };

    fetchMessages = (startID, endID, callback) => {
        axios.get('/api/chat/history', {params: {startID, endID}}).then(res => {

            let messages = res.data;
            messages = messages.map((message, idx) => {
                message.date = new Date(Date.parse(message.date));
                return message
            });

            const uniqueMessages = this.deduplicateMessages(this.state.messages.concat(messages));
            const sortedMessages = uniqueMessages.sort((a, b) => {
                return a.seq - b.seq;
            });
            this.setState({
                messages: sortedMessages,
                lastID: sortedMessages[sortedMessages.length - 1].seq,
                firstID: sortedMessages[0].seq
            });

            if (callback) {
                callback();
            }


        }).catch(err => {
            console.log(err);
        });
    };

    deduplicateMessages = (messages) => {
        var seen = {};
        return messages.filter(function (message) {
            return seen.hasOwnProperty(message.seq) ? false : (seen[message.seq] = true);
        });
    };

    handleKeyPress = (event) => {
        if (event.keyCode === 13) {
            this.onSend(event)
        }
    };

    render() {
        const scrollContainerStyle = {flex: "1", messageBoxHeight: "100%"};
        return (
            <div style={scrollContainerStyle} className="d-flex flex-column" ref={this.mainRef}>

                <div className="overflow-auto" style={{
                    overflowY: "scroll",
                    flex: "initial",
                    height: `${this.state.messageBoxHeight}px`
                }} ref={this.messageBoxRef} onScroll={this.onScroll}>
                    <ListGroup>
                        {this.state.messages.map((message, idx) => {
                            return (
                                <ListGroup.Item key={message._id} className="flex-column align-items-start">
                                    <div className="d-flex w-100 ">
                                        <p className="text-break ">{message.content}</p>
                                        <small className="ml-auto col-2 text-right">{this.formatDate(message.date)}</small>
                                    </div>
                                    <div className="d-flex w-100 justify-content-start">
                                        <small className="text-left mr-3" style={{padding: '0'}}>{message.email} </small>
                                        {this.props.email === message.email ? <Badge variant="primary" className="">Me</Badge> :
                                            <Badge variant="primary"/>}
                                    </div>

                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </div>

                <div style={{position: "fixed", bottom: "0", width: `${this.state.width}px`}} ref={this.inputRef}>
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

export default withRouter(withCookies(Messages))