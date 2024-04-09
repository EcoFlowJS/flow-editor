import { useAtom } from "jotai";
import {
  Divider,
  Drawer,
  IconButton,
  Input,
  Panel,
  Placeholder,
  Stack,
  Tabs,
  Text,
  Tooltip,
  Whisper,
} from "rsuite";
import { flowEditorConfigurationsDrawer } from "../../../store/flowEditor.store";
import isUndefined from "lodash/isUndefined";
import { useEffect, useState } from "react";
import fetchNodes from "../../../service/nodes/fetchNodes.service";
import {
  ApiResponse,
  FlowsConfigurationsDrawer,
  Node,
  NodeAppearanceConfigurations,
} from "@ecoflow/types";
import "./style.less";
import { IconWrapper } from "@ecoflow/components-lib";
import { LuCircleOff, LuCircle } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { HiTag } from "react-icons/hi";
import { GrConfigure } from "react-icons/gr";
import { MdOutlineDescription } from "react-icons/md";
import { LiaObjectGroup } from "react-icons/lia";
import NodeDescriptionTab from "./NodeDescriptionTab/NodeDescriptionTab.component";
import NodeAppearanceTab from "./NodeAppearanceTab/NodeAppearanceTab.component";

interface ConfigurationDrawerProps {
  onDrawerClosed?: (
    nodeID: string,
    label: string,
    configured: boolean,
    disabled: boolean,
    description: string,
    appearance: NodeAppearanceConfigurations
  ) => void;
}

export default function ConfigurationDrawer({
  onDrawerClosed = () => {},
}: ConfigurationDrawerProps) {
  const [isLoading, setLoading] = useState(true);
  const [flowConfigurationDrawer, setConfigurationDrawer] = useAtom(
    flowEditorConfigurationsDrawer
  );
  const [moduleNode, setModuleNode] = useState<Node>(null);
  const [nodeConfigurations, setNodeConfigurations] = useState<
    Required<
      Pick<
        FlowsConfigurationsDrawer,
        "label" | "configured" | "disabled" | "description" | "appearance"
      >
    >
  >({
    label: "",
    configured: false,
    disabled: false,
    description: "",
    appearance: {},
  });

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
    appearance?: NodeAppearanceConfigurations | null
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
        : flowConfigurationDrawer.appearance!
    );
  };

  const drawerClosedHandler = (isClose?: boolean) => {
    if (isClose) {
      updateNodeDetails(
        nodeConfigurations.label ? nodeConfigurations.label : moduleNode?.name,
        true,
        nodeConfigurations.disabled,
        nodeConfigurations.description,
        nodeConfigurations.appearance
      );
      return;
    }
    updateNodeDetails();
  };

  const updateNodeConfiguration = (
    value: Pick<
      FlowsConfigurationsDrawer,
      "label" | "configured" | "disabled" | "description" | "appearance"
    >
  ) =>
    setNodeConfigurations((nodeConfigurations) => {
      return {
        ...nodeConfigurations,
        ...value,
      };
    });

  useEffect(() => {
    if (isOpen()) {
      setLoading(true);
      fetchNodes(flowConfigurationDrawer.moduleID?._id).then(
        (response: ApiResponse) => {
          setLoading(false);
          if (response.success) {
            setModuleNode(response.payload);
            setNodeConfigurations({
              label:
                flowConfigurationDrawer.label === response.payload.name
                  ? ""
                  : flowConfigurationDrawer.label!,
              configured: flowConfigurationDrawer.configured!,
              disabled: flowConfigurationDrawer.disabled!,
              description: flowConfigurationDrawer.description!,
              appearance: flowConfigurationDrawer.appearance!,
            });
          }
        },
        (reject: ApiResponse) => {
          setLoading(false);
          console.error(reject);
        }
      );
    }
  }, [flowConfigurationDrawer]);

  useEffect(() => console.log(moduleNode), [moduleNode]);

  return (
    <Drawer
      open={isOpen()}
      backdrop="static"
      onClose={() => drawerClosedHandler()}
    >
      <Drawer.Header>
        <Drawer.Title>Node Configurations</Drawer.Title>
        <Drawer.Actions>
          <Whisper
            placement="bottom"
            speaker={<Tooltip arrow={false}>Enable/Diable Node</Tooltip>}
          >
            <IconButton
              appearance="primary"
              color="cyan"
              icon={
                <IconWrapper
                  icon={nodeConfigurations.disabled ? LuCircleOff : LuCircle}
                />
              }
              onClick={() =>
                updateNodeConfiguration({
                  disabled: !nodeConfigurations.disabled,
                })
              }
            >
              {nodeConfigurations.disabled ? "Diabled" : "Enabled"}
            </IconButton>
          </Whisper>
          <Whisper
            placement="bottom"
            speaker={<Tooltip arrow={false}>Cancel</Tooltip>}
          >
            <IconButton
              appearance="primary"
              color="red"
              icon={<IconWrapper icon={FaXmark} />}
              onClick={() => drawerClosedHandler()}
            />
          </Whisper>
          <Whisper
            placement="bottom"
            speaker={<Tooltip arrow={false}>Confirm</Tooltip>}
          >
            <IconButton
              appearance="primary"
              color="green"
              icon={<IconWrapper icon={FaCheck} />}
              onClick={() => drawerClosedHandler(true)}
            />
          </Whisper>
        </Drawer.Actions>
      </Drawer.Header>
      <Drawer.Body className="flow-configuration-drawer">
        <Panel bodyFill>
          <Panel bodyFill>
            <Stack spacing={35}>
              <Text size="lg">
                <IconWrapper icon={HiTag} /> Name :
              </Text>
              <Stack.Item grow={1}>
                <Input
                  id="nodename"
                  autoComplete="off"
                  disabled={isLoading}
                  placeholder={moduleNode?.name}
                  value={nodeConfigurations.label}
                  onChange={(value: string) =>
                    updateNodeConfiguration({ label: value })
                  }
                />
              </Stack.Item>
            </Stack>
          </Panel>
          <Divider />
          {isLoading ? (
            <Placeholder.Paragraph rows={10} rowHeight={10} />
          ) : (
            <Tabs
              defaultActiveKey={
                moduleNode?.inputs ? "configuration" : "description"
              }
            >
              {moduleNode?.inputs ? (
                <Tabs.Tab
                  eventKey="configuration"
                  disabled={isLoading}
                  title="Configurations"
                  icon={<IconWrapper icon={GrConfigure} />}
                >
                  <Panel>
                    {flowConfigurationDrawer.label}
                    <br />
                    {JSON.stringify(flowConfigurationDrawer.moduleID)}
                    <br />
                    {flowConfigurationDrawer.nodeID}
                  </Panel>
                </Tabs.Tab>
              ) : (
                <></>
              )}
              <Tabs.Tab
                eventKey="description"
                disabled={isLoading}
                title="Description"
                icon={<IconWrapper icon={MdOutlineDescription} />}
              >
                <Panel bodyFill style={{ paddingTop: 20 }}>
                  <NodeDescriptionTab
                    text={nodeConfigurations.description}
                    onChange={(value) =>
                      updateNodeConfiguration({ description: value })
                    }
                  />
                </Panel>
              </Tabs.Tab>
              <Tabs.Tab
                eventKey="appearance"
                disabled={isLoading}
                title="Appearance"
                icon={<IconWrapper icon={LiaObjectGroup} />}
              >
                <Panel>
                  <NodeAppearanceTab />
                </Panel>
              </Tabs.Tab>
            </Tabs>
          )}
        </Panel>
      </Drawer.Body>
    </Drawer>
  );
}
