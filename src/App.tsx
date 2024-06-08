import { useAtom } from "jotai";
import themeMode from "./store/theme.mode";
import { isClosedServer, isRestartingServer } from "./store/server.store";
import { useLayoutEffect } from "react";
import isServerOnline from "./service/server/isServerOnline.service";
import { CustomProvider, Loader } from "rsuite";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback/ErrorFallback.componennt";
import Routes from "./routes/Routes";
import { BrowserRouter } from "react-router-dom";

function App() {
  const [darkMode] = useAtom(themeMode);
  const [restartingServer, setRestartingServer] = useAtom(isRestartingServer);
  const [closedServer, setClosedServer] = useAtom(isClosedServer);

  useLayoutEffect(() => {
    document.title = "Loading...";
    isServerOnline([setClosedServer, setRestartingServer]);
  }, []);

  return (
    <>
      {typeof closedServer === "boolean" && closedServer ? (
        <></>
      ) : (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
          {typeof restartingServer === "boolean" && restartingServer ? (
            <Loader backdrop content="loading..." />
          ) : (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
            </ErrorBoundary>
          )}
        </CustomProvider>
      )}
    </>
  );
}

export default App;
