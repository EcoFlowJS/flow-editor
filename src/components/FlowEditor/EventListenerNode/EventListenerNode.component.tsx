import { IconWrapper } from "@ecoflow/components-lib";
import { FlowsNodeDataTypes } from "@ecoflow/types";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Badge, FlexboxGrid, Popover, Text, Tooltip, Whisper } from "rsuite";
import iconFetcher from "../../../helper/iconFetcher";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import { TbTimelineEventText } from "react-icons/tb";

const EventListenerNode = memo(
  ({
    id,
    data,
    isConnectable,
    selected,
  }: NodeProps<FlowsNodeDataTypes & { nodeDescription?: string }>) => {
    const {
      label,
      icon,
      disabled,
      configured,
      description,
      nodeDescription,
      appearance,
      isError,
      openDrawer,
    } = data;

    const speaker = (
      <Popover title="Description">
        <p>{nodeDescription ? nodeDescription : "No Description Available!"}</p>
      </Popover>
    );

    return (
      <>
        {configured ? (
          <Whisper delayOpen={1000} placement="top" enterable speaker={speaker}>
            <div>
              <FlexboxGrid
                justify="center"
                align="middle"
                style={{ width: "100%" }}
                onDoubleClick={() =>
                  openDrawer
                    ? openDrawer(
                        label,
                        configured,
                        disabled,
                        description,
                        appearance
                      )
                    : null
                }
              >
                <FlexboxGrid.Item>
                  <div
                    className={`node node-event-listener ${
                      selected ? "selected" : ""
                    } ${disabled ? "flow-node-disabled" : ""} ${
                      isError ? "node-error" : ""
                    }`}
                    style={
                      !isUndefined(appearance.label) && !appearance.label
                        ? { width: 30, minHeight: 30 }
                        : { width: 130, minHeight: 30 }
                    }
                  >
                    <div
                      className="node-icon-left"
                      style={{
                        ...(!isUndefined(appearance.label) && !appearance.label
                          ? { borderRight: "none", borderRadius: 4 }
                          : {}),
                      }}
                    >
                      <FlexboxGrid
                        justify="center"
                        align="middle"
                        style={{ height: "100%" }}
                      >
                        <IconWrapper
                          icon={
                            appearance.icon
                              ? iconFetcher[appearance.icon]
                              : icon
                              ? icon
                              : TbTimelineEventText
                          }
                        />
                      </FlexboxGrid>
                    </div>
                    {!isUndefined(appearance.label) && appearance.label ? (
                      <div className="node-label">{label}</div>
                    ) : (
                      <></>
                    )}
                  </div>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              {!isUndefined(appearance.portLabel?.output) &&
              !isEmpty(appearance.portLabel.output) ? (
                <Whisper
                  placement="right"
                  speaker={
                    <Tooltip arrow={true}>
                      <Text size="lg">{appearance.portLabel.output}</Text>
                    </Tooltip>
                  }
                >
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`${id}-source`}
                    isConnectable={isConnectable}
                  />
                </Whisper>
              ) : (
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${id}-source`}
                  isConnectable={isConnectable}
                />
              )}
            </div>
          </Whisper>
        ) : (
          <Whisper delayOpen={1000} placement="top" enterable speaker={speaker}>
            <Badge color="orange">
              <FlexboxGrid
                justify="center"
                align="middle"
                style={{ width: "100%" }}
                onDoubleClick={() =>
                  openDrawer
                    ? openDrawer(
                        label,
                        configured,
                        disabled,
                        description,
                        appearance
                      )
                    : null
                }
              >
                <FlexboxGrid.Item>
                  <div
                    className={`node node-event-listener ${
                      selected ? "selected" : ""
                    } ${disabled ? "flow-node-disabled" : ""} ${
                      isError ? "node-error" : ""
                    }`}
                    style={
                      !isUndefined(appearance.label) && !appearance.label
                        ? { width: 30, minHeight: 30 }
                        : { width: 130, minHeight: 30 }
                    }
                  >
                    <div
                      className="node-icon-left"
                      style={{
                        ...(!isUndefined(appearance.label) && !appearance.label
                          ? { borderRight: "none", borderRadius: 4 }
                          : {}),
                      }}
                    >
                      <FlexboxGrid
                        justify="center"
                        align="middle"
                        style={{ height: "100%" }}
                      >
                        <IconWrapper
                          icon={
                            appearance.icon
                              ? iconFetcher[appearance.icon]
                              : icon
                              ? icon
                              : TbTimelineEventText
                          }
                        />
                      </FlexboxGrid>
                    </div>
                    {!isUndefined(appearance.label) && appearance.label ? (
                      <div className="node-label">{label}</div>
                    ) : (
                      <></>
                    )}
                  </div>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              {!isUndefined(appearance.portLabel?.output) &&
              !isEmpty(appearance.portLabel.output) ? (
                <Whisper
                  placement="right"
                  speaker={
                    <Tooltip arrow={true}>
                      <Text size="lg">{appearance.portLabel.output}</Text>
                    </Tooltip>
                  }
                >
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`${id}-source`}
                    isConnectable={isConnectable}
                  />
                </Whisper>
              ) : (
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${id}-source`}
                  isConnectable={isConnectable}
                />
              )}
            </Badge>
          </Whisper>
        )}
      </>
    );
  }
);

export default EventListenerNode;
