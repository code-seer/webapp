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
        const url = "http://localhost:5000/visualizer"
        const body = {
            "py_version": 2.7,
            "user_code": "aW5wdXQgPSAnSm9obixEb2UsMTk4NCw0LDEsbWFsZScKCnRva2VucyA9IGlucHV0LnNwbGl0KCcsJykKZmlyc3ROYW1lID0gdG9rZW5zWzBdCmxhc3ROYW1lID0gdG9rZW5zWzFdCmJpcnRoZGF0ZSA9IChpbnQodG9rZW5zWzJdKSwgaW50KHRva2Vuc1szXSksIGludCh0b2tlbnNbNF0pKQppc01hbGUgPSAodG9rZW5zWzVdID09ICdtYWxlJykKCnByaW50KCdIaSAnICsgZmlyc3ROYW1lICsgJyAnICsgbGFzdE5hbWUgKyA1KQ=="
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("Server Response: ", data.trace);
                this.traceTableStore.setTrace(data.trace);
            }).catch(error => {
                console.log(error)
        });
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