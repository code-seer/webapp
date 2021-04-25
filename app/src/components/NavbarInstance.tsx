import * as React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {configs} from "../util/config";

interface NavBarInstanceProps {
    onSelect: any,
    activeKey: any
}

class NavBarInstance extends React.Component<NavBarInstanceProps> {
    state = {
        showFeedbackDialog: false,
        showAboutDialog: false,
        feedbackBody: "",
        feedbackName: "",
        feedbackEmail: ""
    }

    componentDidMount() {
        this.resetModal();
    }

    resetModal = () => {
        this.setState({
            showFeedbackDialog: false,
            feedbackBody: "",
            feedbackName: "",
            feedbackEmail: ""
        })
    }
    handleAboutDialogShow = () => {
        this.setState({showAboutDialog: true});
    }

    handleAboutDialogClose = () => {
        this.setState({showAboutDialog: false});
    }

    handleFeedbackDialogShow = () => {
        this.setState({showFeedbackDialog: true});
    }

    handleFeedbackDialogClose = () => {
        this.setState({showFeedbackDialog: false});
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
            feedback: this.state.feedbackBody,
            email: this.state.feedbackEmail
        };
        const url =  `${configs.baseUrl}/${configs.urls.feedback}`;
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
        this.resetModal();
    }

    render() {
        const {
            showFeedbackDialog,
            showAboutDialog
        } = this.state;
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
                <Button className="about-btn" variant="info" onClick={this.handleAboutDialogShow}>
                    About
                </Button>{' '}
                <Modal show={showAboutDialog} onHide={this.handleAboutDialogClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>About LearNet</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group >
                            LearNet is a table-based code visualizer. Unlike traditional debugging tools that only execute code forward, LearNet allows you to execute and trace code <strong>forward</strong> and <strong>backward</strong>. That means you can execute a line, see the changes, and undo the execution. You can undo code execution all the way to the first line of the code or move forward to the last line of the code.
                            <br/>
                            <br/>
                            The ability to predict how a code would behave upon execution is an essential skill in software development. It is what allows one to read any code and understand what’s going on or take on a new problem and write out a concise solution. However, developing the intuition to do that is challenging, and sometimes even daunting for beginners. The reasons this is so difficult is because oftentimes there is no relation between what the code is doing and the way we are taught to solve problems or consume information.
                            <br/>
                            <br/>
                            LearNet tries to bridge the gap between these two worlds by re-imagining the execution of code as a table for learning purposes. Even experienced software developers have to resort to some form of tracing either when debugging or writing the code in the first place. A trace table is our most natural intuition. It is this process of visualizing the trace of a code and building a mental model over time that helps one transition into being an algorithmic thinker.
                            <br/>
                            <br/>

                            <strong>How to Use the Visualizer</strong>
                            <br/>
                            In order to use the visualizer, write your code in the code editor in the left pane and hit the green Play button. This will execute the code and enable the control buttons for scrolling through the lines. When you execute a line of code, a new row is generated and added to the table, showing the state of the variables.
                            <br/>
                            <br/>
                            <strong>Up arrow</strong> - Will reverse execution and render the last line that was executed.
                            <br/>
                            <strong>Down arrow</strong> - Will execute the code forward and keep adding new rows to the table with the new states. If a state of a variable has changed, it will be highlighted in orange.
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleAboutDialogClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Button className="feedback-btn" variant="warning" onClick={this.handleFeedbackDialogShow}>
                    Feedback
                </Button>{' '}
                <Modal show={showFeedbackDialog} onHide={this.handleFeedbackDialogClose}>
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