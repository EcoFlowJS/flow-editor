import {
  CSSProperties,
  DetailedHTMLProps,
  DragEventHandler,
  FC,
  HTMLAttributes,
  LiHTMLAttributes,
} from "react";
import "./style.less";
import { FlexboxGrid } from "rsuite";
import { IconWrapper } from "@ecoflow/components-lib";
import { EcoModuleID, ModuleTypes } from "@ecoflow/types";
import { TbRouteSquare2 } from "react-icons/tb";
import { GiServerRack } from "react-icons/gi";
import { CgDebug } from "react-icons/cg";
import { LuSquareStack } from "react-icons/lu";

interface NodesProps
  extends DetailedHTMLProps<
    Omit<LiHTMLAttributes<HTMLLIElement>, "onDragStart" | "children">,
    HTMLLIElement
  > {
  color?: CSSProperties["backgroundColor"];
  onDragStart?: DragEventHandler<HTMLDivElement>;
  icon?: FC<HTMLAttributes<SVGElement>>;
  nodeID: EcoModuleID;
  type?: ModuleTypes;
  label?: string;
}

export default function Nodes({
  role,
  className,
  draggable,
  type = "Request",
  nodeID,
  icon,
  label,
  onDragStart,
  ...props
}: NodesProps) {
  const onDragStartNodeHandler = (event: any) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeID, type, label })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <li
      role={role ? role : "none presentation`"}
      className={
        className
          ? `rs-dropdown-item rs-dropdown-node ${className}`
          : "rs-dropdown-item rs-dropdown-node"
      }
      {...props}
    >
      <FlexboxGrid justify="center" align="middle" style={{ width: "100%" }}>
        <FlexboxGrid.Item>
          <div
            className="node"
            draggable={draggable ? draggable : true}
            onDragStart={onDragStart ? onDragStart : onDragStartNodeHandler}
          >
            {type === "Middleware" ||
            type === "Debug" ||
            type === "Response" ? (
              <span className="node-connection-left" />
            ) : (
              <></>
            )}

            {type === "Middleware" || type === "Request" ? (
              <div className="node-icon-left">
                <FlexboxGrid
                  justify="center"
                  align="middle"
                  style={{ height: "100%" }}
                >
                  <IconWrapper
                    icon={
                      icon
                        ? icon
                        : type === "Request"
                        ? TbRouteSquare2
                        : GiServerRack
                    }
                  />
                </FlexboxGrid>
              </div>
            ) : (
              <></>
            )}

            <div
              className="node-label"
              style={
                type === "Debug" || type === "Response"
                  ? { padding: "5px 35px 5px 10px" }
                  : {}
              }
            >
              {label}
            </div>

            {type === "Debug" || type === "Response" ? (
              <div className="node-icon-right">
                <FlexboxGrid
                  justify="center"
                  align="middle"
                  style={{ height: "100%" }}
                >
                  <IconWrapper
                    icon={
                      icon ? icon : type === "Debug" ? CgDebug : LuSquareStack
                    }
                  />
                </FlexboxGrid>
              </div>
            ) : (
              <></>
            )}

            {type === "Middleware" || type === "Request" ? (
              <span className="node-connection-right" />
            ) : (
              <></>
            )}
          </div>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </li>
  );
}
