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
    trace: TraceTableItem[]  | undefined

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

}