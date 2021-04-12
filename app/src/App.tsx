
import * as React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarInstance from "./components/NavbarInstance";

class App extends React.Component<any, any> {
    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.state = {
            activeKey: null
        };
    }
    handleSelect(eventKey: any) {
        this.setState({
            activeKey: eventKey
        });
    }

    render() {
      const { activeKey } = this.state;

    return (
        <div className="nav-wrapper">
            <NavBarInstance activeKey={activeKey} onSelect={this.handleSelect} />
        </div>
    );
  }
}

export default App;
