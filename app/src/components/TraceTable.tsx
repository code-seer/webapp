import * as React from "react";
import {inject, observer} from "mobx-react";
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
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

    /**
     * Determine if cell call be highlighted. A cell can be highlighted
     * if the current value is different from the previous value;
     *
     * @param index
     * @param heading
     */
    canHighlight = (index: number, currLineNumIndex: number, heading: string, value: string) => {
        if (heading === "Line" || index !== currLineNumIndex) {
            // Do not highlight the Line column or any row that comes before the current row, i.e.
            // the current line number
            return false;
        }
        const prevIndex = currLineNumIndex - 1;
        if (prevIndex < 0 && value === "-") {
            // This is the first row. If a value has not been set yet, then we
            // should not highlight it.
            // Note: A first row item will always have a value of undefined because the
            // code would not have executed yet. It's only on the next row that it
            // could be highlighted (we're saying could because the variable might not
            // necessarily be instatiated until much later)
            return false;
        }
        if (index === currLineNumIndex && prevIndex >= 0 && value !== "-") {
            // Compare the previous value to the current value
            if (this.serializeValue(this.traceTableStore.table[heading][prevIndex])
                !== this.serializeValue(this.traceTableStore.table[heading][currLineNumIndex])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Serialize objects as strings so string comparisons return a valid result
     *
     * @param value
     */
    serializeValue = (value: any) => {
        if (value instanceof Array) {
            if (value.length > 0) {
                const type: string = value[0];
                const copy = [...value];
                switch (type) {
                    case "LIST":
                       return`[${copy.splice(2).join(",")}]`;
                    case "TUPLE":
                        return`(${copy.splice(2).join(",")})`;
                    case "DICT":
                        const dictValues = copy.splice(2)
                        let res = "";
                        dictValues.forEach(pair => {
                            const k = pair[0];
                            const v = pair[1];
                            if (res.length === 0) {
                                res = res + `${k}=${v}`;
                            } else {
                                res = res + `; ${k}=${v}`;
                            }
                        })
                        return `{${res}}`;
                    default:
                        return copy.toString();
                }
            }
        }
        return value === undefined ? "-" : value.toString();
    }

    hasException = (currLineNumIndex: number) => {
        if (currLineNumIndex === this.traceTableStore.exceptionLineNumIndex &&
        this.traceTableStore.exceptionMessage !== undefined) {
            return true;
        }
        return false;
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
                const hasException = this.hasException(index);
                let row = <tr key={rowKey}
                                className={`cell${hasException ? "-exception" : ""}`}>
                    {
                        allHeadings.map(heading => {
                            const entry = table[heading];
                            const key = heading + "-cell-" + index;
                            let value = this.serializeValue(entry[index]);
                            if (heading === "Line") {
                                value = "" + lineNum;
                            }
                            if (heading === "Output" && value.length === 0) {
                                value = "-"
                            }
                            if (heading !== "Line" && value !== "-") {
                                emptyRow = false;
                            }

                            let highlightCell = this.canHighlight(index, currLineNumIndex, heading, value);
                            if (highlightCell) {
                                return <td key={key} id={key}
                                           className={`cell${highlightCell ? "-highlighted" : ""}`}>{value}</td>;
                            } else {
                                return <td key={key} id={key}>{value}</td>;
                            }

                        })
                    }
                </tr>;
                if (hasException) {
                    const key = "exception-" + index;
                    row = <tr key={rowKey} className={`cell${hasException ? "-exception" : ""}`}>
                            <td key={key + "-line"} id={key + "-line"}>{lineNum}</td>
                            <td key={key} id={key} colSpan={this.traceTableStore.allHeadings.length - 1}>{this.traceTableStore.exceptionMessage}</td>
                    </tr>
                }
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