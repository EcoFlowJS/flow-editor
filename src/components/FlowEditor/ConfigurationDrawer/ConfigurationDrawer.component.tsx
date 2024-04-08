import { useAtom } from "jotai";
import { Button, Drawer } from "rsuite";
import { flowEditorConfigurationsDrawer } from "../../../store/flowEditor.store";
import isUndefined from "lodash/isUndefined";
import { useEffect, useState } from "react";
import fetchNodes from "../../../service/nodes/fetchNodes.service";
import { ApiResponse, Node } from "@ecoflow/types";

interface ConfigurationDrawerProps {
  onDrawerClosed?: (
    nodeID: string,
    label: string,
    configured: boolean,
    disabled: boolean
  ) => void;
}

export default function ConfigurationDrawer({
  onDrawerClosed = () => {},
}: ConfigurationDrawerProps) {
  const [flowConfigurationDrawer, setConfigurationDrawer] = useAtom(
    flowEditorConfigurationsDrawer
  );
  const [nodeInputes, setNodeInputes] = useState<Node>(null);

  const isOpen = (): boolean =>
    flowConfigurationDrawer.show &&
    !isUndefined(flowConfigurationDrawer.label) &&
    !isUndefined(flowConfigurationDrawer.moduleID) &&
    !isUndefined(flowConfigurationDrawer.nodeID);

  const drawerClosedHandler = (
    label?: string | null,
    configured?: boolean | null,
    disabled?: boolean | null
  ) => {
    setConfigurationDrawer({ show: false });
    onDrawerClosed(
      flowConfigurationDrawer.nodeID!,
      label ? label : flowConfigurationDrawer.label!,
      !isUndefined(configured) && configured !== null
        ? configured
        : flowConfigurationDrawer.configured!,
      !isUndefined(disabled) && disabled !== null
        ? disabled
        : flowConfigurationDrawer.disabled!
    );
  };

  useEffect(() => {
    if (isOpen()) {
      fetchNodes(flowConfigurationDrawer.moduleID?._id).then(
        (response: ApiResponse) => {
          if (response.success) setNodeInputes(response.payload);
        },
        console.error
      );
    }
  }, [flowConfigurationDrawer]);

  useEffect(() => console.log(nodeInputes), [nodeInputes]);

  return (
    <Drawer
      open={isOpen()}
      backdrop="static"
      onClose={() => drawerClosedHandler()}
    >
      <Drawer.Header>
        <Drawer.Title>Node Configurations</Drawer.Title>
        <Drawer.Actions>
          <Button
            appearance="primary"
            color="red"
            style={{ minWidth: 80 }}
            onClick={() => drawerClosedHandler()}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            style={{ minWidth: 80 }}
            onClick={() => drawerClosedHandler("axy", true)}
          >
            Confirm
          </Button>
          <Button
            appearance="primary"
            style={{ minWidth: 80 }}
            onClick={() => {
              drawerClosedHandler(
                null,
                null,
                !flowConfigurationDrawer.disabled!
              );
            }}
          >
            Confirm
          </Button>
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body>
        {flowConfigurationDrawer.label}
        <br />
        {JSON.stringify(flowConfigurationDrawer.moduleID)}
        <br />
        {flowConfigurationDrawer.nodeID}
      </Drawer.Body>
    </Drawer>
  );
}
