import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app';
import { mainTheme } from './styles';
import { AppConfiguration } from './types';
import { AudioContext, makeAudio } from './utils';

const serverUrl = 'https://minair.me';

const config:AppConfiguration = {
    serverUrl
};

const mainAudio = makeAudio(() => {});

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <AudioContext.Provider value={mainAudio}>
                <ThemeProvider theme={mainTheme}>
                    <App config={config} />
                </ThemeProvider>
            </AudioContext.Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
