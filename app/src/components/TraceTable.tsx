import * as React from "react";
import {inject, observer} from "mobx-react";
import {TraceTableStore, UserCodeStore} from "../store/Stores";

@inject('rootStore')
@observer
class TraceTable extends React.Component<any> {
    userCodeStore: UserCodeStore = this.props.rootStore.userCodeStore;
    traceTableStore: TraceTableStore = this.props.rootStore.traceTableStore;

    render() {
        return (
          <div className="trace-table-canvas">
              <div className="trace-table-placeholder">
                  { this.traceTableStore.data && <span> {this.traceTableStore.data} </span> }
                      {!this.traceTableStore.data && <span>No data to visualize</span> }
              </div>
          </div>
        );
    }
}

export default TraceTable;