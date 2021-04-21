import {observable, action, makeObservable, computed} from 'mobx';

export interface TraceTableItem {
    event: string | undefined,
    func_name: string | undefined,
    globals: {},
    line: number | undefined,
    locals: {},
    stdout: string | undefined
}

export class UserCodeStore {

    @observable
    code: string = `# Please type your code here
# Limitations:
# \t- Object Oriented Programming not supported
# \t- Function calls are not supported`;

    @observable
    language: string = "python27";

    @observable
    aceEditorSession: any | undefined;

    @observable
    resultPending: boolean = false;

    constructor() {
        makeObservable(this);
    }

    @action
    setLanguage(language: string) {
        this.language = language;
        console.log("New language: ", this.language);
    }

    @action
    setAceEditorSession(session: any) {
        this.aceEditorSession = session;
    }

    @action
    setResultPending() {
        this.resultPending = !this.resultPending;
    }
}

export class TraceTableStore {

    @observable
    trace: TraceTableItem[]  | undefined;

    @observable
    currentLineNum: number = 1;

    @observable
    maxLineNum = 0;

    @observable
    tables = {};
    table: {} = {
        Heading1: {
            1: "abc",
            5: "abc4"
        },
        Heading2: {
            2: "xyz",
        },
        Heading3: {
            5: "xyz2"
        },
        Output: {
            2: "hello",
            4: "world",
        },
        Line: {
            1: true,
            2: true,
            4: true,
            5: true
        }
    };

    @observable
    tableHasData: boolean = false;

    // All global headings
    @observable
    allHeadings: any[] =  [];

    @observable
    validLineNums = [1, 2, 4, 5];

    constructor() {
        makeObservable(this);
    }

    @action
    setTrace(newTrace: TraceTableItem[]) {
        this.trace = newTrace;
        this.setHeadings();
        this.setMaxLineNum();
        this.setTableHasData();
    }

    @action
    setTableHasData() {
        if (this.allHeadings.length > 0) {
            this.tableHasData = true;
        }
    }

    /**
     * Set the maximum line number
     */
    @action
    setMaxLineNum() {
        if (this.trace) {
            const lineNum = this.trace[this.trace.length-1].line;
            if (lineNum) {
                this.maxLineNum = lineNum;
            } else {
                this.maxLineNum = 0;
            }
        }
    }

    @action
    decrementLineNum() {
        this.currentLineNum--;
        if (this.currentLineNum < 0) {
            this.currentLineNum = 0;
        }
    }

    @action
    incrementLineNum() {
        this.currentLineNum++;
        if (this.currentLineNum > this.maxLineNum) {
            this.currentLineNum = this.maxLineNum;
        }
    }

    /**
     * Parse out all unique variable names to form table headings.
     *
     * @param newTrace
     */
    @action
    setHeadings() {
        const getKeys = (attributes) => {
            const keys = new Set();
            if (attributes) {
                Object.keys(attributes).map(key => {
                    keys.add(key);
                    return undefined;
                })
            }
            return keys;
        }
        const headings = new Set();
        this.trace?.map(it => {
            getKeys(it.globals).forEach(headings.add, headings);
        })
        const result: any[] = [];
        if (headings.size > 0) {
            result.push("Line");
            result.push(...Array.from(headings.values()).sort());
            result.push("Output");
        }
        return result;
    }
}