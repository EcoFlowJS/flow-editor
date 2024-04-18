import {
  Button,
  ButtonGroup,
  Dropdown,
  IconButton,
  Popover,
  Whisper,
} from "rsuite";
import ArrowDownIcon from "@rsuite/icons/ArrowDown";
import { IconWrapper } from "@ecoflow/components-lib";
import { GrDeploy } from "react-icons/gr";
import { RiNodeTree, RiRestartLine } from "react-icons/ri";
import { TbBinaryTree2 } from "react-icons/tb";
import { useAtomValue } from "jotai";
import {
  currentFlow,
  currentFlowConfigurations,
  currentFlowEdges,
  currentFlowNodes,
  flowEditor,
} from "../../../store/flowEditor.store";
import deployFlowConfigurations from "../../../service/flows/deployFlowConfigurations.service";
import { FlowsConfigurations } from "@ecoflow/types";

export default function DeployButton() {
  const flowConfigurations = useAtomValue(flowEditor);

  const activeFlow = useAtomValue(currentFlow);
  const activeFlowNodes = useAtomValue(currentFlowNodes);
  const activeFlowEdges = useAtomValue(currentFlowEdges);
  const activeFlowConfigurations = useAtomValue(currentFlowConfigurations);

  const handleDeployFull = () => {
    flowConfigurations[activeFlow] = {
      definitions: activeFlowNodes,
      connections: activeFlowEdges,
      configurations: activeFlowConfigurations,
    };

    deployFlowConfigurations(flowConfigurations).then(
      console.log,
      console.error
    );
  };

  const handleDeployCurrentFlow = () => {
    const flowConfigurations: FlowsConfigurations = Object.create({});
    flowConfigurations[activeFlow] = {
      definitions: activeFlowNodes,
      connections: activeFlowEdges,
      configurations: activeFlowConfigurations,
    };

    deployFlowConfigurations(flowConfigurations).then(
      console.log,
      console.error
    );
  };

  return (
    <ButtonGroup>
      <Button
        appearance="subtle"
        startIcon={<IconWrapper icon={GrDeploy} />}
        style={{ minWidth: 100 }}
        onClick={handleDeployFull}
      >
        Deploy
      </Button>
      <Whisper
        placement="bottomEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          const handleSelect = (eventKey: string | undefined) => {
            onClose();
            switch (eventKey) {
              case "Full":
                handleDeployFull();
                break;
              case "CurrentFlow":
                handleDeployCurrentFlow();
                break;
            }
          };
          return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
              <Dropdown.Menu onSelect={handleSelect}>
                <Dropdown.Item
                  eventKey="Full"
                  icon={<IconWrapper icon={GrDeploy} />}
                >
                  Full Deploy
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="CurrentFlow"
                  icon={<IconWrapper icon={TbBinaryTree2} />}
                >
                  Current Flow
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="OnlyModifiedNode"
                  disabled
                  title="yet to be implemented"
                  icon={<IconWrapper icon={RiNodeTree} />}
                >
                  Modified Nodes
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item
                  eventKey="RestartFlow"
                  icon={<IconWrapper icon={RiRestartLine} />}
                >
                  Restart Flow
                </Dropdown.Item>
              </Dropdown.Menu>
            </Popover>
          );
        }}
      >
        <IconButton icon={<ArrowDownIcon />} appearance="subtle" />
      </Whisper>
    </ButtonGroup>
  );
}
