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
    currentLineNum: number = 1;

    MAX_LINE_NUM = 5;

    @observable
    table: {} = {
        Heading1: {
            1: "abc",
            2: "abc2",
            5: "abc4"
        },
        Heading2: {
            1: "xyz",
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
            3: true,
            4: true,
            5: true
        }
    };

    constructor() {
        makeObservable(this);
    }

    @action
    setTrace(newTrace: TraceTableItem[]) {
        console.log("updating trace: ", newTrace);
        this.trace = newTrace;
    }

    @action
    decrementLineNum() {
        this.currentLineNum--;
        if (this.currentLineNum < 1) {
            this.currentLineNum = 1;
        }
    }

    @action
    incrementLineNum() {
        this.currentLineNum++;
        if (this.currentLineNum > this.MAX_LINE_NUM) {
            this.currentLineNum = this.MAX_LINE_NUM;
        }
    }

}