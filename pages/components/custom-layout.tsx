import CustomHeader from "./custom-header";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {  useRouter } from "next/router";
import React from "react";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Hidden, IconButton, useTheme } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MovieIcon from "@material-ui/icons/Movie";
const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
  })
);

const MenuList = (classes) => {
  const router = useRouter();
  return (
    <div>
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          <ListItem
            button
            key="youtube"
            onClick={() => {
              router.push("/youtube");
            }}
          >
            <ListItemIcon>
              <MovieIcon />
            </ListItemIcon>
            <ListItemText primary="Youtube影片下載" />
          </ListItem>
          <ListItem
            button
            key="audio"
            onClick={() => {
              router.push("/audio");
            }}
          >
            <ListItemIcon>
              <MovieIcon />
            </ListItemIcon>
            <ListItemText primary="音樂轉檔" />
          </ListItem>
        </List>
        <Divider />
      </div>
    </div>
  );
};
export default function CustomLayout({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.root}>
      <CustomHeader />
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push("/");
            }}
          >
            影音王
          </Typography>
        </Toolbar>
      </AppBar>
      {/* For Desktop Menu Drawer */}
      <Hidden xsDown implementation="css">
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <MenuList classes={classes} router={router}></MenuList>
        </Drawer>
      </Hidden>
      {/* For Mobile Menu Drawer */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <MenuList classes={classes} router={router}></MenuList>
        </Drawer>
      </Hidden>
      <main className={classes.content}>
        <Toolbar />
        <Container maxWidth="xl">{children}</Container>
      </main>
    </div>
  );
}
