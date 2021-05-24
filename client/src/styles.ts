import { createMuiTheme, unstable_createMuiStrictModeTheme, createStyles, Theme } from '@material-ui/core/styles';

const createTheme = process.env.NODE_ENV === 'production' ? createMuiTheme : unstable_createMuiStrictModeTheme;

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
    overrides: {
        MuiToolbar: {
            gutters: {
                [defaultTheme.breakpoints.up('sm')]: {
                    paddingLeft: '12px',
                    paddingRight: '12px',
                },
            },
        },
    },
});

const aqiAlpha = 0.25;
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

const purpleAirTransparent = `rgba(170, 68, 170, ${aqiAlpha2})`;

const containerPadding = '40px';

export const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
    },
    '@keyframes fadeIn': {
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
        animation: 'fadeIn 700ms ease-in-out 1s both',
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
        backgroundColor: 'rgba(255, 255, 0, 1)',
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
        boxShadow: '0 14px 28px rgb(0 0 0 / 25%), 0 10px 10px rgb(0 0 0 / 22%)'
    },
    card: {
        width: '100%',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        backgroundColor: 'none',
    },
    card2: {
        height: '100%',
    },
    row2: {
        minHeight: '250px'
    },
    pressureHack: {
        display: 'flex',
    },
    gray: {
        backgroundImage: candyGradient,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
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
        alignItems: 'center'
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
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: containerPadding
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
        backgroundColor: 'rgba(0,0,0,0)'
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
        paddingLeft: '12px'
    },
    timelinePaper: {
        backgroundColor: 'rgba(0,0,0,0)',
        backgroundImage: candyGradient2,
        padding: '12px'
    },

    chartsContainer: {
        marginTop: containerPadding,
        textAlign: 'left'
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
                '& .MuiIconButton-label': {
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
                '& .MuiIconButton-label': {
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
        backgroundColor: purpleAir
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
        '& .MuiTypography-colorPrimary': {
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
        '&.small': {
            fontSize: '2rem'
        }
    }
});

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
