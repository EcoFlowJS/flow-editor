import { FlexboxGrid, IconButton, Tooltip, Whisper } from "rsuite";
import ResponsiveNav from "@rsuite/responsive-nav";
import { useEffect, useState } from "react";
import {
  AlertModal,
  IconWrapper,
  Form,
  FormGroup,
} from "@ecoflow/components-lib";
import { BiSolidLayerPlus } from "react-icons/bi";
import { Flows } from "@ecoflow/types";
import "./style.less";
import flowEditorHandlers from "../../../hooks/flowEditorHandlers.hook";
import { isUndefined } from "lodash";

interface FlowHeaderProps {
  flows?: Flows;
}

export default function FlowHeader({ flows }: FlowHeaderProps) {
  const flowHandlers = flowEditorHandlers();
  const [activeKey, setActiveKey] = useState<string | number>("Flow1");
  const [nameFormValue, setNameFormValue] = useState({ flowName: "" });
  const [addRenameOpen, setAddRenameOpen] = useState<{
    show: boolean;
    mode?: "ADD" | "EDIT";
    editID?: string;
  }>({ show: false, mode: "ADD" });
  const [items, setItems] = useState(
    flows
      ? flows.map((flow) => {
          return {
            eventKey: flow,
            label: flow,
          };
        })
      : [{ eventKey: "Flow1", label: "Flow1" }]
  );

  const onSelectHandler = (eventKey: string | number | undefined) => {
    setActiveKey((key) => (typeof eventKey !== "undefined" ? eventKey : key));
  };

  const removeFlowHandler = (eventKey: string) => {
    const nextItems = [...items];
    const removedFlow = nextItems.splice(
      nextItems.indexOf({ eventKey, label: eventKey }),
      1
    );
    setItems(nextItems);
    setActiveKey(nextItems[0] ? nextItems[0].eventKey : "");
    flowHandlers.removeFlow(removedFlow[0].eventKey);
  };

  const addRenameHandler = (flowID?: string) => {
    try {
      if (isUndefined(flowID)) {
        flowHandlers.addFlows(nameFormValue.flowName);
        setItems([
          ...items,
          {
            eventKey: nameFormValue.flowName,
            label: nameFormValue.flowName,
          },
        ]);
        setNameFormValue((name) => {
          name.flowName = "";
          return name;
        });
        setAddRenameOpen({ show: false });
        return;
      }
      flowHandlers.renameFlow({
        oldName: flowID,
        newName: nameFormValue.flowName,
      });
      items.splice(items.indexOf({ eventKey: flowID, label: flowID }), 1, {
        eventKey: nameFormValue.flowName,
        label: nameFormValue.flowName,
      });
      setItems(items);
      setNameFormValue((name) => {
        name.flowName = "";
        return name;
      });
      setAddRenameOpen({ show: false });
      if (activeKey === flowID) setActiveKey(nameFormValue.flowName);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isUndefined(flows) || (flows && flows.length === 0))
      flowHandlers.addFlows("Flow1");
  }, []);

  useEffect(() => {
    if (!addRenameOpen.show) setNameFormValue({ flowName: "" });
  }, [addRenameOpen.show]);

  return (
    <>
      <FlexboxGrid
        className="flow-header"
        style={{ maxWidth: "calc(100vw - 200px)" }}
        justify="space-between"
        align="middle"
      >
        <FlexboxGrid.Item colspan={22}>
          <ResponsiveNav
            className="flow-selector"
            removable={items.length > 1}
            appearance="tabs"
            activeKey={activeKey}
            onSelect={onSelectHandler}
            onItemRemove={(eventKey: string | number) =>
              removeFlowHandler(eventKey.toString())
            }
          >
            {items.map((item) => (
              <ResponsiveNav.Item
                as="div"
                key={item.eventKey}
                eventKey={item.eventKey}
                onDoubleClick={() =>
                  setAddRenameOpen({
                    show: true,
                    mode: "EDIT",
                    editID: item.eventKey,
                  })
                }
              >
                {item.label}
              </ResponsiveNav.Item>
            ))}
          </ResponsiveNav>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={2}>
          <FlexboxGrid justify="end">
            <FlexboxGrid.Item>
              <Whisper
                placement="auto"
                speaker={<Tooltip arrow={false}>Add new flow</Tooltip>}
              >
                <IconButton
                  appearance="subtle"
                  icon={<IconWrapper icon={BiSolidLayerPlus} />}
                  onClick={() =>
                    setAddRenameOpen({
                      show: true,
                      mode: "ADD",
                    })
                  }
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
            />
          </Form>
        </AlertModal.Body>
      </AlertModal>
    </>
  );
}
