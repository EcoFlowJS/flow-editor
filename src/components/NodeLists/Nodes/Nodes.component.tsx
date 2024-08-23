import {
  CSSProperties,
  DetailedHTMLProps,
  DragEventHandler,
  DragEvent,
  FC,
  HTMLAttributes,
  LiHTMLAttributes,
} from "react";
import "./style.less";
import { FlexboxGrid, Popover, Whisper } from "rsuite";
import { IconWrapper } from "@ecoflow/components-lib";
import { EcoModuleID, ModuleTypes } from "@ecoflow/types";
import {
  TbRouteSquare2,
  TbTimelineEventPlus,
  TbTimelineEventText,
} from "react-icons/tb";
import { GiServerRack } from "react-icons/gi";
import { CgDebug } from "react-icons/cg";
import { LuSquareStack } from "react-icons/lu";
import { GrConfigure } from "react-icons/gr";
import colorGenerator from "../../../helper/colorGenerator";
import { useAtomValue } from "jotai";
import darkModeAtom from "../../../store/theme.mode";

interface NodesProps
  extends DetailedHTMLProps<
    Omit<LiHTMLAttributes<HTMLLIElement>, "onDragStart" | "children">,
    HTMLLIElement
  > {
  color?: CSSProperties["backgroundColor"];
  onDragStart?: DragEventHandler<HTMLDivElement>;
  icon?: FC<HTMLAttributes<SVGElement>>;
  moduleID: EcoModuleID;
  type?: ModuleTypes;
  label?: string;
  isInputsAvailable?: number;
}

export default function Nodes({
  role,
  className,
  color,
  draggable,
  type = "Request",
  moduleID,
  icon,
  label,
  isInputsAvailable,
  description = "",
  onDragStart,
  ...props
}: NodesProps & { description?: string }) {
  const isDarkMode = useAtomValue(darkModeAtom);

  const onDragStartNodeHandler = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(
      "application/ecoflow/nodes",
      JSON.stringify({
        moduleID,
        type,
        label,
        color,
        nodeDescription: description,
        ...(isInputsAvailable && isInputsAvailable > 0
          ? { configured: false }
          : { configured: true }),
      })
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
      <Whisper
        placement="top"
        delayOpen={1000}
        speaker={
          <Popover title="Description">
            <p>{description ? description : "No Description Available!"}</p>
          </Popover>
        }
      >
        <FlexboxGrid justify="center" align="middle" style={{ width: "100%" }}>
          <FlexboxGrid.Item>
            <div
              className={`node ${
                type === "Debug"
                  ? "node-debug"
                  : type === "Request"
                  ? "node-request"
                  : type === "Middleware"
                  ? "node-middleware"
                  : type === "Response"
                  ? "node-response"
                  : type === "EventListener"
                  ? "node-event-listener"
                  : type === "EventEmitter"
                  ? "node-event-emitter"
                  : type === "Configuration"
                  ? "node-configuration"
                  : "node-unknown"
              }`}
              style={
                color
                  ? {
                      backgroundColor: isDarkMode
                        ? color
                        : colorGenerator(color, 5)[3],
                    }
                  : {}
              }
              draggable={draggable ? draggable : true}
              onDragStart={onDragStart ? onDragStart : onDragStartNodeHandler}
            >
              {type === "Middleware" ||
              type === "Debug" ||
              type === "Response" ||
              type === "EventEmitter" ? (
                <span className="node-connection-left" />
              ) : (
                <></>
              )}

              {type === "Middleware" ||
              type === "Request" ||
              type === "EventListener" ||
              type === "Configuration" ? (
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
                          : type === "EventListener"
                          ? TbTimelineEventText
                          : type === "Configuration"
                          ? GrConfigure
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
                  type === "Debug" ||
                  type === "Response" ||
                  type === "EventEmitter"
                    ? { padding: "5px 35px 5px 10px" }
                    : {}
                }
              >
                {label}
              </div>

              {type === "Debug" ||
              type === "Response" ||
              type === "EventEmitter" ? (
                <div className="node-icon-right">
                  <FlexboxGrid
                    justify="center"
                    align="middle"
                    style={{ height: "100%" }}
                  >
                    <IconWrapper
                      icon={
                        icon
                          ? icon
                          : type === "Debug"
                          ? CgDebug
                          : type === "EventEmitter"
                          ? TbTimelineEventPlus
                          : LuSquareStack
                      }
                    />
                  </FlexboxGrid>
                </div>
              ) : (
                <></>
              )}

              {type === "Middleware" ||
              type === "Request" ||
              type === "EventListener" ? (
                <span className="node-connection-right" />
              ) : (
                <></>
              )}
            </div>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Whisper>
    </li>
  );
}
