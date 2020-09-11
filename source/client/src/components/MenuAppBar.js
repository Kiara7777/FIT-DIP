import React, {useState} from 'react';
import {
    AppBar,
    Typography,
    IconButton,
    Toolbar,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import WorkIcon from '@material-ui/icons/Work';
import PermScanWifiIcon from '@material-ui/icons/PermScanWifi';
import ForumIcon from '@material-ui/icons/Forum';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {changeTheme, cleanRedux, setDrawer} from "../actions";
import {Link, withRouter } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import {visibleOnlyAdmin} from "../security/secureComponents";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;


const menuWidth = 240;


//Zajimave odkazy
//https://material.io/design/motion/speed.html#controlling-speed - o tom duration a easing
//theme.transitions.create([pole, s CSS vlastnostmi, ktetre chceme ovlivnit], {objekt: urcujici, duration, easing, delay})
//theme, mozne hodnoty: https://material-ui.com/customization/default-theme/
//clsx umoznuje apliakci stylu pomoci podminek: https://material-ui.com/getting-started/faq/

/* STYL KOMPONENTY */
const useStyles = makeStyles(theme => ({

    toolbarApp: {
        paddingLeft: theme.spacing(3),
    },
//easing ma dle Material Design byt pred duration, ten ZIndex tam musi byt jinac to menu skyje AppBar
    appBarNormal: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },

    appBarWithMenu: {
        marginLeft: menuWidth,
        width: `calc(100% - ${menuWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    drawerMenu: {
        width: menuWidth,
        whiteSpace: 'nowrap',
    },

    drawerMenuOpen: {
        width: menuWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    drawerMenuClosed: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },

    drawerMenuHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },

    hideIcon: {
        display: "none",
    },

    accountIcon: {
        marginLeft: "auto",
    }
}));


/**
 * Komponenta horniho panelu - Appbar a leveho menu
 * Temer vse je prevzato z zdarma sablony Dashboard od Material-UI
 * https://material-ui.com/getting-started/templates/dashboard/
 * https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Dashboard.js
 *
 * Zmeny vzhledu - ta zmena tlacitek + ty barvy - inspirovano strankami Material-UI
 *
 * Autor: Sara Skutova
 * */
function MenuAppBar(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState(0);

    const drawerOpen = useSelector(state => state.drawer);
    const title = useSelector(state => state.title);
    const theme = useSelector(state => state.appTheme);

    // komponenty urcujici jake polozky menu budou viditelne
    const VisibleAdminUsers = visibleOnlyAdmin(() => <ListItem button selected={selectedItem === 2} onClick={event => handleSelectedMenu(event, 2)} component={Link} to="/app/users">
                                                        <ListItemIcon>
                                                            <SupervisorAccountIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Uživatelé" />
                                                    </ListItem>);

    const VisibleAdminQuestion = visibleOnlyAdmin(() =>  <ListItem button selected={selectedItem === 6} onClick={event => handleSelectedMenu(event, 6)} component={Link} to="/app/question">
                                                            <ListItemIcon>
                                                                <LiveHelpIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Otázky" />
                                                        </ListItem>);

    const VisibleAdminSurvey = visibleOnlyAdmin(() => <ListItem button selected={selectedItem === 5} onClick={event => handleSelectedMenu(event, 5)} component={Link} to="/app/survey">
                                                            <ListItemIcon>
                                                                <ForumIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Dotazníky" />
                                                        </ListItem>);

    /**
     * Otevirani a zavirani menu
     * */
    const handleMenuOpenClose = () => {
        const open = drawerOpen;
        dispatch(setDrawer(!open))
    };

    /**
     * Reakce na stisknuti tlacitka v menu
     * */
    const handleSelectedMenu = (event, item) => {
        setSelectedItem(item);
    };

    /**
     * Reakce na sisk talcitka na odhlaseni
     * */
    const handlerAccountClick = values => {
        axios.post('/logout', null)
            .then(response => {
                dispatch(cleanRedux());
                //ability.update([]);
                props.history.push("/");
            })
            .catch(error => {
            });

    };

    /**
     * Reakce na stisk tlacitka na zmenu rezimu
     * */
    const handleChangeTheme = () => {
        theme === 'light' ? dispatch(changeTheme('dark')) : dispatch(changeTheme('light'))
    };

    return (
        <div>
            <AppBar position="fixed"
                    color={theme === 'light' ? 'primary' : 'inherit'}
                    className={clsx(classes.appBarNormal, {
                        [classes.appBarWithMenu]: drawerOpen,
                    })}>
                <Toolbar>
                    <IconButton edge="start"
                                color="inherit"
                                aria-label="open menu drawer"
                                onClick={handleMenuOpenClose}
                                className={clsx('', drawerOpen && classes.hideIcon)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.toolbarApp}>
                        {title}
                    </Typography>
                    {
                        theme === 'light' ?
                            <Tooltip title="Tmavý režim">
                                <IconButton color="inherit" className={classes.accountIcon} onClick={handleChangeTheme}>
                                    <Brightness7Icon />
                                </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Jasný režim">
                                <IconButton color="inherit" className={classes.accountIcon} onClick={handleChangeTheme}>
                                    <Brightness4Icon />
                                </IconButton>
                            </Tooltip>


                    }
                    <Tooltip title="Odhlásit">
                        <IconButton color="inherit" onClick={handlerAccountClick}>
                            <AccountCircleIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent"
                    className={clsx(classes.drawerMenu, {
                        [classes.drawerMenuOpen]: drawerOpen,
                        [classes.drawerMenuClosed]: !drawerOpen,
                    })}
                    classes={{paper: clsx({
                            [classes.drawerMenuOpen]: drawerOpen,
                            [classes.drawerMenuClosed]: !drawerOpen,
                        }),
                    }}>
                <div className={classes.drawerMenuHeader}>
                    <IconButton onClick={handleMenuOpenClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button
                              selected={selectedItem === 1}
                              onClick={event => handleSelectedMenu(event, 1)}
                              component={Link} to="/app/dashboard">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <VisibleAdminUsers/>
                    <ListItem button
                              selected={selectedItem === 3}
                              onClick={event => handleSelectedMenu(event, 3)}
                              component={Link} to="/app/project">
                        <ListItemIcon>
                            <WorkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Projekty" />
                    </ListItem>
                    <ListItem button
                              selected={selectedItem === 4}
                              onClick={event => handleSelectedMenu(event, 4)}
                              component={Link} to="/app/register">
                        <ListItemIcon>
                            <PermScanWifiIcon />
                        </ListItemIcon>
                        <ListItemText primary="Registr Rizik" />
                    </ListItem>
                    <VisibleAdminSurvey />
                    <VisibleAdminQuestion />
                </List>
            </Drawer>
        </div>
    );
}

export default withRouter(MenuAppBar);