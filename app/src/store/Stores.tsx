import {observable, computed} from 'mobx';
import RootStore from "./RootStore";

export class UserCodeStore {
    rootStore: RootStore
    @observable code: String = ""

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
    }
}