import { IconWrapper } from "@ecoflow/components-lib";
import { FlowsNodeDataTypes } from "@ecoflow/types";
import isUndefined from "lodash/isUndefined";
import { memo } from "react";
import { NodeProps } from "reactflow";
import { Badge, FlexboxGrid, Popover, Whisper } from "rsuite";
import iconFetcher from "../../../helper/iconFetcher";
import { GrConfigure } from "react-icons/gr";

const ConfigurationNode = memo(
  ({
    data,
    selected,
  }: NodeProps<FlowsNodeDataTypes & { nodeDescription?: string }>) => {
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
                    className={`node node-configuration ${
                      selected ? "selected" : ""
                    } ${disabled ? "flow-node-disabled" : ""}`}
                    style={{
                      ...(!isUndefined(appearance.label) && !appearance.label
                        ? { width: 30, minHeight: 30 }
                        : { width: 130, minHeight: 30 }),
                      ...(color ? { backgroundColor: color } : {}),
                    }}
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
                              : GrConfigure
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
                    className={`node node-configuration ${
                      selected ? "selected" : ""
                    } ${disabled ? "flow-node-disabled" : ""}`}
                    style={{
                      ...(!isUndefined(appearance.label) && !appearance.label
                        ? { width: 30, minHeight: 30 }
                        : { width: 130, minHeight: 30 }),
                      ...(color ? { backgroundColor: color } : {}),
                    }}
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
                              : GrConfigure
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
            </Badge>
          </Whisper>
        )}
      </>
    );
  }
);

export default ConfigurationNode;
