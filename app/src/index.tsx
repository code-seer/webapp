import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import RootStore from "./store/RootStore";
import {Provider} from "mobx-react";

const rootStore = new RootStore();
ReactDOM.render(
  <React.StrictMode>
      <Provider rootStore={rootStore}>
          <App />
      </Provider>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
