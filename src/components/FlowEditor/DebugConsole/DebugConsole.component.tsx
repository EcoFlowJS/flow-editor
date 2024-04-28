import { useAtom } from "jotai";
import ReactJson from "react-json-view";
import { Drawer, FlexboxGrid, List, Panel, Stack } from "rsuite";
import { debugConsoleDrawer } from "../../../store/flowEditor.store";
import { useLayoutEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import {
  connectSocketIO,
  disconnectSocketIO,
} from "../../../utils/socket.io/socket.io";

export default function DebugConsole() {
  const [open, setOpen] = useAtom(debugConsoleDrawer);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [debugConsoleName, setDubugConsoleName] = useState<string[]>([]);
  const [debugConsoleResult, setDebugConsoleResult] = useState<
    {
      [key: string]: any;
    }[]
  >([]);
  const [debugResult, setDebugResult] = useState<{ [key: string]: any }>({});

  const showConsoleValueHandler = (index: number) =>
    setDebugResult(debugConsoleResult[index]);

  useLayoutEffect(() => {
    const socket = connectSocketIO();
    socket.on("DebugWebConsole", ([name, payload]) => {
      setDubugConsoleName((debugName) => [...debugName, name]);
      setDebugConsoleResult((resultPayload) => [
        ...resultPayload,
        isString(payload) ? { msg: payload } : payload,
      ]);
    });

    return () => {
      if (socket !== null) disconnectSocketIO(socket)();
    };
  }, []);

  return (
    <Drawer
      size="lg"
      open={open && drawerOpen}
      placement="bottom"
      onClose={() => setDrawerOpen(false)}
      onExited={() => setOpen(false)}
    >
      <Drawer.Header>
        <Drawer.Title>Debug Console</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={18}>
            {isEmpty(debugConsoleName) && isEmpty(debugResult) ? (
              <div style={{ textAlign: "center" }}>No Result Fount</div>
            ) : isEmpty(debugResult) ? (
              <FlexboxGrid>
                <FlexboxGrid.Item colspan={11}>
                  <List bordered style={{ maxHeight: 400 }}>
                    {debugConsoleName.map((name, index) => (
                      <List.Item
                        key={index}
                        style={{ cursor: "pointer" }}
                        onClick={() => showConsoleValueHandler(index)}
                      >
                        {name}
                      </List.Item>
                    ))}
                  </List>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ) : (
              <Stack
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={20}
                wrap
              >
                <Stack.Item flex={2}>
                  <List bordered style={{ maxHeight: 400 }}>
                    {debugConsoleName.map((name, index) => (
                      <List.Item
                        key={index}
                        style={{ cursor: "pointer" }}
                        onClick={() => showConsoleValueHandler(index)}
                      >
                        {name}
                      </List.Item>
                    ))}
                  </List>
                </Stack.Item>
                {!isEmpty(debugResult) ? (
                  <>
                    <Stack.Item flex={2}>
                      <Panel bordered bodyFill style={{ padding: 10 }}>
                        <ReactJson
                          src={debugResult}
                          name={null}
                          enableClipboard={false}
                          theme="harmonic"
                        />
                      </Panel>
                    </Stack.Item>
                  </>
                ) : (
                  <></>
                )}
              </Stack>
            )}
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Drawer.Body>
    </Drawer>
  );
}
