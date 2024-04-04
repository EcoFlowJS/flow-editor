import { IconWrapper } from "@ecoflow/components-lib";
import { memo } from "react";
import { LuSquareStack } from "react-icons/lu";
import { NodeProps, Position } from "reactflow";
import { FlexboxGrid } from "rsuite";
import NodeTargetHandler from "./NodeTargetHandler/NodeTargetHandler.component";

const ResponseNode = memo(({ id, data }: NodeProps) => {
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
                <IconWrapper icon={data.icon ? data.icon : LuSquareStack} />
              </FlexboxGrid>
            </div>
          </div>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <NodeTargetHandler
        type="target"
        position={Position.Left}
        id={`${id}-target`}
        isConnectable={data.isConnectable ? data.isConnectable : 1}
      />
    </>
  );
});

export default ResponseNode;
