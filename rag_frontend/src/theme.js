import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#0ea5e9', // Electric blue
            light: '#38bdf8',
            dark: '#0284c7',
        },
        secondary: {
            main: '#06b6d4',
        },
        background: {
            default: '#000000', // Pure black
            paper: '#1a1a1a', // Dark gray for cards
        },
        text: {
            primary: '#ffffff',
            secondary: '#9ca3af', // Muted gray
        },
        divider: 'rgba(14, 165, 233, 0.12)',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 600,
            letterSpacing: '-0.02em',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.1rem',
        },
        subtitle1: {
            fontWeight: 600,
            fontSize: '0.95rem',
        },
        body1: {
            lineHeight: 1.7,
            fontSize: '0.95rem',
        },
        body2: {
            lineHeight: 1.6,
            fontSize: '0.875rem',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#1a1a1a',
                    borderRadius: 12,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: '#242424',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiBadge: {
            styleOverrides: {
                badge: {
                    borderRadius: 6,
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;
