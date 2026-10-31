import { alpha, createTheme, Theme } from '@mui/material/styles';
import { CSSObject } from '@emotion/react';

const defaultTheme = createTheme();
const purpleAir = 'rgb(170, 68, 170)';
const purpleAirTr = 'rgba(170, 68, 170, 0.8)';

export const mainTheme = createTheme({
    palette: {
        primary: {
            main: purpleAir,
        },
        secondary: {
            main: '#11cb5f',
        },
    },
    breakpoints: { values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 } },
    components: {
        MuiToolbar: {
            styleOverrides: {
                gutters: {
                    [defaultTheme.breakpoints.up('sm')]: { paddingLeft: '12px', paddingRight: '12px' }
                }
            }
        },
        MuiCardContent: {
            styleOverrides: { root: { '&:last-child': { paddingBottom: '16px' } } }
        },
        MuiTableCell: {
            styleOverrides: { root: { borderBottom: 'none !important', padding: '4px', fontSize: '1rem' } }
        },
        MuiButton: { defaultProps: { color: 'inherit' } }
    }
});

export const aqiAlpha = 0.25;
const aqiAlpha2 = 0.5;
const aqiAlpha3 = 0.35;

export const candyBlue = `rgba(255,0,255,${aqiAlpha})`;
export const candyRed = `rgba(0,255,255,${aqiAlpha})`;

export const candyGradient = `linear-gradient(158deg, ${candyBlue} 0%,  ${candyRed} 80%)`;
export const candyGradient2 = `linear-gradient(158deg, rgba(255,0,255,${aqiAlpha2}) 0%, rgba(0,255,255,${aqiAlpha2}) 80%)`;
export const candyGradient3 = 'linear-gradient(158deg, rgb(255,0,255) 0%, rgba(0,255,255) 80%)';

export const lightGreen = `rgba(0, 224, 0, ${aqiAlpha3})`;
export const yellow = `rgba(255, 255, 0, ${aqiAlpha3})`;
export const orange = `rgba(255, 118, 0, ${aqiAlpha3})`;
export const red = `rgba(255, 0, 0, ${aqiAlpha3})`;
export const burgundy = `rgba(153, 0, 73, ${aqiAlpha3})`;
export const purple = `rgba(126, 0, 35, ${aqiAlpha3})`;
export const solidAqiColors = ['#00e000', '#ffff00', '#ff7600', '#ff0000', '#990049', '#7e0023'];
export const historyAqiColors = solidAqiColors.map(color => alpha(color, 0.85));
export const historySurfaceBackground = 'rgba(255, 255, 255, 0.85)';

const purpleAirTransparent = `rgba(170, 68, 170, ${aqiAlpha2})`;

const containerPadding = '40px';

export const styles = (theme: Theme) => ({
    root: {
        flexGrow: 1,
        color: 'white'
    },
    '@keyframes minair-fadeIn': {
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        }
    },
    scrollToTop: {
        position: 'fixed',
        bottom: '45px',
        right: '0.5rem',
        animation: 'minair-fadeIn 700ms ease-in-out 1s both',
        cursor: 'pointer',
        zIndex: 1
    },

    bold: {
        fontWeight: 700
    },

    whiteBox: {
        '& h1': {
            color: 'white'
        },
        '& h2': {
            color: 'white'
        },
        '& h3': {
            color: 'white'
        },
        '& span': {
            color: 'white'
        },
        '& p': {
            color: 'white'
        },
        '& div': {
            color: 'white'
        },
        '& li.minair-yellowFull': {
            '& p': {
                color: 'black !important'
            }
        },
        '& th': {
            color: 'white'
        },
        '& td': {
            color: 'white'
        }
    },
    lightGreen: {
        backgroundColor: `rgba(0, 224, 0, ${aqiAlpha})`
    },
    yellow: {
        backgroundColor: `rgba(255, 255, 0, ${aqiAlpha})`,
    },
    orange: {
        backgroundColor: `rgba(255, 118, 0, ${aqiAlpha})`,
    },
    red: {
        backgroundColor: `rgba(255, 0, 0, ${aqiAlpha})`,
    },
    burgundy: {
        backgroundColor: `rgba(153, 0, 73, ${aqiAlpha})`,
    },
    purple: {
        backgroundColor: `rgba(126, 0, 35, ${aqiAlpha})`
    },
    lightGreenFull: {
        backgroundColor: 'rgba(0, 224, 0, 1)'
    },
    yellowFull: {
        backgroundColor: 'rgba(255, 255, 0, 1)'
    },
    orangeFull: {
        backgroundColor: 'rgba(255, 118, 0, 1)'
    },
    redFull: {
        backgroundColor: 'rgba(255, 0, 0, 1)',
    },
    burgundyFull: {
        backgroundColor: 'rgba(153, 0, 73, 1)',
    },
    purpleFull: {
        backgroundColor: 'rgba(126, 0, 35, 1)'
    },

    logo: {
        width: '100%',
        display: 'inline-block',
    },
    logo2: {
        width: '100%',
        display: 'inline-block',
        position: 'absolute'
    },
    appHeader: {
        backgroundColor: 'transparent',
        padding: 0
    },
    toolBar: {
        justifyContent: 'space-evenly'
    },

    timeStamp: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        width: '100%',
        fontWeight: 500
    },
    cardContainer: {
        backgroundColor: 'rgba(0,0,0,0)'
    },
    cardBubble: {
        borderRadius: '60px',
        boxShadow: '0 14px 28px rgb(0 0 0 / 25%), 0 10px 10px rgb(0 0 0 / 22%)',
        height: '100%'
    },
    card: {
        // Keep the legacy 12px item gutters without overriding Grid's responsive width.
        padding: theme.spacing(1.5),
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    card2: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexFlow: 'column'
    },
    gray: {
        backgroundImage: candyGradient,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '0'
    },
    currentContainer: {
        margin: '0',
        width: '100%',
        marginTop: containerPadding
    },
    averages: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    },
    average: {
        display: 'flex',
        flexDirection: 'column',
        height: '70px',
        width: '100px',
        justifyContent: 'space-between',
        margin: '5px',
        borderRadius: '30px',
        boxShadow: '0 14px 28px rgb(0 0 0 / 25%), 0 10px 10px rgb(0 224 0 / 22%)'
    },

    menu: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0)',
        height: 'inherit',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        '&.large': {
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr'
        }
    },
    menu2: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0)',
        height: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    menuItem: {
        flex: '0 32%',
        margin: 'auto'
    },
    menuIcon: {
        width: theme.spacing(13),
        height: theme.spacing(13),
        '&.large': {
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
        '&.xlarge': {
            width: theme.spacing(18),
            height: theme.spacing(18),
        }
    },
    fanCardContainer: {
        marginTop: containerPadding
    },
    fanMediaContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fanCard: {
        width: 345,
        margin: 4,
        padding: 12,
        backgroundImage: `linear-gradient(158deg, rgba(0,255,255,${aqiAlpha}) 0%, rgba(255,0,255,${aqiAlpha}) 80%)`,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    fanLiked: {
        color: purpleAir
    },
    fanMedia: {
        width: '100%'
    },

    fictionContainer: {
        marginTop: containerPadding
    },
    timeline: {
        padding: '12px'
    },
    fictionHeadline: {
        fontFamily: "'Dancing Script', cursive",
        textShadow: '2px 2px rgb(246, 103, 23)',
        color: 'rgb(55,14,21)',
        fontWeight: 700,
        textAlign: 'center',
        margin: 'auto',
        padding: '0 10px'
    },
    fictionCopy: {
        fontFamily: "'Dancing Script', cursive",
        fontWeight: 700,
        fontSize: '24px',
        textAlign: 'left',
        color: 'black'
    },
    fictionChapterContainer: {
        padding: '12px 0 0 0'
    },
    timelineDot: {
        backgroundColor: 'rgba(0,0,0,0)',
        cursor: 'pointer',
    },
    timelineItem: {
        '&:before': {
            flex: '0',
            padding: 0
        },
        flexDirection: 'row'
    },
    timelineChapter: {
        textAlign: 'left',
        color: 'black',
        fontWeight: 700,
        marginBottom: '10px',
        paddingLeft: '12px',
        cursor: 'pointer'
    },
    timelinePaper: {
        backgroundColor: 'rgba(0,0,0,0)',
        backgroundImage: candyGradient2,
        padding: '12px'
    },

    chartsContainer: {
        marginTop: containerPadding,
        textAlign: 'left',
        width: '100%',
        maxWidth: '100%'
    },
    historyPage: {
        color: '#1b1b1b',
        minWidth: 0,
        [theme.breakpoints.down('sm')]: {
            '& .minair-card': { padding: 8 },
            '& .minair-currentContainer': { marginTop: 24 },
            '& .minair-songRowCellButton.historyTitle': {
                fontSize: 'clamp(2rem, 8.5vw, 2.75rem)',
                lineHeight: 1.1,
                letterSpacing: '0.08rem'
            },
            '& .MuiPagination-ul': { justifyContent: 'center', flexWrap: 'wrap' }
        }
    },
    historyCard: {
        background: candyGradient,
        color: '#1b1b1b',
        height: '100%',
        '& h2': { textAlign: 'center' },
        [theme.breakpoints.down('sm')]: { borderRadius: 28 }
    },
    historyStatContent: {
        [theme.breakpoints.down('sm')]: {
            padding: '16px 12px !important',
            '& > h2': { fontSize: '0.875rem', lineHeight: 1.35, minHeight: '2.7em' },
            '& > .MuiTypography-h2': {
                fontSize: 'clamp(1.75rem, 8vw, 2.25rem)',
                lineHeight: 1.2,
                margin: '8px 0',
                fontVariantNumeric: 'tabular-nums'
            },
            '& > .MuiTypography-body2': { fontSize: '0.8125rem', lineHeight: 1.4 }
        }
    },
    historyContent: {
        '--history-inset': '24px',
        padding: 'var(--history-inset) !important',
        textAlign: 'center',
        [theme.breakpoints.down('sm')]: {
            '--history-inset': '16px',
            '& p, & summary': { fontSize: '0.875rem', lineHeight: 1.5 },
            '& h2.MuiTypography-h4': { fontSize: '1.5rem', lineHeight: 1.25 },
            '& h2.MuiTypography-h5': { fontSize: '1.375rem', lineHeight: 1.3 },
            '& summary': { cursor: 'pointer', padding: '12px 0' },
            '& .MuiButton-root': { minHeight: 44 },
            '& .MuiButton-root:focus-visible, & summary:focus-visible': {
                outline: `2px solid ${purpleAir}`,
                outlineOffset: 2
            }
        }
    },
    historyActions: {
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            '& .MuiButton-root': { width: '100%' }
        }
    },
    historyControls: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            '& .minair-historySelect': { minWidth: 0, width: '100%', margin: 0, left: 0, flexDirection: 'column' },
            '& .minair-chartSelector': { minWidth: 0, marginRight: 0 },
            '& > .MuiButton-root': { gridColumn: '1 / -1' }
        }
    },
    historySelect: {
        left: 0,
        flexDirection: 'column',
        margin: 0,
        maxWidth: '100%',
        '& .MuiFilledInput-root': {
            backgroundColor: '#f0e6f5',
            '&:hover, &.Mui-focused': {
                backgroundColor: '#e5d8ee'
            }
        }
    },
    historyChart: {
        [theme.breakpoints.down('sm')]: {
            width: 'calc(100% + var(--history-inset) + var(--history-inset))',
            marginLeft: 'calc(-1 * var(--history-inset))',
            marginRight: 'calc(-1 * var(--history-inset))'
        }
    },
    historyTableContainer: {
        '&:focus-visible': { outline: `2px solid ${purpleAir}`, outlineOffset: -2 },
        [theme.breakpoints.down('sm')]: {
            width: 'calc(100% + var(--history-inset) + var(--history-inset))',
            marginLeft: 'calc(-1 * var(--history-inset))',
            marginRight: 'calc(-1 * var(--history-inset))',
            overscrollBehaviorX: 'contain'
        }
    },
    historyTableHint: {
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'block',
            margin: '8px 0',
            fontSize: '0.8125rem'
        }
    },
    historyWideTable: {
        [theme.breakpoints.down('sm')]: {
            minWidth: 680,
            '& td:not(:first-child)': { whiteSpace: 'nowrap' }
        }
    },
    historyTwoColumnTable: {
        [theme.breakpoints.down('sm')]: {
            tableLayout: 'fixed',
            '& > thead > tr > :last-child, & > tbody > tr > :last-child:not([colspan])': {
                width: '32%'
            },
            '& > tbody > tr > td:last-child:not([colspan])': { whiteSpace: 'nowrap' },
            '& > tbody > tr > :first-child:not([colspan])': { overflowWrap: 'anywhere' }
        }
    },
    historyDetailsCell: {
        [theme.breakpoints.down('sm')]: { padding: '0 !important' }
    },
    historyTable: {
        backgroundColor: historySurfaceBackground,
        color: '#1b1b1b',
        '& th, & td': {
            padding: '10px 8px',
            color: 'inherit'
        },
        '& th': {
            whiteSpace: 'nowrap',
            fontWeight: 700
        },
        [theme.breakpoints.down('sm')]: {
            '& th, & td': {
                padding: '12px',
                fontSize: '0.875rem',
                lineHeight: 1.4,
                verticalAlign: 'middle',
                fontVariantNumeric: 'tabular-nums'
            },
            '& th': { whiteSpace: 'normal', fontSize: '0.8125rem', overflowWrap: 'anywhere' }
        }
    },
    historySpikeRow: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#eee'
        },
        [theme.breakpoints.down('sm')]: {
            '& > th': { padding: '4px 12px' },
            '& .MuiButton-root': {
                width: '100%',
                minWidth: 0,
                padding: '8px 0',
                justifyContent: 'flex-start',
                textAlign: 'left',
                whiteSpace: 'normal',
                textTransform: 'none',
                fontSize: '0.875rem',
                lineHeight: 1.4
            },
            '& .MuiButton-startIcon': { marginLeft: 0, flexShrink: 0 }
        }
    },
    historyLeaf: {
        display: 'inline-block',
        marginRight: 12,
        fontSize: 28,
        animation: 'minair-historyPuff 1200ms ease-out',
        '@media (prefers-reduced-motion: reduce)': {
            animation: 'none'
        }
    },
    '@keyframes minair-historyPuff': {
        from: { transform: 'translateY(12px) scale(0.6)', opacity: 0 },
        to: { transform: 'translateY(0) scale(1)', opacity: 1 }
    },
    historyToast: {
        backgroundColor: purpleAir,
        borderRadius: 30,
        '& .MuiSnackbarContent-message': {
            display: 'flex',
            alignItems: 'center'
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        left: 24,
        flexDirection: 'row'
    },
    chartSelector: {
        marginRight: 12,
        color: 'white',
        minWidth: 180,
        '&.MuiFilledInput-root': {
            background: purpleAirTransparent,
            '& .MuiButtonBase-root': {
                '& .MuiSvgIcon-root': {
                    color: 'rgba(255,255,255,0.74)'
                }
            }
        },
        '&.MuiFormLabel-root.Mui-focused': {
            color: 'white'
        },
        '.MuiSelect-iconFilled': {
            color: 'white'
        }
    },
    datePicker: {
        margin: 0,
        '& .MuiInputLabel-root': {
            color: 'white'
        },
        '& .MuiFilledInput-root': {
            color: 'white',
            '&.MuiFilledInput-root': {
                background: purpleAirTransparent
            },
            '&.MuiFormLabel-root.Mui-focused': {
                color: 'white'
            },
            '.MuiSelect-iconFilled': {
                color: 'white'
            },
            '& .MuiButtonBase-root': {
                '& .MuiSvgIcon-root': {
                    color: 'rgba(255,255,255,0.74)'
                }
            }
        }
    },

    modal: {
        position: 'absolute',
        width: '100%',
        color: 'white',
        border: 'none',
        boxShadow: 'none',
        padding: theme.spacing(2, 4, 3),
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '&:focus': {
            outline: 'none'
        },
        '& .MuiAvatar-square': {
            width: 380,
            height: 380
        },
        '& button': {
            margin: 5,
            backgroundColor: purpleAir,
            color: 'white',
            '&:hover': {
                backgroundColor: purpleAirTr
            }
        }
    },
    backDrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },

    songsContainer: {
        marginTop: containerPadding,
        paddingBottom: 24
    },
    songsTable: {
        width: '92%',
        margin: '0 auto'
    },
    songsTableBody: {},
    songRow: {
        background: 'none',
        borderBottom: `2px solid ${purpleAir}`
    },
    titleRow: {
        height: 70
    },
    songRowCell: {
        padding: 0
    },
    songRowCellButton: {
        fontSize: '1.75rem',
        color: 'black',
        border: 'none',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        fontStyle: 'italic',
        textShadow: 'rgb(0 255 255) -2px 0px 0px, rgb(255 0 255) 2px 0px 0px',
        letterSpacing: '0.2rem',
        '&.historyTitle': {
            fontSize: theme.typography.h3.fontSize,
            textTransform: 'uppercase'
        },
        '&.small': {
            fontSize: '1.2rem'
        }
    },
    songRowCellButtonNum: {
        minWidth: 48
    },
    songRowNum: {
        height: 30,
        weight: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&.play': {
            background: candyGradient3
        }
    },
    songLyricsCell: {
        padding: 0,
        height: 'auto'
    },
    songLyricsContainer: {
        width: '100%'
    },
    songLyrics: {
        backgroundColor: 'rgba(0,0,0,0)',
        backgroundImage: candyGradient2,
        textAlign: 'center',
        width: '100%',
        fontFamily: "'Dancing Script', cursive",
        fontWeight: 700,
        fontSize: '1.75rem',
        '& div': {
            padding: 12
        }
    },

    canvasWebgl: {
        position: 'fixed',
        top: 0,
        left: 0
    },

    footer: {
        marginTop: 20,
        bottom: 0,
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    footerBar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    footerButton: {
        padding: '6px 12px',
        color: 'inherit',
        border: 'none',
        '& .MuiTypography-root': {
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.2rem',
            fontStyle: 'italic',
            textShadow: 'rgb(0 255 255) -2px 0px 0px, rgb(255 0 255) 2px 0px 0px',
            fontSize: '1.25rem',
            color: 'black',

        }
    },

    videoContainer: {
        marginTop: containerPadding,
        maxWidth: '1280px',
        '& video': {
            width: '100%'
        }
    },
    videoTitle: {
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        fontStyle: 'italic',
        textAlign: 'center',
        textShadow: 'rgb(0 255 255) -2px 0px 0px, rgb(255 0 255) 2px 0px 0px',
        margin: '1rem 0',
        fontSize: '4rem',
        textTransform: 'uppercase',
        '&.small': {
            fontSize: '2rem'
        }
    },

    donateIconPlace: {
        opacity: 0,
        '&.visible': {
            opacity: 1,
        }
    },
    donateIcon: {
        zIndex: 1101,
        position: 'absolute',
        '&.visible': {
            display: 'none',
        }
    },
    donateText: {
        marginTop: containerPadding,
        marginBottom: containerPadding,
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        padding: '0 1rem',
        fontSize: '3rem',
        fontStyle: 'italic',
        textShadow: 'rgb(0 255 255) -2px 0px 0px, rgb(255 0 255) 2px 0px 0px',
        color: 'black',
        textAlign: 'center',
        letterSpacing: '0.2rem',
        '&.historyTitle': {
            fontSize: theme.typography.h3.fontSize,
            textTransform: 'uppercase'
        },
        '&.small': {
            fontSize: '2rem'
        }
    },

    videoList: {
        marginTop: containerPadding,
        marginBottom: containerPadding,
        padding: '16px'
    },
    videoTitle2: {
        textDecoration: 'none',
        textAlign: 'center',
        color: 'black'
    },
} satisfies Record<string, CSSObject>);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unused = {
    rainbow: {
        height: '100%',
        width: '100%',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        background: 'linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)',
        backgroundSize: '1800% 1800%',
        animation: 'rainbow 4s ease infinite'
    },
    '@keyframes rainbow': {
        '0%': { backgroundPosition: '0% 82%' },
        '50%': { backgroundPosition: '100% 19%' },
        '100%': { backgroundPosition: '0% 82%' }
    }
};

export type StyleClasses = Record<Exclude<keyof ReturnType<typeof styles>, `@${string}`>, string>;
export const classes = Object.fromEntries(
    Object.keys(styles(mainTheme)).filter(key => !key.startsWith('@')).map(key => [key, `minair-${key}`])
) as StyleClasses;
export const globalStyles = Object.fromEntries(
    Object.entries(styles(mainTheme)).map(([key, value]) => [key.startsWith('@') ? key : `.minair-${key}.minair-${key}`, value])
);
