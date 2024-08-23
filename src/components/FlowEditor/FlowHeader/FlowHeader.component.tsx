import {
  FlexboxGrid,
  Form,
  Highlight,
  IconButton,
  Text,
  Tooltip,
  Whisper,
} from "rsuite";
import ResponsiveNav from "@rsuite/responsive-nav";
import { KeyboardEvent, useEffect, useState } from "react";
import { AlertModal, IconWrapper, FormGroup } from "@ecoflow/components-lib";
import { BiSolidLayerPlus } from "react-icons/bi";
import "./style.less";
import flowEditorHandlers from "../../../hooks/flowEditorHandlers.hook";
import { isEmpty, isString, isUndefined } from "lodash";
import { useSetAtom } from "jotai";
import {
  errorNotification,
  successNotification,
} from "../../../store/notification.store";
import FlowEditorSettingsDropdownMenu from "./FlowEditorSettingsDropdownMenu/FlowEditorSettingsDropdownMenu.component";
import { FaGears } from "react-icons/fa6";
import { currentFlow } from "../../../store/flowEditor.store";
import { GrConfigure } from "react-icons/gr";
import { PiTreeStructureBold } from "react-icons/pi";
import deployFlowConfigurations from "../../../service/flows/deployFlowConfigurations.service";
import { ApiResponse } from "@ecoflow/types";

interface FlowHeaderProps {
  onFlowSelect?: (flowName: string) => void;
  disabled?: boolean;
}

export default function FlowHeader({
  onFlowSelect = () => {},
  disabled,
}: FlowHeaderProps) {
  const flowHandlers = flowEditorHandlers();
  const [activeKey, setActiveKey] = useState<string>("");
  const setCurrentFlow = useSetAtom(currentFlow);
  const [flows, setFlows] = useState(["configs", "Flow1"]);
  const [nameFormValue, setNameFormValue] = useState({ flowName: "" });
  const [addRenameOpen, setAddRenameOpen] = useState<{
    show: boolean;
    mode?: "ADD" | "EDIT";
    editID?: string;
  }>({ show: false });

  const [deployConfigAlert, setDeployConfigAlert] = useState(false);

  //Notifications
  const errorNoti = useSetAtom(errorNotification);
  const setSuccessNotification = useSetAtom(successNotification);

  const onSelectHandler = (eventKey?: string) => {
    if (eventKey && eventKey !== "configs" && activeKey === "configs")
      setDeployConfigAlert(true);

    setActiveKey((key) => (typeof eventKey !== "undefined" ? eventKey : key));
  };

  const removeFlowHandler = (eventKey: string) => {
    if (eventKey === "configs") return;
    const nextFlows = [...flows];
    const removedFlow = nextFlows.splice(nextFlows.indexOf(eventKey), 1);
    setFlows(nextFlows);
    setActiveKey(nextFlows[1] ? nextFlows[1] : "");
    flowHandlers.dropFlow(removedFlow[0]);
  };

  const addRenameHandler = (flowID?: string) => {
    if (isEmpty(nameFormValue.flowName)) {
      errorNoti({
        show: true,
        header: "Flow Error",
        message: "Please enter a name for flow",
      });
      return;
    }

    try {
      if (isUndefined(flowID)) {
        flowHandlers.addFlow(nameFormValue.flowName);
        setFlows([...flows, nameFormValue.flowName]);
        setNameFormValue((name) => {
          name.flowName = "";
          return name;
        });
        setAddRenameOpen({ show: false });
        return;
      }
      flowHandlers.renameFlow(flowID, nameFormValue.flowName);
      flows.splice(flows.indexOf(flowID), 1, nameFormValue.flowName);
      setFlows(flows);
      setNameFormValue((name) => {
        name.flowName = "";
        return name;
      });
      setAddRenameOpen({ show: false });
      if (activeKey === flowID) setActiveKey(nameFormValue.flowName);
    } catch (error) {
      errorNoti({
        show: true,
        header: "Flow Error",
        message: typeof error === "string" ? error : String(error),
      });
    }
  };

  const deployConfigFlow = () => {
    deployFlowConfigurations(
      {
        configs: flowHandlers.flowEditorValue["configs"],
      },
      true
    ).then(
      (response: ApiResponse) => {
        if (response.success) {
          setDeployConfigAlert(false);
          setSuccessNotification({
            show: true,
            placement: "bottomStart",
            header: "Deployment Success",
            message: "Configurations successfully deployed.",
          });

          flowHandlers.flowEditorValue["configs"].definitions.forEach(
            ({ id }) =>
              flowHandlers.updateNodeDefinitionData(id, { isError: false })
          );
        }
      },
      (reject: ApiResponse) => {
        if (reject.error) {
          errorNoti({
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

          setDeployConfigAlert(false);
          setActiveKey("configs");
        }
      }
    );
  };

  useEffect(() => {
    if (
      !isUndefined(disabled) &&
      !disabled &&
      Object.keys(flowHandlers.flowEditorValue).length === 0
    ) {
      setActiveKey("Flow1");
      flowHandlers.addFlow("configs");
      flowHandlers.addFlow("Flow1");
    }
  }, [disabled]);

  useEffect(() => {
    setCurrentFlow(activeKey);
    onFlowSelect(activeKey);
  }, [activeKey]);

  useEffect(() => {
    if (!addRenameOpen.show) setNameFormValue({ flowName: "" });
  }, [addRenameOpen.show]);

  useEffect(() => {
    if (flows.length === 2 && flows[0] === "configs" && flows[1] === "Flow1") {
      const flows = Object.keys(flowHandlers.flowEditorValue);
      flows.splice(flows.indexOf("configs"), 1);

      setFlows(
        Object.keys(flowHandlers.flowEditorValue).length > 1
          ? ["configs", ...flows]
          : ["configs", "Flow1"]
      );

      setActiveKey((activeKey) => (activeKey ? activeKey : flows[0]));
    }
  }, [flowHandlers.flowEditorValue]);

  return (
    <>
      <FlexboxGrid
        className="flow-header"
        style={{ maxWidth: "calc(100vw - 200px)" }}
        justify="space-between"
        align="middle"
      >
        <FlexboxGrid.Item style={{ width: "calc(100vw - 200px - 80px)" }}>
          <ResponsiveNav
            className="flow-selector"
            removable={flows.length > 1}
            appearance="tabs"
            activeKey={activeKey}
            onSelect={(eventKey) => onSelectHandler(eventKey?.toString())}
            onItemRemove={(eventKey: string | number) =>
              removeFlowHandler(eventKey.toString())
            }
          >
            {flows.map((flow) => (
              <ResponsiveNav.Item
                as="div"
                key={flow}
                icon={
                  flow === "configs" ? (
                    <IconWrapper icon={GrConfigure} />
                  ) : (
                    <IconWrapper icon={PiTreeStructureBold} />
                  )
                }
                disabled={disabled}
                eventKey={flow}
                onDoubleClick={
                  flow !== "configs"
                    ? () =>
                        setAddRenameOpen({
                          show: true,
                          mode: "EDIT",
                          editID: flow,
                        })
                    : () => {}
                }
              >
                {flow}
              </ResponsiveNav.Item>
            ))}
          </ResponsiveNav>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item style={{ width: 80 }}>
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item>
              <Whisper
                placement="auto"
                speaker={<Tooltip arrow={false}>Add new flow</Tooltip>}
              >
                <IconButton
                  appearance="subtle"
                  icon={<IconWrapper icon={BiSolidLayerPlus} />}
                  disabled={disabled}
                  onClick={() =>
                    setAddRenameOpen({
                      show: true,
                      mode: "ADD",
                    })
                  }
                />
              </Whisper>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <Whisper
                placement="bottomEnd"
                trigger="click"
                enterable
                speaker={FlowEditorSettingsDropdownMenu}
              >
                <IconButton
                  appearance="subtle"
                  icon={<IconWrapper icon={FaGears} />}
                />
              </Whisper>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <div className="flow-selector-bottom-bar" />
        </FlexboxGrid.Item>
      </FlexboxGrid>

      <AlertModal
        open={typeof addRenameOpen.mode !== "undefined" && addRenameOpen.show}
        onClose={() => setAddRenameOpen({ show: false })}
        CancelButtonProps={{
          appearance: "ghost",
          onClick: () => setAddRenameOpen({ show: false }),
        }}
        confirmButtonProps={{
          appearance: "ghost",
          color: "green",
          onClick: () => addRenameHandler(addRenameOpen.editID),
        }}
      >
        <AlertModal.Header>
          {addRenameOpen.mode === "ADD"
            ? "Enter Flow name"
            : `Rename Flow ${addRenameOpen.editID}`}
        </AlertModal.Header>
        <AlertModal.Body>
          <Form
            fluid
            onChange={(formValue: any) => setNameFormValue(formValue)}
            formValue={nameFormValue}
          >
            <FormGroup
              name="flowName"
              label="Name"
              helperText="Required"
              autoComplete="off"
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter")
                  addRenameHandler(addRenameOpen.editID);
              }}
            />
          </Form>
        </AlertModal.Body>
      </AlertModal>

      <AlertModal
        open={deployConfigAlert}
        onClose={() => setDeployConfigAlert(false)}
        size="md"
        CancelButtonProps={{
          color: "red",
          onClick: () => setDeployConfigAlert(false),
        }}
        confirmButtonProps={{
          color: "green",
          onClick: deployConfigFlow,
        }}
      >
        <AlertModal.Header>
          Do you want deploy the configuration to keep it up to date?
        </AlertModal.Header>
        <AlertModal.Body>
          <Highlight query="configs">
            <Text size="lg">
              Any changes made here will not affect the flow until and unless
              the configs flow is deployed. Please update your configuration.
            </Text>
          </Highlight>
          <br />
          <br />
          <br />
          <Text muted>
            Note: On Full deploy config flow get deployed automatic. If you want
            all flows at once you may ignore this message.
          </Text>
        </AlertModal.Body>
      </AlertModal>
    </>
  );
}
