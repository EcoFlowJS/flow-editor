import { IconWrapper } from "@ecoflow/components-lib";
import { FlowsDataTypes } from "@ecoflow/types";
import { memo } from "react";
import { GiServerRack } from "react-icons/gi";
import { Handle, NodeProps, Position } from "reactflow";
import { Badge, FlexboxGrid, Text, Tooltip, Whisper } from "rsuite";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import iconFetcher from "../../../helper/iconFetcher";

const MiddlewareNode = memo(
  ({ id, data, isConnectable, selected }: NodeProps<FlowsDataTypes>) => {
    const {
      label,
      icon,
      configured,
      disabled,
      description,
      appearance,
      openDrawer,
    } = data;
    return (
      <>
        {configured ? (
          <>
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
                  className={`node ${selected ? "selected" : ""} ${
                    disabled ? "flow-node-disabled" : ""
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
          </>
        ) : (
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
                  className={`node ${selected ? "selected" : ""} ${
                    disabled ? "flow-node-disabled" : ""
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
        )}
      </>
    );
  }
);

export default MiddlewareNode;
