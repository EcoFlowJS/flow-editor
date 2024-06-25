import { IconWrapper } from "@ecoflow/components-lib";
import { FlowsNodeDataTypes } from "@ecoflow/types";
import { memo } from "react";
import { CgDebug } from "react-icons/cg";
import { Handle, NodeProps, Position } from "reactflow";
import { Badge, FlexboxGrid, Popover, Text, Tooltip, Whisper } from "rsuite";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import iconFetcher from "../../../helper/iconFetcher";

const DebugNode = memo(
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
                    className={`node node-debug ${selected ? "selected" : ""} ${
                      disabled ? "flow-node-disabled" : ""
                    }`}
                    style={
                      !isUndefined(appearance.label) && !appearance.label
                        ? { width: 30, minHeight: 30 }
                        : { width: 130, minHeight: 30 }
                    }
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
                              : CgDebug
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
                    className={`node node-debug ${selected ? "selected" : ""} ${
                      disabled ? "flow-node-disabled" : ""
                    }`}
                    style={
                      !isUndefined(appearance.label) && !appearance.label
                        ? { width: 30, minHeight: 30 }
                        : { width: 130, minHeight: 30 }
                    }
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
                              : CgDebug
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
            </Badge>
          </Whisper>
        )}
      </>
    );
  }
);

export default DebugNode;
