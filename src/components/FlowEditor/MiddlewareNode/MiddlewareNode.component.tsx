import { IconWrapper } from "@ecoflow/components-lib";
import { FlowsNodeDataTypes } from "@ecoflow/types";
import { memo } from "react";
import { GiServerRack } from "react-icons/gi";
import { Handle, NodeProps, Position } from "reactflow";
import { Badge, FlexboxGrid, Popover, Text, Tooltip, Whisper } from "rsuite";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import iconFetcher from "../../../helper/iconFetcher";
import { useAtomValue } from "jotai";
import darkModeAtom from "../../../store/theme.mode";
import colorGenerator from "../../../helper/colorGenerator";

const MiddlewareNode = memo(
  ({
    id,
    data,
    isConnectable,
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
                    className={`node node-middleware ${
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
                    <div
                      className="node-icon-left"
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
                              : GiServerRack
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
                    isConnectable={isConnectable}
                  />
                </Whisper>
              ) : (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${id}-target`}
                  isConnectable={isConnectable}
                />
              )}

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
                    className={`node node-middleware ${
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
                    <div
                      className="node-icon-left"
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
                              : GiServerRack
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
                    isConnectable={isConnectable}
                  />
                </Whisper>
              ) : (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${id}-target`}
                  isConnectable={isConnectable}
                />
              )}

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

export default MiddlewareNode;
