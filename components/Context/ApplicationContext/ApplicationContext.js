import React, { useState, createContext, useEffect } from "react";
import { fetchApplication } from "@lib/directus/api-client";

export const ApplicationContext = createContext({ appState: "registration" });

export const ApplicationContextProvider = (props) => {
  const { kids, initialAppState } = props;
  const [appState, setAppState] = useState(initialAppState || "registration");

  useEffect(() => {
    async function loadApplication() {
      try {
        const { application } = await fetchApplication();
        setAppState(application?.state || initialAppState || "registration");
      } catch (error) {
        console.error("Failed to load application state", error);
        if (initialAppState) setAppState(initialAppState);
      }
    }
    loadApplication();
  }, [initialAppState]);

  const value = {
    appState: appState,
  };

  return <ApplicationContext.Provider value={value}>{props.children}</ApplicationContext.Provider>;
};

export default ApplicationContext;
