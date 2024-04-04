import { IconWrapper } from "@ecoflow/components-lib";
import { memo } from "react";
import { GiServerRack } from "react-icons/gi";
import { Handle, NodeProps, Position } from "reactflow";
import { FlexboxGrid } from "rsuite";

const MiddlewareNode = memo(({ id, data, isConnectable }: NodeProps) => {
  return (
    <>
      <FlexboxGrid justify="center" align="middle" style={{ width: "100%" }}>
        <FlexboxGrid.Item>
          <div className="node">
            <div className="node-icon-left">
              <FlexboxGrid
                justify="center"
                align="middle"
                style={{ height: "100%" }}
              >
                <IconWrapper icon={data.icon ? data.icon : GiServerRack} />
              </FlexboxGrid>
            </div>
            <div className="node-label">{data.label}</div>
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
  );
});

export default MiddlewareNode;
