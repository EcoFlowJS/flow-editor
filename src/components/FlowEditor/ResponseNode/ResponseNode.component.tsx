import { IconWrapper } from "@ecoflow/components-lib";
import { memo, useMemo } from "react";
import { LuSquareStack } from "react-icons/lu";
import {
  Handle,
  NodeProps,
  Position,
  ReactFlowState,
  getConnectedEdges,
  useNodeId,
  useStore,
} from "reactflow";
import { Badge, FlexboxGrid, Text, Tooltip, Whisper } from "rsuite";
import { FlowsDataTypes } from "@ecoflow/types";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import iconFetcher from "../../../helper/iconFetcher";

const selector = (s: ReactFlowState) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

const ResponseNode = memo(
  ({ id, data, selected }: NodeProps<FlowsDataTypes>) => {
    const {
      label,
      icon,
      configured,
      isConnectable,
      disabled,
      description,
      appearance,
      openDrawer,
    } = data;

    const { nodeInternals, edges } = useStore(selector);
    const nodeId = useNodeId();

    const isHandleConnectable = useMemo(() => {
      const node = nodeInternals.get(nodeId!);
      const connectedEdges = getConnectedEdges([node!], edges);

      return (
        connectedEdges.length <
        (typeof isConnectable === "number" ? isConnectable : 1)
      );
    }, [nodeInternals, edges, nodeId, isConnectable]);
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
                            : LuSquareStack
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
                  isConnectable={isHandleConnectable}
                />
              </Whisper>
            ) : (
              <Handle
                type="target"
                position={Position.Left}
                id={`${id}-target`}
                isConnectable={isHandleConnectable}
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
                            : LuSquareStack
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
                  isConnectable={isHandleConnectable}
                />
              </Whisper>
            ) : (
              <Handle
                type="target"
                position={Position.Left}
                id={`${id}-target`}
                isConnectable={isHandleConnectable}
              />
            )}
          </Badge>
        )}
      </>
    );
  }
);

export default ResponseNode;
