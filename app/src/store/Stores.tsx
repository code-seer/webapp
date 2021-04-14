import {observable, computed} from 'mobx';
import RootStore from "./RootStore";

export class UserCodeStore {
    rootStore: RootStore
    @observable code: string = `# Python 2.7\nprint "Hello, World!"`;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
    }
}

export class TraceTableStore {
    rootStore: RootStore
    @observable data: any = ""

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
    }
}