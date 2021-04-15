import * as React from "react";
import {inject, observer} from "mobx-react";
import Table from 'react-bootstrap/Table';
import {TraceTableItem, TraceTableStore, UserCodeStore} from "../store/Stores";
import {set} from "mobx";

@inject('rootStore')
@observer
class TraceTable extends React.Component<any> {
    userCodeStore: UserCodeStore = this.props.rootStore.userCodeStore;
    traceTableStore: TraceTableStore = this.props.rootStore.traceTableStore;

    dataToTable = () => {
        const table = (
            <ul>
                {
                    this.traceTableStore.trace?.map((trace: TraceTableItem, index: number) => {
                        return <ul key={index}>
                            <li>Event: {trace.event}</li>
                            <li>Function: {trace.func_name}</li>
                            <li>Line No: {trace.line}</li>
                            <li>Globals: {trace.globals}</li>
                            <li>Heap: {trace.heap}</li>
                            {/*<li>Heap: {Object.keys(trace.heap).map((heapKey, index) => {*/}
                            {/*        return <ul key={heapKey}>*/}
                            {/*            {trace.heap[heapKey].map((item, idx) => <li key={idx}>{item}</li>)}*/}
                            {/*        </ul>*/}
                            {/*    }*/}
                            {/*)}</li>*/}
                            <li>Ordered Globals: {trace.ordered_globals?.map(og => <ul>
                                <li>{og}</li>
                            </ul>)} </li>
                            <li>Output: {trace.stdout}</li>
                        </ul>;
                    })

                }
            </ul>
        )
        return table;
    }

    getTableHeader = (index: number) => {
        let header: any[] | undefined;
        if (this.traceTableStore.trace) {
            const globals = new Set();
            this.traceTableStore.trace.forEach((item: TraceTableItem) => {
                if (item.ordered_globals) {
                    item.ordered_globals.forEach(it => globals.add(it))
                }
            })
            const orderGlobals: any[] = [];
            orderGlobals.push("Line");
            orderGlobals.push(...Array.from(globals.values()).sort());
            orderGlobals.push("Output")
            header = orderGlobals?.map((og: any) => <th key={index}>{og}</th>)
        }
        console.log("header:  ", header)
        return header;
    }

    render() {
        console.log("trace table in render: " , this.traceTableStore.trace);
        // const table = this.dataToTable();
        return (
          <div className="trace-table-canvas">
              <Table responsive="lg">
                  <thead>
                  <tr>
                      {this.getTableHeader(0)}
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                      <td>1</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                  </tr>
                  <tr>
                      <td>2</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                  </tr>
                  <tr>
                      <td>3</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                      <td>Table cell</td>
                  </tr>
                  </tbody>
              </Table>
              <div className="trace-table-placeholder">
                  {/*<ul>*/}
                  {/*    {*/}
                  {/*        this.traceTableStore.trace?.map((trace: TraceTableItem, index: number) => {*/}
                  {/*            return <ul key={index}>*/}
                  {/*                <li>Event: {trace.event}</li>*/}
                  {/*                <li>Function: {trace.func_name}</li>*/}
                  {/*                <li>Line No: {trace.line}</li>*/}
                  {/*                /!*<li>Globals: {Object.keys(trace.globals).map((globalKey, index) => {*!/*/}
                  {/*                /!*        return <ul key={globalKey}>*!/*/}
                  {/*                /!*            {trace.globals[globalKey].map((item, idx) => <li key={idx}>{item}</li>)}*!/*/}
                  {/*                /!*        </ul>*!/*/}
                  {/*                /!*    }*!/*/}
                  {/*                /!*)}</li>*!/*/}
                  {/*                <li>Heap: {Object.keys(trace.heap).map((heapKey, index) => {*/}
                  {/*                        return <ul key={heapKey}>*/}
                  {/*                            {trace.heap[heapKey].map((item, idx) => <li key={idx}>{item}</li>)}*/}
                  {/*                        </ul>*/}
                  {/*                    }*/}
                  {/*                )}</li>*/}
                  {/*                <li>Ordered Globals: {trace.ordered_globals?.map(og => <ul>*/}
                  {/*                    <li>{og}</li>*/}
                  {/*                </ul>)} </li>*/}
                  {/*                <li>Output: {trace.stdout}</li>*/}
                  {/*            </ul>;*/}
                  {/*        })*/}

                  {/*    }*/}
                  {/*</ul>*/}
                  {/*{!this.traceTableStore.trace && <span>No data to visualize</span> }*/}
              </div>
          </div>
        );
    }
}

export default TraceTable;