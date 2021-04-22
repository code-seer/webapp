import * as React from "react";
import Row from "react-bootstrap/Row";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faPlay } from "@fortawesome/free-solid-svg-icons";
import {inject, observer} from "mobx-react";
import {TraceTableStore, UserCodeStore} from "../store/Stores";
import {configs} from "../util/config";

@inject('rootStore')
@observer
class EditorController extends React.Component<any> {
    userCodeStore: UserCodeStore = this.props.rootStore.userCodeStore;
    traceTableStore: TraceTableStore = this.props.rootStore.traceTableStore;

    encodedUserCode = () => {
        return new Buffer(this.userCodeStore.code).toString('base64');
    }

    onRun = () => {
        const url =  `${configs.scheme}://${configs.host}:${configs.port}/${configs.urls.visualizer}`;
        const body = {
            "language": this.userCodeStore.language,
            "user_code": this.encodedUserCode(),
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        console.log(body);
        console.log(requestOptions);
        this.userCodeStore.setResultPending();
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("Server Response: ", data.trace);
                this.traceTableStore.setTrace(data.trace);
                this.userCodeStore.setResultPending();
            }).catch(error => {
                console.log(error)
        });
    }

    onUpArrow = () => {
        this.traceTableStore.decrementLineNum();
        if (this.userCodeStore.aceEditorSession) {
            this.userCodeStore.aceEditorSession.gotoLine(this.traceTableStore.validLineNums[this.traceTableStore.currentLineNumIndex], 0, true);
        }
    }

    onDownArrow = () => {
        this.traceTableStore.incrementLineNum();
        if (this.userCodeStore.aceEditorSession) {
            this.userCodeStore.aceEditorSession.gotoLine(this.traceTableStore.validLineNums[this.traceTableStore.currentLineNumIndex], 0, true);
        }
    }

    render() {
        const codeEditorIsEmpty = this.userCodeStore.code.length === 0;
        const tableHasNoData = !this.traceTableStore.tableHasData;
        return (
            <div>
                <Row className="ace-editor-controller run">
                    <Button className="ace-editor-code-run-btn" variant="success"
                            onClick={() => {this.onRun()}} disabled={codeEditorIsEmpty}>
                        <FontAwesomeIcon icon={faPlay} fixedWidth />
                    </Button>{' '}
                </Row>
                <Row className="ace-editor-controller up">
                    <Button className="ace-editor-code-run-btn" variant="warning"
                            onClick={() => {this.onUpArrow()}} disabled={tableHasNoData}>
                        <FontAwesomeIcon icon={faChevronUp} fixedWidth />
                    </Button>{' '}
                </Row>
                <Row className="ace-editor-controller down">
                    <Button className="ace-editor-code-run-btn" variant="warning"
                            onClick={() => {this.onDownArrow()}} disabled={tableHasNoData}>
                        <FontAwesomeIcon icon={faChevronDown} fixedWidth />
                    </Button>{' '}
                </Row>

            </div>
        );
    }
}

export default EditorController;