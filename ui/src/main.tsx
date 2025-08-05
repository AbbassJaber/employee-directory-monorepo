import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import './i18n/config';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 2000,
                        style: {
                            fontSize: '0.875rem',
                        },
                    }}
                />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
