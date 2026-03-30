import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
    palette: {
        primary: {
            main: '#1e40af', // Professional blue
            light: '#3b82f6',
            dark: '#1e3a8a',
        },
        secondary: {
            main: '#64748b', // Slate gray
            light: '#94a3b8',
            dark: '#475569',
        },
        success: {
            main: '#10b981', // Emerald
        },
        warning: {
            main: '#f59e0b', // Amber
        },
        error: {
            main: '#ef4444', // Red
        },
        background: {
            default: '#f8fafc', // Very light blue-gray
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a', // Deep blue-black
            secondary: '#64748b', // Slate gray
        },
    },
    typography: {
        fontFamily: [
            '"Inter"',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '3rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: '2.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h3: {
            fontSize: '1.875rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1.125rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            fontWeight: 400,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
            fontWeight: 400,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.875rem',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            defaultProps: {
                className: 'rounded-xl px-4 py-3 font-black text-xs tracking-widest uppercase shadow-sm transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3',
            },
            styleOverrides: {
                root: {
                    fontFamily: '"Inter", sans-serif',
                    '&:hover': {
                        boxShadow: '0 4px 12px -2px rgba(30, 64, 175, 0.15)',
                    },
                },
                contained: {
                    backgroundColor: '#1e40af', // bg-primary
                    color: '#ffffff',
                    border: '2px solid transparent',
                    '&:hover': {
                        backgroundColor: '#1e3a8a', // bg-primary-dark
                        transform: 'translateY(-2px)',
                    },
                },
                containedPrimary: {
                    border: '2px solid #f1f5f9', // border-slate-100 equivalent for primary
                },
                outlined: {
                    border: '2px solid #e2e8f0', // border-2 border-slate-200
                    backgroundColor: '#ffffff', // bg-white
                    color: '#0f172a', // text-slate-900 (adjusted for outlined contrast)
                    '&:hover': {
                        backgroundColor: '#f8fafc',
                        borderColor: '#1e40af', // hover:border-primary
                        color: '#1e40af', // hover:text-primary
                    },
                },
                text: {
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    border: 'none',
                    '&:hover': {
                        backgroundColor: 'rgba(30, 64, 175, 0.04)',
                        boxShadow: 'none',
                    }
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        borderColor: '#cbd5e1',
                    },
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    '@media (min-width: 1200px)': {
                        maxWidth: 1400,
                    },
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    '& .MuiTableHead-root': {
                        backgroundColor: '#f1f5f9',
                        '& th': {
                            fontWeight: 600,
                            color: '#0f172a',
                            borderBottom: '2px solid #e2e8f0',
                        },
                    },
                    '& .MuiTableBody-root tr:hover': {
                        backgroundColor: '#f8fafc',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;
