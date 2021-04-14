import {UserCodeStore} from "./Stores";

export default class RootStore {
    userCodeStore: UserCodeStore

    constructor() {
        this.userCodeStore = new UserCodeStore(this)
    }
}

