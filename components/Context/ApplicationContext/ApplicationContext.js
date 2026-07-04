import React, { useState, createContext, useEffect } from "react";
import { fetchApplication } from "@lib/directus/api-client";

export const ApplicationContext = createContext(null);

export const ApplicationContextProvider = (props) => {
  const { kids } = props;
  const [appState, setAppState] = useState(null);

  useEffect(() => {
    async function loadApplication() {
      try {
        const { application } = await fetchApplication();
        if (application?.state) {
          setAppState(application.state);
        }
      } catch (error) {
        console.error("Failed to load application state", error);
        setAppState("registration");
      }
    }
    loadApplication();
  }, []);

  const value = {
    appState: appState,
  };

  return <ApplicationContext.Provider value={value}>{props.children}</ApplicationContext.Provider>;
};

export default ApplicationContext;
