import {observable, action, makeObservable} from 'mobx';

export interface TraceTableItem {
    event: string,
    func_name: string,
    globals: {},
    line: number,
    locals: {},
    exception_msg: string | undefined,
    stdout: string | undefined
}

export class UserCodeStore {

    @observable
    code: string = `# Please type your code here
# Limitations:
# \t- Object Oriented Programming not supported
# \t- Function calls are not supported

# Sample code
# Hit Play to execute
words = 'John,Doe,1984,4,1,male'

tokens = words.split(',')
first_name = tokens[0]
last_name = tokens[1]
birth_date = (int(tokens[2]), int(tokens[3]), int(tokens[4]))
is_male = (tokens[5] == 'male')

print('Hi ' + first_name + ' ' + last_name)`;

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
    currentLineNumIndex: number = -1;

    @observable
    maxLineNumIndex = 0;

    @observable
    minLineNumIndex = 0;

    @observable
    exceptionLineNumIndex: number = -1;

    @observable
    exceptionMessage: string | undefined;

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
        this.setTable();
        this.setHeadings();
        this.setValidLineNums();
        this.setMaxLineNumIndex();
        this.setTableHasData();
        this.setException();
    }

    @action
    reset() {
        this.trace = [];
        this.allHeadings = [];
        this.maxLineNumIndex = 0;
        this.minLineNumIndex = 0;
        this.currentLineNumIndex = -1;
        this.exceptionLineNumIndex = -1;
        this.exceptionMessage = undefined;
        this.table = {};
        this.tableHasData = false;
        this.allHeadings = [];
        this.validLineNums = [];
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
        const newTable = {};
        if (this.trace) {
            this.trace.forEach((it, index) => {
                    if (it.event === "exception" || it.event === "uncaught_exception") {
                        if (!newTable["Line"]) {
                            newTable["Line"] = {};
                        }
                        if (!newTable["Output"]) {
                            newTable["Output"] = {};
                        }
                        newTable["Line"][index] = true;
                    } else {
                        if (Object.keys(it.globals).length > 0) {
                            Object.keys(it.globals).forEach(global => {
                                if (!newTable[global]) {
                                    newTable[global] = {};
                                }
                                newTable[global][index] = it.globals[global];
                            });
                        }
                        if (!newTable["Line"]) {
                            newTable["Line"] = {};
                        }
                        if (!newTable["Output"]) {
                            newTable["Output"] = {};
                        }
                        newTable["Line"][index] = true;
                        newTable["Output"][index] = it.stdout;
                    }
            })
        }
        this.table = newTable;
    }

    @action
    setTableHasData() {
        this.tableHasData = Object.keys(this.table).length > 0;
    }

    /**
     * Set max line number index for this trace. We're looking at the index number
     * of the line number in validLineNums because a line number might be all over the
     * place if there are function calls or it's an OOP program.
     */
    @action
    setMaxLineNumIndex() {
        if (this.validLineNums) {
            this.maxLineNumIndex = this.validLineNums.length - 1;
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
        this.currentLineNumIndex--;
        if (this.currentLineNumIndex < 0) {
            this.currentLineNumIndex = -1;
        }
    }

    @action
    incrementLineNum() {
        this.currentLineNumIndex++;
        if (this.currentLineNumIndex > this.maxLineNumIndex) {
            this.currentLineNumIndex = this.maxLineNumIndex;
        }
    }

    /**
     * Parse out all unique variable names to form table headings.
     *
     * @param newTrace
     */
    @action
    setHeadings() {
        const allHeadings = {};
        const getKeys = (attributes) => {
            // Use an array to maintain the order in which the variables appear
            const keys: any[] = [];
            if (attributes) {
                Object.keys(attributes).forEach(key => {
                    if (allHeadings[key] === undefined) {
                        keys.push(key);
                        allHeadings[key] = true
                    }
                })
            }
            return keys;
        }
        const headings: any[] = [];
        this.trace?.forEach(it => {
            headings.push(...getKeys(it.globals))
        })
        const result: any[] = [];
        result.push("Line");
        result.push(...headings);
        result.push("Output");
        this.allHeadings = result;
    }

    @action
    setException() {
        this.trace?.forEach((it, index) => {
            if (it.event === "exception" || it.event === "uncaught_exception") {
                this.exceptionLineNumIndex = index;
                this.exceptionMessage = it.exception_msg;
            }
        })
    }
}