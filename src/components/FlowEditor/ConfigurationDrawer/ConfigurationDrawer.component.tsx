import has from "lodash/has";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import isUndefined from "lodash/isUndefined";
import { Drawer, Heading, Panel, Placeholder, Stack, Text } from "rsuite";
import DrawerHeader from "./DrawerHeader/DrawerHeader.component";
import fetchNodes from "../../../service/nodes/fetchNodes.service";
import NodeNameInput from "./NodeNameInput/NodeNameInput.component";
import { flowEditorConfigurationsDrawer } from "../../../store/flowEditor.store";
import NodeConfigurationTabs from "./NodeConfigurationTabs/NodeConfigurationTabs.component";
import drawerInitialNodeConfigurations from "../../../defaults/drawerInitialNodeConfigurations.default";
import {
  ApiResponse,
  FlowsConfigurationsDrawer,
  EcoNode,
  NodeAppearanceConfigurations,
  NodeConfiguration,
} from "@ecoflow/types";
import "./style.less";
import { Socket } from "socket.io-client";
import {
  connectSocketIO,
  disconnectSocketIO,
} from "../../../utils/socket.io/socket.io";

interface ConfigurationDrawerProps {
  configuration: NodeConfiguration[];
  onDrawerClosed?: (
    nodeID: string,
    label: string,
    configured: boolean,
    disabled: boolean,
    description: string,
    appearance: NodeAppearanceConfigurations,
    nodeConfiguration: NodeConfiguration
  ) => void;
}

export default function ConfigurationDrawer({
  configuration,
  onDrawerClosed = () => {},
}: ConfigurationDrawerProps) {
  const [socket, setSocket] = useState<Socket>();
  const [isLoading, setLoading] = useState(true);
  const [flowConfigurationDrawer, setConfigurationDrawer] = useAtom(
    flowEditorConfigurationsDrawer
  );
  const [moduleNode, setModuleNode] = useState<EcoNode>(null);
  const [nodeConfigurations, setNodeConfigurations] = useState(
    drawerInitialNodeConfigurations
  );

  const isOpen = (): boolean =>
    flowConfigurationDrawer.show &&
    !isUndefined(flowConfigurationDrawer.label) &&
    !isUndefined(flowConfigurationDrawer.moduleID) &&
    !isUndefined(flowConfigurationDrawer.nodeID);

  const updateNodeDetails = (
    label?: string | null,
    configured?: boolean | null,
    disabled?: boolean | null,
    description?: string | null,
    appearance?: NodeAppearanceConfigurations | null,
    nodeConfiguration?: NodeConfiguration | null
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
        : flowConfigurationDrawer.disabled!,
      !isUndefined(description) && description !== null
        ? description
        : flowConfigurationDrawer.description!,
      !isUndefined(appearance) && appearance !== null
        ? appearance
        : flowConfigurationDrawer.appearance!,
      !isUndefined(nodeConfiguration) && nodeConfiguration !== null
        ? nodeConfiguration
        : {
            ...configuration.filter(
              (nodeConfiguration) =>
                nodeConfiguration.nodeID === flowConfigurationDrawer.nodeID!
            )[0],
          }
    );
  };

  const drawerClosedHandler = (isCommitSave?: boolean) => {
    if (!isCommitSave) {
      updateNodeDetails();
      return;
    }

    const finalNodeConfiguration = (
      configs: NodeConfiguration
    ): NodeConfiguration => {
      Object.keys(configs.configs).map((configKey) => {
        if (has(configs.configs[configKey], "validated"))
          delete configs.configs[configKey].validated;

        configs.configs[configKey] = has(configs.configs[configKey], "value")
          ? configs.configs[configKey].value
          : configs.configs[configKey];
      });

      return configs;
    };

    updateNodeDetails(
      nodeConfigurations.label ? nodeConfigurations.label : moduleNode?.name,
      Object.keys(nodeConfigurations.nodeConfiguration.configs).filter(
        (key) => !nodeConfigurations.nodeConfiguration.configs[key].validated
      ).length == 0 ||
        isUndefined(moduleNode?.inputs) ||
        moduleNode?.inputs === null ||
        moduleNode?.inputs.length === 0,
      nodeConfigurations.disabled,
      nodeConfigurations.description,
      nodeConfigurations.appearance,
      finalNodeConfiguration(nodeConfigurations.nodeConfiguration)
    );
  };

  const updateNodeConfiguration = (
    value: Pick<
      FlowsConfigurationsDrawer,
      "label" | "configured" | "disabled" | "description" | "appearance"
    > & {
      nodeConfiguration?: { [key: string]: any };
    }
  ) => {
    setNodeConfigurations((nodeConfigurations) => {
      return {
        ...nodeConfigurations,
        ...value,
        nodeConfiguration: has(value, "nodeConfiguration")
          ? {
              nodeID: flowConfigurationDrawer.nodeID!,
              configs: value["nodeConfiguration"]!,
            }
          : nodeConfigurations.nodeConfiguration,
      };
    });

    socket?.emit(
      flowConfigurationDrawer.moduleID?._id!,
      value["nodeConfiguration"] || {}
    );
  };

  useEffect(() => {
    if (!isOpen()) return;
    if (socket)
      if (!socket.hasListeners(flowConfigurationDrawer.moduleID?._id!))
        socket.on(flowConfigurationDrawer.moduleID?._id!, (value) =>
          setModuleNode(value)
        );
    setLoading(true);
    fetchNodes(flowConfigurationDrawer.moduleID?._id).then(
      ({ success, payload }: ApiResponse) => {
        setLoading(false);
        if (success) {
          setModuleNode(payload);
          setNodeConfigurations({
            label:
              flowConfigurationDrawer.label === payload.name
                ? ""
                : flowConfigurationDrawer.label!,
            configured: flowConfigurationDrawer.configured!,
            disabled: flowConfigurationDrawer.disabled!,
            description: flowConfigurationDrawer.description!,
            appearance: flowConfigurationDrawer.appearance!,
            nodeConfiguration: configuration.filter(
              (nodeConfiguration) =>
                nodeConfiguration.nodeID === flowConfigurationDrawer.nodeID!
            )[0],
          });
        }
      },
      ({ error, payload }: ApiResponse) => {
        setLoading(false);
        if (error) console.error(payload);
      }
    );
  }, [flowConfigurationDrawer]);

  useEffect(() => {
    setSocket(connectSocketIO());
    return () => {
      if (socket) disconnectSocketIO(socket)();
    };
  }, []);

  return (
    <Drawer
      open={isOpen()}
      backdrop="static"
      onClose={() => drawerClosedHandler()}
      onExited={() => setNodeConfigurations(drawerInitialNodeConfigurations)}
    >
      <DrawerHeader
        nodeConfigurations={nodeConfigurations}
        enableDisabledButton={() =>
          updateNodeConfiguration({
            disabled: !nodeConfigurations.disabled,
          })
        }
        cancelButton={() => drawerClosedHandler()}
        confirmButton={() => drawerClosedHandler(true)}
      />
      <Drawer.Body className="flow-configuration-drawer">
        <Panel bodyFill>
          <NodeNameInput
            disabled={isLoading}
            placeholder={moduleNode?.name}
            value={nodeConfigurations.label}
            onChange={(value: string) =>
              updateNodeConfiguration({ label: value })
            }
          />
          {isLoading ? (
            <Placeholder.Paragraph rows={10} rowHeight={10} />
          ) : (
            <>
              <Stack
                alignItems="center"
                style={{ paddingBottom: 20 }}
                spacing={12}
              >
                <Stack.Item>
                  <Heading level={5}>Config Reference ID : </Heading>
                </Stack.Item>
                <Stack.Item>
                  <Text muted style={{ userSelect: "text" }}>
                    {flowConfigurationDrawer.nodeID}
                  </Text>
                </Stack.Item>
              </Stack>
              <NodeConfigurationTabs
                moduleNode={moduleNode}
                nodeConfigurations={nodeConfigurations}
                disabled={isLoading}
                onChange={updateNodeConfiguration}
              />
            </>
          )}
        </Panel>
      </Drawer.Body>
    </Drawer>
  );
}
