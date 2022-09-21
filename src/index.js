import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './app/components/App/App';
import GlobalStyle from "./app/styled/global";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <>
        <App/>
        <GlobalStyle/>
    </>
);
