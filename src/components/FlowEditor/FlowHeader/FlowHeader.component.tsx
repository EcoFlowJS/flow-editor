import { FlexboxGrid, IconButton, Tooltip, Whisper } from "rsuite";
import ResponsiveNav from "@rsuite/responsive-nav";
import { useEffect, useState } from "react";
import { IconWrapper } from "@ecoflow/components-lib";
import generateFlowID from "../../../helpers/generateFlowID";
import { BiSolidLayerPlus } from "react-icons/bi";
import { Flows } from "@ecoflow/types";
import "./style.less";

interface FlowHeaderProps {
  flows?: Flows;
  onFlowChange?: (flows: Flows) => void;
}

export default function FlowHeader({
  flows,
  onFlowChange = () => {},
}: FlowHeaderProps) {
  const defaultFlowID = generateFlowID();
  const [activeKey, setActiveKey] = useState<string | number>(defaultFlowID);
  const [items, setItems] = useState(
    flows
      ? flows.map((flow) => {
          return {
            eventKey: flow.flowID,
            label: flow.flowName,
          };
        })
      : [{ eventKey: defaultFlowID, label: "Flow 1" }]
  );

  const onSelectHandler = (eventKey: string | number | undefined) => {
    setActiveKey((key) => (typeof eventKey !== "undefined" ? eventKey : key));
  };

  const addFlowHandler = () =>
    setItems((items) => {
      const itemKey = generateFlowID();
      return [
        ...items,
        {
          eventKey: itemKey,
          label: `Item ${items.length + 1}`,
        },
      ];
    });

  const removeFlowHandler = (eventKey: string | number) => {
    const nextItems = [...items];
    nextItems.splice(
      nextItems.map((item) => item.eventKey).indexOf(eventKey.toString()),
      1
    );
    setItems(nextItems);
    setActiveKey(nextItems[0] ? nextItems[0].eventKey : "");
  };

  useEffect(
    () =>
      onFlowChange(
        items.map((item) => {
          return {
            flowID: item.eventKey,
            flowName: item.label,
          };
        })
      ),
    [items]
  );

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
            onItemRemove={removeFlowHandler}
          >
            {items.map((item) => (
              <ResponsiveNav.Item
                as="div"
                key={item.eventKey}
                eventKey={item.eventKey}
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
                  onClick={addFlowHandler}
                />
              </Whisper>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <div className="flow-selector-bottom-bar" />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  );
}
