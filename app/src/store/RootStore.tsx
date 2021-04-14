import {TraceTableStore, UserCodeStore} from "./Stores";

export default class RootStore {
    userCodeStore: UserCodeStore;
    traceTableStore: TraceTableStore;

    constructor() {
        this.userCodeStore = new UserCodeStore(this);
        this.traceTableStore = new TraceTableStore(this);
    }
}

