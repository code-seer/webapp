
import * as React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarInstance from "./components/NavbarInstance";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AceEditor from "./components/AceEditorWidget";
import EditorController from "./components/EditorController";
import TraceTable from "./components/TraceTable";

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
        <div className="app">
            <NavBarInstance activeKey={activeKey} onSelect={this.handleSelect} />
            <Row className="editor-container">
                <Col xs={12} md={4}>
                    <AceEditor/>
                </Col>
                <Col xs md={1}>
                    <EditorController/>
                </Col>
                <Col xs={12} md={7}>
                    <TraceTable/>
                </Col>
            </Row>
        </div>
    );
  }
}

export default App;
