import { IconWrapper } from "@ecoflow/components-lib";
import { memo } from "react";
import { LuSquareStack } from "react-icons/lu";
import { NodeProps, Position } from "reactflow";
import { Badge, FlexboxGrid } from "rsuite";
import NodeTargetHandler from "./NodeTargetHandler/NodeTargetHandler.component";
import { FlowsDataTypes } from "@ecoflow/types";

const ResponseNode = memo(
  ({ id, data, selected }: NodeProps<FlowsDataTypes>) => {
    const { label, icon, configured, isConnectable, disabled, openDrawer } =
      data;
    return (
      <>
        {configured ? (
          <>
            <FlexboxGrid
              justify="center"
              align="middle"
              style={{ width: "100%" }}
              onDoubleClick={() =>
                openDrawer ? openDrawer(label, configured, disabled) : null
              }
            >
              <FlexboxGrid.Item>
                <div
                  className={`node ${selected ? "selected" : ""} ${
                    disabled ? "flow-node-disabled" : ""
                  }`}
                >
                  <div
                    className="node-label"
                    style={{ padding: "5px 35px 5px 10px" }}
                  >
                    {label}
                  </div>
                  <div className="node-icon-right">
                    <FlexboxGrid
                      justify="center"
                      align="middle"
                      style={{ height: "100%" }}
                    >
                      <IconWrapper icon={icon ? icon : LuSquareStack} />
                    </FlexboxGrid>
                  </div>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <NodeTargetHandler
              type="target"
              position={Position.Left}
              id={`${id}-target`}
              isConnectable={isConnectable ? isConnectable : 1}
            />
          </>
        ) : (
          <Badge color="orange">
            <FlexboxGrid
              justify="center"
              align="middle"
              style={{ width: "100%" }}
              onDoubleClick={() =>
                openDrawer ? openDrawer(label, configured, disabled) : null
              }
            >
              <FlexboxGrid.Item>
                <div
                  className={`node ${selected ? "selected" : ""} ${
                    disabled ? "flow-node-disabled" : ""
                  }`}
                >
                  <div
                    className="node-label"
                    style={{ padding: "5px 35px 5px 10px" }}
                  >
                    {label}
                  </div>
                  <div className="node-icon-right">
                    <FlexboxGrid
                      justify="center"
                      align="middle"
                      style={{ height: "100%" }}
                    >
                      <IconWrapper icon={icon ? icon : LuSquareStack} />
                    </FlexboxGrid>
                  </div>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <NodeTargetHandler
              type="target"
              position={Position.Left}
              id={`${id}-target`}
              isConnectable={isConnectable ? isConnectable : 1}
            />
          </Badge>
        )}
      </>
    );
  }
);

export default ResponseNode;
