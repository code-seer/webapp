import * as React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import {observer, inject} from 'mobx-react';
import Form from 'react-bootstrap/Form'


import "ace-builds/src-noconflict/mode-jsx";
import {UserCodeStore} from "../store/Stores";
const languages = [
    "javascript",
    "java",
    "python",
    "xml",
    "ruby",
    "sass",
    "markdown",
    "mysql",
    "json",
    "html",
    "handlebars",
    "golang",
    "csharp",
    "elixir",
    "typescript",
    "css"
];

const languageMap = {
    "python27": "Python 2.7",
    "python37": "Python 3.7",
    "java": "Java"
};
const reverseLanguageMap = {};
Object.keys(languageMap).map(languageKey => {
    reverseLanguageMap[languageMap[languageKey]] = languageKey;
    return undefined;
});


const themes = [
    "monokai",
    "github",
    "tomorrow",
    "kuroir",
    "twilight",
    "xcode",
    "textmate",
    "solarized_dark",
    "solarized_light",
    "terminal"
];

languages.forEach(lang => {
    require(`ace-builds/src-noconflict/mode-${lang}`);
    require(`ace-builds/src-noconflict/snippets/${lang}`);
});

themes.forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`));

@inject('rootStore')
@observer
class AceEditorWidget extends React.Component<any> {
    userCodeStore: UserCodeStore = this.props.rootStore.userCodeStore;
    state = {
        value: this.userCodeStore.code,
        placeholder: "",
        theme: "xcode",
        mode: "python",
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        fontSize: 15,
        showGutter: true,
        showPrintMargin: true,
        highlightActiveLine: true,
        enableSnippets: false,
        showLineNumbers: true
    };

    onLoad = () => {
        // console.log("i've loaded");
    }
    onChange = (newValue: any) => {
        this.userCodeStore.code = newValue;
        console.log("new code: " + this.userCodeStore.code)
        this.setState({
            value: newValue
        });
    }

    onLanguageSelect = (event: any) => {
        event.preventDefault();
        this.userCodeStore.setLanguage(reverseLanguageMap[event.target.value]);

    }

    onSelectionChange = (newValue: any, event: any) => {
        // console.log("select-change", newValue);
        // console.log("select-change-event", event);
    }

    onCursorChange = (newValue: any, event: any) => {
        // console.log("cursor-change", newValue);
        // console.log("cursor-change-event", event);
    }

    onValidate = (annotations: any) => {
        // console.log("onValidate", annotations);
    }

    setPlaceholder(e) {
        this.setState({
            placeholder: e.target.value
        });
    }
    setTheme(e) {
        this.setState({
            theme: e.target.value
        });
    }
    setMode(e) {
        this.setState({
            mode: e.target.value
        });
    }
    setBoolean(name, value) {
        this.setState({
            [name]: value
        });
    }
    setFontSize(e) {
        this.setState({
            fontSize: parseInt(e.target.value, 10)
        });
    }

    render() {
        const variant = "Info";
        return (
            <div className="ace-editor">
                <div className="ace-dropdown">
                    <Form>
                        <Form.Group controlId="languageDropdownForm">
                            {/*<Form.Label>Example select</Form.Label>*/}
                            <Form.Control as="select" custom onChange={this.onLanguageSelect}>
                                {
                                    Object.keys(languageMap).map(language =>
                                        <option key={language}>{languageMap[language]}</option>)
                                }
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </div>
                <AceEditor
                    placeholder={this.state.placeholder}
                    height={'90vh'}
                    width={'100%'}
                    mode={this.state.mode}
                    theme={this.state.theme}
                    name="ace-editor"
                    onLoad={this.onLoad}
                    onChange={this.onChange}
                    onSelectionChange={this.onSelectionChange}
                    onCursorChange={this.onCursorChange}
                    onValidate={this.onValidate}
                    value={this.state.value}
                    fontSize={this.state.fontSize}
                    showPrintMargin={this.state.showPrintMargin}
                    showGutter={this.state.showGutter}
                    highlightActiveLine={this.state.highlightActiveLine}
                    setOptions={{
                        useWorker: false,
                        enableBasicAutocompletion: this.state.enableBasicAutocompletion,
                        enableLiveAutocompletion: this.state.enableLiveAutocompletion,
                        enableSnippets: this.state.enableSnippets,
                        showLineNumbers: this.state.showLineNumbers,
                        tabSize: 2
                    }}
                />
            </div>
        );
    }


}

export default AceEditorWidget;