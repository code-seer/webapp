import * as React from "react";
import {inject, observer} from "mobx-react";
import {TraceTableStore, UserCodeStore} from "../store/Stores";

@inject('rootStore')
@observer
class TraceTable extends React.Component<any> {
    userCodeStore: UserCodeStore = this.props.rootStore.userCodeStore;
    traceTableStore: TraceTableStore = this.props.rootStore.traceTableStore;

    dataToTable = () => {
        const table = (
            <ul>
                {
                    this.traceTableStore.data.trace.map((event, index) =>
                        <ul key={index}>
                            <li>Event: {event.event}</li>
                            <li>Function: {event.func_name}</li>
                            <li>Line No: {event.line}</li>
                            <li>Globals: </li>
                            <li>Heap: {Object.keys(event.heap).map((heapKey, index) => {
                                return <ul key={heapKey}>
                                    {event.heap[heapKey].map((item, idx) => <li key={idx}>{item}</li>)}
                                </ul>
                                }
                            )}</li>
                            <li>Ordered Globals: {event.ordered_globals.map(og => <ul><li>{og}</li></ul>)} </li>
                            <li>Output: {event.stdout}</li>
                        </ul>)

                }
            </ul>
        )
        return table;
    }

    render() {
        console.log(this.traceTableStore.data.trace);
        const table = this.dataToTable();
        return (
          <div className="trace-table-canvas">
              <div className="trace-table-placeholder">
                  { table }
                  {!this.traceTableStore.data && <span>No data to visualize</span> }
              </div>
          </div>
        );
    }
}

export default TraceTable;