import * as React from "react";
import {inject, observer} from "mobx-react";
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner'
import {TraceTableStore, UserCodeStore} from "../store/Stores";

@inject('rootStore')
@observer
class TraceTable extends React.Component<any> {
    private userCodeStore: UserCodeStore = this.props.rootStore.userCodeStore;
    private traceTableStore: TraceTableStore = this.props.rootStore.traceTableStore;
    state = {
        intervalId: undefined,
        highlightCell: true
    }

    componentWillUnmount() {
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId)
        }
    }

    getTable = (currLineNumIndex: number) => {
        const table: {} = this.traceTableStore.table;
        const allHeadings = this.traceTableStore.allHeadings;
        const rows = () => {
            const rowsToRender: any[] = [];
            let index = 0;
            while (index <= currLineNumIndex) {
                const lineNum = this.traceTableStore.validLineNums[index];
                let emptyRow: boolean = true;
                const rowKey = "row-" + index;
                const row = <tr key={rowKey}>
                    {
                        allHeadings.map(heading => {
                            const entry = table[heading];
                            const key = heading + "-cell-" + index;
                            let value = entry[index] === undefined ? "-" : entry[index];
                            let highlightCell = true;
                            if (heading === "Line") {
                                value = "" + lineNum;
                                highlightCell = false;
                            }
                            if (value !== "-") {
                                emptyRow = false;
                            }
                            if (highlightCell && index === currLineNumIndex && value !== "-") {
                                return <td key={key} id={key}
                                           className={`cell${this.state.highlightCell ? "-highlighted" : ""}`}>{value}</td>;
                            } else {
                                return <td key={key} id={key}>{value}</td>;
                            }

                        })
                    }
                </tr>;
                rowsToRender.push(row);
                index++;
            }
            return rowsToRender;
        };

        return (
            <Table responsive="lg" className="learnet-table">
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
        console.log("this.traceTableStore.currentLineNumIndex: ", this.traceTableStore.currentLineNumIndex);
        const tableHasData = this.traceTableStore.tableHasData;
        return (
          <div className="trace-table-canvas">
              {tableHasData && this.getTable(this.traceTableStore.currentLineNumIndex)}
              {!tableHasData &&
              <div className="trace-table-placeholder">
                  { this.userCodeStore.resultPending &&
                  <Spinner animation="border" variant="warning" />
                  }
                  {
                      !this.userCodeStore.resultPending &&
                      <span>No data to visualize</span>
                  }
              </div>
              }
          </div>
        );
    }
}

export default TraceTable;