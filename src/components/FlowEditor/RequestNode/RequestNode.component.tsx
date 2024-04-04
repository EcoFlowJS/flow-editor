import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { FlexboxGrid } from "rsuite";
import { IconWrapper } from "@ecoflow/components-lib";
import { TbRouteSquare2 } from "react-icons/tb";

const RequestNode = memo(({ id, data, isConnectable }: NodeProps) => {
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
                <IconWrapper icon={data.icon ? data.icon : TbRouteSquare2} />
              </FlexboxGrid>
            </div>
            <div className="node-label">{data.label}</div>
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
  );
});

export default RequestNode;
