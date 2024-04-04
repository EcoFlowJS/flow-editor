import { IconWrapper } from "@ecoflow/components-lib";
import { memo } from "react";
import { CgDebug } from "react-icons/cg";
import { Handle, NodeProps, Position } from "reactflow";
import { FlexboxGrid } from "rsuite";

const DebugNode = memo(({ id, data, isConnectable }: NodeProps) => {
  return (
    <>
      <FlexboxGrid justify="center" align="middle" style={{ width: "100%" }}>
        <FlexboxGrid.Item>
          <div className="node">
            <div
              className="node-label"
              style={{ padding: "5px 35px 5px 10px" }}
            >
              {data.label}
            </div>
            <div className="node-icon-right">
              <FlexboxGrid
                justify="center"
                align="middle"
                style={{ height: "100%" }}
              >
                <IconWrapper icon={data.icon ? data.icon : CgDebug} />
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
  );
});

export default DebugNode;
