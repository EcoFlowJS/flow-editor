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
import { GrConfigure, GrDeploy } from "react-icons/gr";
import { RiRestartLine } from "react-icons/ri";
import { TbBinaryTree2 } from "react-icons/tb";
import { useAtomValue, useSetAtom } from "jotai";
import {
  currentFlow,
  currentFlowConfigurations,
  currentFlowEdges,
  currentFlowNodes,
  isLoadingFlowEditor,
} from "../../../store/flowEditor.store";
import deployFlowConfigurations from "../../../service/flows/deployFlowConfigurations.service";
import { ApiResponse, FlowsDescription } from "@ecoflow/types";
import isAllNodesConfigured from "../../../helper/isAllNodesConfigured";
import {
  errorNotification,
  successNotification,
} from "../../../store/notification.store";
import isString from "lodash/isString";
import flowEditorHandlers from "../../../hooks/flowEditorHandlers.hook";

export default function DeployButton() {
  const flowHandlers = flowEditorHandlers();
  const flowConfigurations = flowHandlers.flowEditorValue;

  const activeFlow = useAtomValue(currentFlow);
  const activeFlowNodes = useAtomValue(currentFlowNodes);
  const activeFlowEdges = useAtomValue(currentFlowEdges);
  const activeFlowConfigurations = useAtomValue(currentFlowConfigurations);

  const setErrorNotification = useSetAtom(errorNotification);
  const setSuccessNotification = useSetAtom(successNotification);
  const setFlowLoading = useSetAtom(isLoadingFlowEditor);

  const clearLoadingsAndErrors = () => {
    setFlowLoading((isLoading) => ({ ...isLoading, flow: false }));
    const nodeIDs: string[] = [];
    Object.keys(flowHandlers.flowEditorValue).forEach((key) => {
      flowHandlers.flowEditorValue[key].definitions.forEach((node) =>
        nodeIDs.push(node.id)
      );
    });
    nodeIDs.forEach((nodeID: string) =>
      flowHandlers.updateNodeDefinitionData(nodeID, { isError: false })
    );
  };

  const deploy = (
    flowConfigurations: FlowsDescription,
    current: boolean = false
  ) => {
    setFlowLoading((isLoading) => ({ ...isLoading, flow: true }));
    deployFlowConfigurations(flowConfigurations, current).then(
      (response: ApiResponse) => {
        clearLoadingsAndErrors();
        if (response.success)
          setSuccessNotification({
            show: true,
            placement: "bottomStart",
            header: "Deployment Success",
            message: isString(response.payload)
              ? response.payload
              : response.payload.msg,
          });
      },
      (reject: ApiResponse) => {
        clearLoadingsAndErrors();
        if (reject.error) {
          setErrorNotification({
            show: true,
            placement: "bottomStart",
            header: "Deploying flow Error",
            message: isString(reject.payload)
              ? reject.payload
              : reject.payload.msg,
          });

          if (reject.payload.nodesID)
            reject.payload.nodesID.forEach((nodeID: string) =>
              flowHandlers.updateNodeDefinitionData(nodeID, { isError: true })
            );
        }
      }
    );
  };

  const handleDeployFull = () => {
    flowConfigurations[activeFlow] = {
      definitions: activeFlowNodes,
      connections: activeFlowEdges,
      configurations: activeFlowConfigurations,
    };

    flowHandlers.updateFlowEditor(activeFlow, {
      definitions: activeFlowNodes,
      connections: activeFlowEdges,
      configurations: activeFlowConfigurations,
    });

    if (!isAllNodesConfigured(flowConfigurations)) {
      setErrorNotification({
        show: true,
        placement: "bottomStart",
        header: "Deploying flow Error",
        message:
          "All nodes not configured. Please configure it before deploying.",
      });
      return;
    }

    deploy(flowConfigurations);
  };

  const handleDeployCurrentFlow = () => {
    const flowConfigurations: FlowsDescription = Object.create({});
    flowConfigurations[activeFlow] = {
      definitions: activeFlowNodes,
      connections: activeFlowEdges,
      configurations: activeFlowConfigurations,
    };

    if (!isAllNodesConfigured(flowConfigurations)) {
      setErrorNotification({
        show: true,
        placement: "bottomStart",
        header: "Deploying flow Error",
        message:
          "All nodes not configured. Please configure it before deploying.",
      });
      return;
    }

    deploy(flowConfigurations, true);
  };

  const handleDeployConfigFlow = () => {
    deploy(
      {
        configs: flowHandlers.flowEditorValue["configs"],
      },
      true
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

              case "ConfigFlow":
                handleDeployConfigFlow();
                break;
              case "RestartFlow":
                // TODO: Restart flow
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
                  eventKey="ConfigFlow"
                  icon={<IconWrapper icon={GrConfigure} />}
                >
                  Deploy Config Flow
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item
                  eventKey="RestartFlow"
                  disabled
                  title="Not Supported Yet."
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
