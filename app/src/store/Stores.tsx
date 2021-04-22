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
    minLineNum = 0;

    @observable
    exceptionLineNumber: number = 0;

    @observable
    table: {} = {};

    @observable
    tableHasData: boolean = false;

    // All global headings
    @observable
    allHeadings: any[] =  [];

    @observable
    validLineNums: number[] = [];

    constructor() {
        makeObservable(this);
    }

    @action
    setTrace(newTrace: TraceTableItem[]) {
        this.trace = newTrace;
        this.setHeadings();
        this.setTable();
        this.setMaxLineNum();
        this.setTableHasData();
    }

    /**
     * Parse the stack trace and create a map that has the following
     * structure:
     *      table: {} = {
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
    }
     */
    @action
    setTable() {
        console.log("this.trace: ", this.trace?.values());
        console.log("this.allheadings: ", this.allHeadings.values());
        const newTable = {};
        if (this.trace && this.allHeadings) {
            this.trace.forEach(it => {
                if (Object.keys(it.globals).length > 0) {
                    Object.keys(it.globals).forEach(global => {
                        if (!newTable[global]) {
                            newTable[global] = {};
                        }
                        newTable[global][it.line] = it.globals[global];
                    });
                    if (!newTable["Line"]) {
                        newTable["Line"] = {};
                    }
                    if (!newTable["Output"]) {
                        newTable["Output"] = {};
                    }
                    newTable["Line"][it.line] = true;
                    newTable["Output"][it.line] = it.stdout;
                }
            })
        } else {
            console.log("Unable to set table");
        }
        this.table = newTable;
        console.log("Final table json: ", this.table);

    }

    @action
    setTableHasData() {
        if (this.allHeadings.length > 0) {
            this.tableHasData = true;
        }
    }

    /**
     * Set max line number for this trace
     */
    @action
    setMaxLineNum() {
        if (this.trace) {
            const lineNums = this.trace.map(it => Number(it.line)).sort();
            if (lineNums) {
                this.maxLineNum = lineNums[lineNums.length - 1];
            }
        }
    }

    /**
     * Set min line number for this trace
     */
    @action
    setMinLineNum() {
        if (this.trace) {
            const lineNums = this.trace.map(it => Number(it.line)).sort();
            if (lineNums) {
                this.minLineNum = lineNums[0];
            }
        }
    }

    /**
     * Determine all valid line numbers from the stack trace. Line
     * numbers should not be sorted since it's perfectly valid for the
     * numbers to not be monotonically increasing.
     */
    @action
    setValidLineNums() {
        this.trace?.map(it => {
            const lineNum = it.line;
            if (lineNum) {
                this.validLineNums.push(lineNum);
            }
        })
    }

    @action
    decrementLineNum() {
        this.currentLineNum--;
        if (this.currentLineNum < this.minLineNum) {
            this.currentLineNum = this.minLineNum;
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
                Object.keys(attributes).forEach(key => {
                    keys.add(key);
                })
            }
            return keys;
        }
        const headings = new Set();
        this.trace?.forEach(it => {
            const newHeadings = getKeys(it.globals);
            newHeadings.forEach(item => {
                headings.add(item);
            })
        })
        console.log("New headings: ", headings);
        const result: any[] = [];
        if (headings.size > 0) {
            result.push("Line");
            result.push(...Array.from(headings.values()).sort());
            result.push("Output");
        }
        console.log("headings result: ", result);
        this.allHeadings = result;
    }
}