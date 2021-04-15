import {observable, action} from 'mobx';
import RootStore from "./RootStore";

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
    rootStore: RootStore

    @observable
    code: string = `# Python 2.7\nprint "Hello, World!"`;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
    }
}

export class TraceTableStore {
    rootStore: RootStore

    @observable
    trace: TraceTableItem[]  | undefined

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
    }

    @action
    setTrace(newTrace: TraceTableItem[]) {
        console.log("updating trace: ", newTrace);
        this.trace = newTrace;
    }
}