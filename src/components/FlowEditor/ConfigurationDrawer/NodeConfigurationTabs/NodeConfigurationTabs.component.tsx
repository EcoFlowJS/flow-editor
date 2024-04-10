import { IconWrapper } from "@ecoflow/components-lib";
import { FlowsConfigurationsDrawer, Node } from "@ecoflow/types";
import { GrConfigure } from "react-icons/gr";
import { Panel, Tabs } from "rsuite";
import NodeInputConfigurationsTab from "../NodeInputConfigurationsTab/NodeInputConfigurationsTab.component";
import { MdOutlineDescription } from "react-icons/md";
import NodeDescriptionTab from "../NodeDescriptionTab/NodeDescriptionTab.component";
import NodeAppearanceTab from "../NodeAppearanceTab/NodeAppearanceTab.component";
import { LiaObjectGroup } from "react-icons/lia";

interface NodeConfigurationTabsProps {
  moduleNode?: Node;
  nodeConfigurations?: Required<
    Pick<
      FlowsConfigurationsDrawer,
      | "nodeConfiguration"
      | "label"
      | "disabled"
      | "description"
      | "appearance"
      | "configured"
    >
  >;
  disabled?: boolean;
  onChange?: (
    value: Pick<
      FlowsConfigurationsDrawer,
      "label" | "configured" | "disabled" | "description" | "appearance"
    > & {
      nodeConfiguration?: { [key: string]: any };
    }
  ) => void;
}

export default function NodeConfigurationTabs({
  moduleNode,
  nodeConfigurations,
  disabled,
  onChange = () => {},
}: NodeConfigurationTabsProps) {
  return (
    <Tabs
      defaultActiveKey={moduleNode?.inputs ? "configuration" : "description"}
    >
      {moduleNode?.inputs ? (
        <Tabs.Tab
          eventKey="configuration"
          disabled={disabled}
          title="Configurations"
          icon={<IconWrapper icon={GrConfigure} />}
        >
          <Panel>
            <NodeInputConfigurationsTab
              nodeInputs={moduleNode.inputs}
              nodeConfigurations={nodeConfigurations?.nodeConfiguration.configs}
              onChange={(value) => onChange({ nodeConfiguration: value })}
            />
          </Panel>
        </Tabs.Tab>
      ) : (
        <></>
      )}
      <Tabs.Tab
        eventKey="description"
        disabled={disabled}
        title="Description"
        icon={<IconWrapper icon={MdOutlineDescription} />}
      >
        <Panel bodyFill style={{ paddingTop: 20 }}>
          <NodeDescriptionTab
            text={nodeConfigurations?.description}
            onChange={(value) => onChange({ description: value })}
          />
        </Panel>
      </Tabs.Tab>
      <Tabs.Tab
        eventKey="appearance"
        disabled={disabled}
        title="Appearance"
        icon={<IconWrapper icon={LiaObjectGroup} />}
      >
        <Panel>
          <NodeAppearanceTab
            values={nodeConfigurations?.appearance}
            type={moduleNode?.type}
            onChange={(value) => onChange({ appearance: value })}
          />
        </Panel>
      </Tabs.Tab>
    </Tabs>
  );
}
