import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Badge, FlexboxGrid } from "rsuite";
import { IconWrapper } from "@ecoflow/components-lib";
import { TbRouteSquare2 } from "react-icons/tb";
import { FlowsDataTypes } from "@ecoflow/types";

const RequestNode = memo(
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
                      <IconWrapper icon={icon ? icon : TbRouteSquare2} />
                    </FlexboxGrid>
                  </div>
                  <div className="node-label">{label}</div>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
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
                      <IconWrapper icon={icon ? icon : TbRouteSquare2} />
                    </FlexboxGrid>
                  </div>
                  <div className="node-label">{label}</div>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
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

export default RequestNode;
