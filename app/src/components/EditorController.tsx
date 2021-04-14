import * as React from "react";
import Row from "react-bootstrap/Row";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faPlay } from "@fortawesome/free-solid-svg-icons";
import {inject, observer} from "mobx-react";
import {TraceTableStore, UserCodeStore} from "../store/Stores";

@inject('rootStore')
@observer
class EditorController extends React.Component<any> {
    userCodeStore: UserCodeStore = this.props.rootStore.userCodeStore;
    traceTableStore: TraceTableStore = this.props.rootStore.traceTableStore;

    onRun = () => {
        this.traceTableStore.data = this.userCodeStore.code;
        console.log("data value has been set: " + this.traceTableStore.data)
    }

    render() {
        return (
            <div>
                <Row className="ace-editor-controller run">
                    <Button className="ace-editor-code-run-btn" variant="success"
                            onClick={() => {this.onRun()}}>
                        <FontAwesomeIcon icon={faPlay} fixedWidth />
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