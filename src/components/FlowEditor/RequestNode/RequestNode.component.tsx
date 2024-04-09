import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Badge, FlexboxGrid, Text, Tooltip, Whisper } from "rsuite";
import { IconWrapper } from "@ecoflow/components-lib";
import { TbRouteSquare2 } from "react-icons/tb";
import { FlowsDataTypes } from "@ecoflow/types";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import iconFetcher from "../../../helper/iconFetcher";

const RequestNode = memo(
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
                      ? { width: 30, height: 30 }
                      : { width: 130, height: 30 }
                  }
                >
                  <div className="node-icon-left">
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
                            : TbRouteSquare2
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
                      ? { width: 30, height: 30 }
                      : { width: 130, height: 30 }
                  }
                >
                  <div className="node-icon-left">
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
                            : TbRouteSquare2
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
        )}
      </>
    );
  }
);

export default RequestNode;
