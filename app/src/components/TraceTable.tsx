import * as React from "react";
import {inject, observer} from "mobx-react";
import Table from 'react-bootstrap/Table';
import {TraceTableStore, UserCodeStore} from "../store/Stores";

@inject('rootStore')
@observer
class TraceTable extends React.Component<any> {
    userCodeStore: UserCodeStore = this.props.rootStore.userCodeStore;
    traceTableStore: TraceTableStore = this.props.rootStore.traceTableStore;

    getTable = (line: number) => {
        const table: {} = this.traceTableStore.table;
        const allHeadings = this.traceTableStore.allHeadings;
        const rows = () => {
            const validLinesToRender: any[] = Object.keys(table["Line"])
                .sort()
                .filter(key => Number(key) <= line);
            const rowsToRender: any[] = validLinesToRender.map(currRow => {
                    let emptyRow: boolean = true;
                    const rowKey = "row-" + currRow;
                    const row = <tr key={rowKey}>
                        {
                            allHeadings.map(heading => {
                                const entry = table[heading];
                                const key = heading + "-cell-" + currRow;
                                let value = entry[currRow] === undefined ? "-" : entry[currRow];
                                if (heading == "Line") {
                                    value = "" + currRow;
                                }
                                if (value !== "-") {
                                    emptyRow = false;
                                }
                                return <td key={key}>{value}</td>;
                            })
                        }
                    </tr>
                    if (!emptyRow) {
                        return row;
                    }
                    return undefined;
                })
                .filter(newRow => newRow !== undefined)
            return rowsToRender;
        };

        return (
            <Table responsive="lg">
                <thead>
                <tr>
                    {this.traceTableStore.allHeadings.map(heading => {
                        return <th key={heading}>{heading}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {
                    rows()
                }
                </tbody>
            </Table>
        );
    }

    render() {
        console.log("trace table in render: " , this.traceTableStore.trace);
        console.log("this.traceTableStore.currentLineNum: ", this.traceTableStore.currentLineNum);
        return (
          <div className="trace-table-canvas">
              {this.getTable(this.traceTableStore.currentLineNum)}
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