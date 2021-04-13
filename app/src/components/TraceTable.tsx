import * as React from "react";

class TraceTable extends React.Component<any> {
    render() {
        return (
          <div className="trace-table-canvas">
              <div className="trace-table-placeholder">
                  <span>No data to visualize</span>
              </div>
          </div>
        );
    }
}

export default TraceTable;