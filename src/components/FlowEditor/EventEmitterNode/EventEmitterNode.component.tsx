import { IconWrapper } from "@ecoflow/components-lib";
import { FlowsNodeDataTypes } from "@ecoflow/types";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Badge, FlexboxGrid, Popover, Text, Tooltip, Whisper } from "rsuite";
import iconFetcher from "../../../helper/iconFetcher";
import { TbTimelineEventPlus } from "react-icons/tb";
import { useAtomValue } from "jotai";
import darkModeAtom from "../../../store/theme.mode";
import colorGenerator from "../../../helper/colorGenerator";

const EventEmitterNode = memo(
  ({
    id,
    data,
    selected,
  }: NodeProps<FlowsNodeDataTypes & { nodeDescription?: string }>) => {
    const isDarkMode = useAtomValue(darkModeAtom);
    const {
      label,
      color,
      icon,
      configured,
      disabled,
      description,
      nodeDescription,
      appearance,
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
                    className={`node node-event-emitter ${
                      selected ? "selected" : ""
                    } ${disabled ? "flow-node-disabled" : ""}`}
                    style={{
                      ...(!isUndefined(appearance.label) && !appearance.label
                        ? { width: 30, minHeight: 30 }
                        : { width: 130, minHeight: 30 }),
                      ...(color
                        ? {
                            backgroundColor: isDarkMode
                              ? color
                              : colorGenerator(color, 5)[3],
                          }
                        : {}),
                    }}
                  >
                    {!isUndefined(appearance.label) && appearance.label ? (
                      <div
                        className="node-label"
                        style={{ padding: "5px 35px 5px 10px" }}
                      >
                        {label}
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      className="node-icon-right"
                      style={{
                        ...(!isUndefined(appearance.label) && !appearance.label
                          ? { borderLeft: "none", borderRadius: 4 }
                          : {}),
                        ...(color
                          ? {
                              backgroundColor: isDarkMode
                                ? color
                                : colorGenerator(color, 5)[3],
                            }
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
                              : TbTimelineEventPlus
                          }
                        />
                      </FlexboxGrid>
                    </div>
                  </div>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              {!isUndefined(appearance.portLabel?.input) &&
              !isEmpty(appearance.portLabel.input) ? (
                <Whisper
                  placement="left"
                  speaker={
                    <Tooltip arrow={true}>
                      <Text size="lg">{appearance.portLabel.input}</Text>
                    </Tooltip>
                  }
                >
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={`${id}-target`}
                  />
                </Whisper>
              ) : (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${id}-target`}
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
                    className={`node node-event-emitter ${
                      selected ? "selected" : ""
                    } ${disabled ? "flow-node-disabled" : ""}`}
                    style={{
                      ...(!isUndefined(appearance.label) && !appearance.label
                        ? { width: 30, minHeight: 30 }
                        : { width: 130, minHeight: 30 }),
                      ...(color
                        ? {
                            backgroundColor: isDarkMode
                              ? color
                              : colorGenerator(color, 5)[3],
                          }
                        : {}),
                    }}
                  >
                    {!isUndefined(appearance.label) && appearance.label ? (
                      <div
                        className="node-label"
                        style={{ padding: "5px 35px 5px 10px" }}
                      >
                        {label}
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      className="node-icon-right"
                      style={{
                        ...(!isUndefined(appearance.label) && !appearance.label
                          ? { borderLeft: "none", borderRadius: 4 }
                          : {}),
                        ...(color
                          ? {
                              backgroundColor: isDarkMode
                                ? color
                                : colorGenerator(color, 5)[3],
                            }
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
                              : TbTimelineEventPlus
                          }
                        />
                      </FlexboxGrid>
                    </div>
                  </div>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              {!isUndefined(appearance.portLabel?.input) &&
              !isEmpty(appearance.portLabel.input) ? (
                <Whisper
                  placement="left"
                  speaker={
                    <Tooltip arrow={true}>
                      <Text size="lg">{appearance.portLabel.input}</Text>
                    </Tooltip>
                  }
                >
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={`${id}-target`}
                  />
                </Whisper>
              ) : (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${id}-target`}
                />
              )}
            </Badge>
          </Whisper>
        )}
      </>
    );
  }
);

export default EventEmitterNode;
