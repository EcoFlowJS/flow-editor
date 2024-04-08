import { IconWrapper } from "@ecoflow/components-lib";
import { FlowsDataTypes } from "@ecoflow/types";
import { memo } from "react";
import { GiServerRack } from "react-icons/gi";
import { Handle, NodeProps, Position } from "reactflow";
import { Badge, FlexboxGrid } from "rsuite";

const MiddlewareNode = memo(
  ({ id, data, isConnectable, selected }: NodeProps<FlowsDataTypes>) => {
    const { label, icon, configured, disabled, openDrawer } = data;
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
                  <div className="node-icon-left">
                    <FlexboxGrid
                      justify="center"
                      align="middle"
                      style={{ height: "100%" }}
                    >
                      <IconWrapper icon={icon ? icon : GiServerRack} />
                    </FlexboxGrid>
                  </div>
                  <div className="node-label">{label}</div>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-target`}
              isConnectable={isConnectable}
            />
            <Handle
              type="source"
              position={Position.Right}
              id={`${id}-source`}
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
                  <div className="node-icon-left">
                    <FlexboxGrid
                      justify="center"
                      align="middle"
                      style={{ height: "100%" }}
                    >
                      <IconWrapper icon={icon ? icon : GiServerRack} />
                    </FlexboxGrid>
                  </div>
                  <div className="node-label">{label}</div>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-target`}
              isConnectable={isConnectable}
            />
            <Handle
              type="source"
              position={Position.Right}
              id={`${id}-source`}
              isConnectable={isConnectable}
            />
          </Badge>
        )}
      </>
    );
  }
);

export default MiddlewareNode;
