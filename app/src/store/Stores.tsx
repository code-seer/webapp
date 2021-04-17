import {observable, action, makeObservable} from 'mobx';

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

    constructor() {
        makeObservable(this);
    }

    @action
    setTrace(newTrace: TraceTableItem[]) {
        console.log("updating trace: ", newTrace);
        this.trace = newTrace;
    }
}