// IMPORT BASICS
import React, { useState, useContext } from "react";
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu } from "@mui/material";
import { Icon } from "@mui/material";
import Link from "next/link";

// IMPORT COMPONENT
import Popover from "@mui/material/Popover";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext";
import { Button } from "@elements/Button/Button";
import { useRouter } from "next/router";

function TransitionUp(props) {
  return <Slide {...props} direction="right" />;
}

const Navbar = ({ cart, kids, onRemoveFromCart, onAddToCart }) => {
  const router = useRouter();

  // STATES
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [openCart, setOpenCart] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);
  const [confirm, setConfirm] = useState(null);

  // CONTEXT
  const { appState } = useContext(ApplicationContext);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const handleOpenCart = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCart = () => {
    setAnchorEl(null);
  };

  const handleCheckout = () => {
    handleCloseCart();
    router.push("/checkout");
  };

  const handleAddItem = () => {
    const availableKids = kids.filter((kid) => {
      const isCompleted = kid.donor && (kid.donor.manualUpload || kid.donor.paymentSuccessful);
      return !isCompleted && !cart.includes(kid.id);
    });
    if (availableKids.length > 0) {
      onAddToCart(availableKids[0]);
      setConfirm("Geschenk hinzugefügt");
    }
  };

  const handleRemoveItem = () => {
    if (cart.length > 0) {
      const id = cart[0];
      onRemoveFromCart(id);
      setConfirm("Geschenk entfernt");
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const mobileMenuId = "primary-search-account-menu-mobile";

  // ***************************************************
  // SUB-COMPONENT: renderMobileView
  // Renders the mobile version of the navigation
  // ***************************************************
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton onClick={(e) => handleOpenCart(e)} aria-label="Show cart items" color="inherit">
          <Badge badgeContent={cart.length} color="secondary">
            <Icon>shopping_basket</Icon>
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
    </Menu>
  );

  // ***************************************************
  // SUB-COMPONENT: renderMobileView
  // Renders the mobile version of the navigation
  // ***************************************************

  // CALUCALTIONS
  // Set text
  const availableKids = kids.filter((kid) => {
    const isCompleted = kid.donor && (kid.donor.manualUpload || kid.donor.paymentSuccessful);
    return !isCompleted && !cart.includes(kid.id);
  });

  const minusStyle = cart.length === 0 ? "cart-plusminus-deactivated" : "";
  const plusStyle = availableKids.length === 0 ? "cart-plusminus-deactivated" : "";

  // Check if content should be shown
  const filter = ["wish_fulfilment"];

  const show = filter.includes(appState) ? true : false;

  // RENDER
  return (
    <div>
      <SwipeableDrawer anchor="right" open={openPanel} onClose={() => setOpenPanel(false)} onOpen={() => setOpenPanel(true)}>
        <div className="panel">
          <Link href="/anmelden" passHref>
            <div className="panelItem" onClick={() => setOpenPanel(false)}>
              <div className="circle" />
              <p className="nav-title">Wunsch anmelden</p>
            </div>
          </Link>
          <Link href="/wunscherfuellen" passHref>
            <div className="panelItem" onClick={() => setOpenPanel(false)}>
              <div className="circle" />

              <p className="nav-title">Erfülle einen Wunsch</p>
            </div>
          </Link>
          <Link href="/team" passHref>
            <div className="panelItem" onClick={() => setOpenPanel(false)}>
              <div className="circle" />
              <p className="nav-title">Erfüllt als Team Wünsche</p>
            </div>
          </Link>
          <Link href="/help" passHref>
            <div className="panelItem" onClick={() => setOpenPanel(false)}>
              <div className="circle" />
              <p className="nav-title">Kinder unterstützen</p>
            </div>
          </Link>
          <hr className="panelHR" />
          <Link href="/contact" passHref>
            <div className="panelItem" onClick={() => setOpenPanel(false)}>
              <div className="circle" />
              <p className="nav-title">Kontakt</p>
            </div>
          </Link>
          <Link href="/info" passHref>
            <div className="panelItem" onClick={() => setOpenPanel(false)}>
              <div className="circle" />
              <p className="nav-title">Über die Aktion</p>
            </div>
          </Link>
          <Link href="/partner" passHref>
            <div className="panelItem" onClick={() => setOpenPanel(false)}>
              <div className="circle" />
              <p className="nav-title">Unsere Partner</p>
            </div>
          </Link>
          <Link href="/impressum" passHref>
            <div className="panelItem" onClick={() => setOpenPanel(false)}>
              <div className="circle" />
              <p className="nav-title">Impressum</p>
            </div>
          </Link>
        </div>
      </SwipeableDrawer>
      <AppBar position="fixed" className="appBar" color="transparent">
        <div className="relative h-full bg-white">
          <a href="https://www.caritas-zuerich.ch/" target="_blank" rel="noreferrer">
            <img className="absolute left-4 top-1/2 h-6 -translate-y-1/2" src="logo_caritas_zh.png" alt="logo" />
          </a>
          <Toolbar>
            <div className="grow" />
            <div className="nav-icons absolute right-4 top-1/2 -translate-y-1/2">
              {show && (
                <IconButton onClick={(e) => handleOpenCart(e)} aria-label="Show cart items" color="inherit">
                  <Badge badgeContent={cart.length} color="secondary">
                    <Icon>shopping_basket</Icon>
                  </Badge>
                </IconButton>
              )}
              <IconButton onClick={() => setOpenPanel(true)} aria-label="Show cart items" color="inherit">
                <Icon className=" text-red-500">dehaze</Icon>
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseCart}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div className="cart-container" style={{ backgroundImage: `url("cart.png")` }}>
                  <p>Sie haben die folgende Anzahl an Geschenken in ihrem Geschenkekorb</p>
                  {/* <Grid container spacing={3}>
                    {cart.items.map((item, index) => {
                      return (
                        <Grid item xs={6} key={index}>
                          <div className="cart-item" style={{ backgroundImage: `url("/polaroid.png")` }}>
                            <img className="cart-image" src={item.image.url} alt="Spielzeug" />
                            <div className="cart-delete">
                              <IconButton
                                onClick={() => handleRemoveItem(item.id)}
                                aria-label="Show cart items"
                                color="inherit"
                                className="cart-delete"
                              >
                                <Icon>cancel</Icon>
                              </IconButton>
                            </div>
                          </div>
                        </Grid>
                      );
                    })}
                  </Grid> */}
                  <div className="mt-8 flex flex-row items-center">
                    <div className={"cart-plusminus " + minusStyle} style={{ marginRight: 0 }} onClick={() => handleRemoveItem()}>
                      -
                    </div>
                    <div className="cart-number">{cart.length}</div>
                    <div className={"cart-plusminus " + plusStyle} style={{ marginLeft: 0 }} onClick={() => handleAddItem()}>
                      +
                    </div>
                  </div>
                  <Button onClick={handleCheckout} color="darkblue" size="large" className="ml-0 mt-4 w-full">
                    Zur Kasse
                  </Button>
                </div>
              </Popover>
            </div>
          </Toolbar>
        </div>
      </AppBar>
      {renderMobileMenu}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        TransitionComponent={TransitionUp}
        message={confirm}
        key={"confirmation"}
        autoHideDuration={3000}
      />
    </div>
  );
};

export default Navbar;
