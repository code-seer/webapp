import {observable, action, makeObservable, computed} from 'mobx';

export interface TraceTableItem {
    event: string | undefined,
    func_name: string | undefined,
    globals: {},
    heap: {},
    line: number | undefined,
    ordered_globals: [] | undefined,
    stack_locals: [] | undefined,
    stdout: string | undefined
}

export class UserCodeStore {

    @observable
    code: string = `# Python 2.7\nprint "Hello, World!"`;

    constructor() {
        makeObservable(this);
    }
}

export class TraceTableStore {

    @observable
    trace: TraceTableItem[]  | undefined;

    @observable
    currentLineNum: number = 0;

    MAX_LINE_NUM = 5;

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

    // All global headings
    @observable
    allHeadings =  ["Line", "Heading1", "Heading2", "Heading3", "Output"];

    @observable
    validLineNums = [1, 2, 4, 5];

    constructor() {
        makeObservable(this);
    }

    @action
    setTrace(newTrace: TraceTableItem[]) {
        this.trace = newTrace;
    }

    @action
    decrementLineNum() {
        this.currentLineNum--;
        // if currentLineNum is not a valid line number, decrement
        // until we arrive at a number that is valid
        while (!this.validLineNums.includes(this.currentLineNum)) {
            this.currentLineNum--;
            if (this.currentLineNum < 0) {
                this.currentLineNum = 0;
                break;
            }
        }

    }

    @action
    incrementLineNum() {
        this.currentLineNum++;
        while (!this.validLineNums.includes(this.currentLineNum)) {
            this.currentLineNum++;
            if (this.currentLineNum > this.MAX_LINE_NUM) {
                this.currentLineNum = this.MAX_LINE_NUM;
                break;
            }
        }

    }
}