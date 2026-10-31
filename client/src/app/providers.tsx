'use client';

import { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { mainTheme, globalStyles } from '../styles';
import AppShell from '../components/app';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={mainTheme}>
                <GlobalStyles styles={globalStyles} />
                <AppShell>{children}</AppShell>
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
