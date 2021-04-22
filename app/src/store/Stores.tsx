import {observable, action, makeObservable} from 'mobx';

export interface TraceTableItem {
    event: string,
    func_name: string,
    globals: {},
    line: number,
    locals: {},
    stdout: string | undefined
}

export class UserCodeStore {

    @observable
    code: string = `# Please type your code here
# Limitations:
# \t- Object Oriented Programming not supported
# \t- Function calls are not supported

input = 'John,Doe,1984,4,1,male'

tokens = input.split(',')
firstName = tokens[0]
lastName = tokens[1]
birthdate = (int(tokens[2]), int(tokens[3]), int(tokens[4]))
isMale = (tokens[5] == 'male')

print('Hi ' + firstName + ' ' + lastName)`;

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
    currentLineNumIndex: number = 0;

    @observable
    maxLineNumIndex = 0;

    @observable
    minLineNumIndex = 0;

    @observable
    exceptionLineNuM: number = 0;

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
        this.setValidLineNums();
        this.setTable();
        this.setMaxLineNumIndex();
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
            this.trace.forEach((it, index) => {
                if (Object.keys(it.globals).length > 0) {
                    Object.keys(it.globals).forEach(global => {
                        if (!newTable[global]) {
                            newTable[global] = {};
                        }
                        newTable[global][index] = it.globals[global];
                    });
                    if (!newTable["Line"]) {
                        newTable["Line"] = {};
                    }
                    if (!newTable["Output"]) {
                        newTable["Output"] = {};
                    }
                    newTable["Line"][index] = true;
                    newTable["Output"][index] = it.stdout; // todo: this overwrites duplicate line nums
                }
            })
        } else {
            console.log("Unable to set table");
        }
        this.table = newTable;
    }

    @action
    setTableHasData() {
        if (this.allHeadings.length > 0) {
            this.tableHasData = true;
        }
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
        console.log("max line num index: ", this.maxLineNumIndex);
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
            this.currentLineNumIndex = 0;
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