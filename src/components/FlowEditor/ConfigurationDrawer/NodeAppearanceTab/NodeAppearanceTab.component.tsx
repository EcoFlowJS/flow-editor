import { ModuleTypes, NodeAppearanceConfigurations } from "@ecoflow/types";
import { useEffect, useState } from "react";
import { FlexboxGrid, Input, Panel, SelectPicker, Stack, Toggle } from "rsuite";
import defaultNodeAppearance from "../../../../defaults/defaultNodeAppearance.default";
import iconItems from "./iconItems";
import { IconWrapper } from "@ecoflow/components-lib";
import iconFetcher from "../../../../helper/iconFetcher";

interface NodeAppearanceTabProps {
  type?: ModuleTypes;
  values?: NodeAppearanceConfigurations;
  onChange?: (value: NodeAppearanceConfigurations) => void;
}

export default function NodeAppearanceTab({
  type = "Request",
  values = defaultNodeAppearance,
  onChange = () => {},
}: NodeAppearanceTabProps) {
  const [nodeAppearanceConfigurations, setNodeAppearanceConfigurations] =
    useState<NodeAppearanceConfigurations>(values);

  const updatedNodesAppearance = (value: NodeAppearanceConfigurations) => {
    setNodeAppearanceConfigurations((nodeAppearanceConfig) => {
      return {
        ...nodeAppearanceConfig,
        ...value,
      };
    });
  };

  useEffect(
    () => onChange(nodeAppearanceConfigurations),
    [nodeAppearanceConfigurations]
  );

  return (
    <>
      <Panel>
        <Stack spacing={20} justifyContent="space-between">
          Label
          <Toggle
            checked={nodeAppearanceConfigurations.label}
            onChange={(checked) => updatedNodesAppearance({ label: checked })}
          />
        </Stack>
      </Panel>
      <Panel>
        <FlexboxGrid justify="space-between">
          Icon
          <FlexboxGrid.Item colspan={16}>
            <SelectPicker
              block
              virtualized
              data={iconItems}
              groupBy="iconGroup"
              onClean={() => updatedNodesAppearance({ icon: null })}
              onSelect={(value) => updatedNodesAppearance({ icon: value })}
              renderValue={(value) => <IconWrapper icon={iconFetcher[value]} />}
              renderMenuItem={(label) =>
                typeof label === "string" ? (
                  <IconWrapper icon={iconFetcher[label]} />
                ) : (
                  <IconWrapper
                    icon={iconFetcher[(label as any).props.children]}
                  />
                )
              }
              value={
                nodeAppearanceConfigurations.icon
                  ? nodeAppearanceConfigurations.icon
                  : type === "Request"
                  ? "TbRouteSquare2"
                  : type === "Middleware"
                  ? "GiServerRack"
                  : type === "Response"
                  ? "LuSquareStack"
                  : type === "Debug"
                  ? "CgDebug"
                  : null
              }
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Panel>
      <Panel header="Port labels">
        <Panel>
          <FlexboxGrid justify="space-between" align="middle">
            <FlexboxGrid.Item>Input:</FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <Input
                style={{ width: 280 }}
                disabled={type === "Request"}
                value={nodeAppearanceConfigurations.portLabel?.input}
                onChange={(value) =>
                  updatedNodesAppearance({
                    portLabel: {
                      ...nodeAppearanceConfigurations.portLabel,
                      input: value,
                    },
                  })
                }
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Panel>

        <Panel>
          <FlexboxGrid justify="space-between" align="middle">
            <FlexboxGrid.Item>Output:</FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <Input
                style={{ width: 280 }}
                disabled={type === "Debug" || type === "Response"}
                value={nodeAppearanceConfigurations.portLabel?.output}
                onChange={(value) =>
                  updatedNodesAppearance({
                    portLabel: {
                      ...nodeAppearanceConfigurations.portLabel,
                      output: value,
                    },
                  })
                }
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Panel>
      </Panel>
    </>
  );
}
