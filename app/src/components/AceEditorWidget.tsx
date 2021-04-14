import * as React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import {observer, inject} from 'mobx-react';


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
    "python": "Python 2.7",
}

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
const defaultValue = `# Python 2.7
print "Hello, World!"`;

@inject('rootStore')
@observer
class AceEditorWidget extends React.Component<any> {
    userCodeStore: UserCodeStore = this.props.rootStore.userCodeStore;
    state = {
        value: defaultValue,
        placeholder: "",
        theme: "xcode",
        mode: "python",
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        fontSize: 18,
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
        this.setState({
            value: newValue
        });
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
        return (
            <div className="ace-editor">
                <AceEditor
                    placeholder={this.state.placeholder}
                    height={'90vh'}
                    width={'650px'}
                    mode={this.state.mode}
                    theme={this.state.theme}
                    name="editor"
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