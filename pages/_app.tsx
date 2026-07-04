// IMPORT COMPONENTS
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ApplicationContextProvider } from "@context/ApplicationContext/ApplicationContext";
import * as ga from "../lib/ga";
import Navbar from "@elements/Navbar/Navbar";
import { fetchKids, blockKid } from "@lib/directus/api-client";

// IMPORT UTILS
import getCurrentDate from "@utils/getCurrentDate";
import shuffleArray from "@utils/shuffleArray.js";

// IMPORT STYLES
import "../styles/globals.css";

const CAMPAIGN_START = process.env.NEXT_PUBLIC_CAMPAIGN_SEASON_START || "2023-08-30T00:00:00.604014+00:00";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllKids() {
      try {
        let after = 0;
        let allKids = [];
        let hasNext = true;

        while (hasNext) {
          const data = await fetchKids(after, CAMPAIGN_START);
          allKids = allKids.concat(data.connection.edges.map((item) => item.node));
          hasNext = data.connection.pageInfo.hasNextPage;
          after += 1000;
        }

        let newKids = [];
        const localCart = localStorage.getItem("cart") ? localStorage.getItem("cart").split(",") : [];
        let newCart = [];

        const cutofftime = new Date();
        cutofftime.setMinutes(cutofftime.getMinutes() - 30);

        allKids
          .filter((kid) => kid.wish)
          .forEach((kid) => {
            const checkouttime = kid.checkout ? new Date(kid.checkout) : null;
            if (!checkouttime || checkouttime <= cutofftime || kid.donor) {
              newKids.push(kid);
            } else {
              const inCart = localCart.find((item) => item === kid.id);
              if (inCart) {
                newKids.push(kid);
                newCart.push(kid.id);
              }
            }
          });

        newKids = shuffleArray(newKids);
        setKids(newKids);
        setCart(newCart);
      } catch (error) {
        console.error("Failed to load kids", error);
      } finally {
        setLoading(false);
      }
    }

    loadAllKids();
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);
    const localCart = localStorage.getItem("cart") ? localStorage.getItem("cart").split(",") : [];
    setCart(localCart);
  }, []);

  const handleRemoveFromCart = async (id) => {
    const newItems = cart.filter((item) => item !== id);
    const ids = newItems.join(",");
    localStorage.setItem("cart", ids);
    await blockKid(id, null);
    setCart(newItems);
  };

  const handleAddToCart = async (kid) => {
    const exist = cart.find((item) => item === kid.id);
    if (!exist) {
      const newItems = [...cart, kid.id];
      const ids = newItems.join(",");
      localStorage.setItem("cart", ids);
      const date = getCurrentDate();
      await blockKid(kid.id, date);
      setCart(newItems);
    }
  };

  const handleEmptyCart = async () => {
    setCart([]);
  };

  return (
    <ApplicationContextProvider kids={kids}>
      <Navbar cart={cart} kids={kids} onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart} />
      <Component
        cart={cart}
        kids={kids}
        loadingKids={loading}
        onEmptyCart={handleEmptyCart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        {...pageProps}
      />
    </ApplicationContextProvider>
  );
}

export default MyApp;
