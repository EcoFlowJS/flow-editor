import { IconWrapper } from "@ecoflow/components-lib";
import { FlowsDataTypes } from "@ecoflow/types";
import { memo } from "react";
import { CgDebug } from "react-icons/cg";
import { Handle, NodeProps, Position } from "reactflow";
import { Badge, FlexboxGrid } from "rsuite";

const DebugNode = memo(
  ({ id, data, isConnectable, selected }: NodeProps<FlowsDataTypes>) => {
    const { label, icon, disabled, configured, openDrawer } = data;
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
                      <IconWrapper icon={icon ? icon : CgDebug} />
                    </FlexboxGrid>
                  </div>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-target`}
              isConnectable={isConnectable}
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
                      <IconWrapper icon={icon ? icon : CgDebug} />
                    </FlexboxGrid>
                  </div>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-target`}
              isConnectable={isConnectable}
            />
          </Badge>
        )}
      </>
    );
  }
);

export default DebugNode;
