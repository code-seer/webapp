import * as React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/Row";

interface NavBarInstanceProps {
    onSelect: any,
    activeKey: any
}

class NavBarInstance extends React.Component<NavBarInstanceProps> {
    state = {
        show: false,
        feedbackBody: "",
        feedbackName: "",
        feedbackEmail: ""
    }

    handleFeedbackDialogShow = () => {
        this.setState({show: true});
    }

    handleFeedbackDialogClose = () => {
        this.setState({show: false});
    }

    handleFeedbackBodyChange = (event: any) => {
        event.preventDefault();
        this.setState({feedbackBody: event.target.value});
    }

    handleFeedbackEmailChange = (event: any) => {
        event.preventDefault();
        this.setState({feedbackEmail: event.target.value});
    }

    handleFeedbackNameChange = (event: any) => {
        event.preventDefault();
        this.setState({feedbackName: event.target.value});
    }

    handleFeedbackSubmit = () => {
        const body = {
            name: this.state.feedbackName,
            body: this.state.feedbackBody,
            email: this.state.feedbackEmail
        };
        const url = "http://localhost:5000/feedback";
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
            }).catch(error => {
            console.log(error)
        });
        console.log("Feedback: ", body);
        this.setState({show: false});
    }

    render() {
        const { show } = this.state;
        return (
            <Navbar bg="primary" variant="dark">
                <Navbar.Brand href="#home">LearNet</Navbar.Brand>
                {/*<Nav className="mr-auto">*/}
                {/*    <Nav.Link href="#home">Home</Nav.Link>*/}
                {/*    <Nav.Link href="#features">Features</Nav.Link>*/}
                {/*    <Nav.Link href="#pricing">Pricing</Nav.Link>*/}
                {/*</Nav>*/}

                <Container>
                    <span className="Navbar-text-center">Code Visualizer</span>
                </Container>
                <Button className="feedback-btn" variant="warning" onClick={this.handleFeedbackDialogShow}>
                    Feedback
                </Button>{' '}
                <Modal show={show} onHide={this.handleFeedbackDialogClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Give us your feedback</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group >
                            LearNet is a work in progress and we need your help to make it better. Please let us know how
                            we can improve the code visualizer. Thank you! <br/><br/>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" onChange={this.handleFeedbackNameChange} value={this.state.feedbackName} placeholder=""/><br/>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" onChange={this.handleFeedbackEmailChange} value={this.state.feedbackEmail} placeholder=""/><br/>
                            <Form.Label>Feedback</Form.Label>
                            <Form.Control as="textarea" rows={5} onChange={this.handleFeedbackBodyChange} value={this.state.feedbackBody} placeholder=""/>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleFeedbackDialogClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleFeedbackSubmit}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Navbar>
        );
    }
}

export default NavBarInstance;