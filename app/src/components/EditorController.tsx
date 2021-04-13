import * as React from "react";
import Row from "react-bootstrap/Row";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

class EditorController extends React.Component<any> {
    render() {
        return (
            <div>
                <Row className="ace-editor-controller run">
                    <Button className="ace-editor-code-run-btn" variant="success">
                        Run
                    </Button>{' '}
                </Row>
                <Row className="ace-editor-controller up">
                    <Button className="ace-editor-code-run-btn" variant="warning">
                        <FontAwesomeIcon icon={faChevronUp} fixedWidth />
                    </Button>{' '}
                </Row>
                <Row className="ace-editor-controller down">
                    <Button className="ace-editor-code-run-btn" variant="warning">
                        <FontAwesomeIcon icon={faChevronDown} fixedWidth />
                    </Button>{' '}
                </Row>

            </div>
        );
    }
}

export default EditorController;