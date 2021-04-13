
import * as React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarInstance from "./components/NavbarInstance";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AceEditor from "./components/AceEditorWidget";

class App extends React.Component<any, any> {
    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.state = {
            activeKey: null
        };
    }
    handleSelect(eventKey: any) {
        this.setState({
            activeKey: eventKey
        });
    }

    render() {
      const { activeKey } = this.state;

    return (
        <div className="nav-wrapper">
            <NavBarInstance activeKey={activeKey} onSelect={this.handleSelect} />
            <Row>
                <Col xs lg="6">
                    <AceEditor/>
                </Col>
                <Col md="auto">Variable width content</Col>
                <Col xs lg="2">
                    3 of 3
                </Col>
            </Row>
        </div>
    );
  }
}

export default App;
