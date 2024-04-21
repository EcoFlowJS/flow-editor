import { IconWrapper } from "@ecoflow/components-lib";
import { useAtom, useSetAtom } from "jotai";
import { VscDebugConsole } from "react-icons/vsc";
import { Dropdown, Popover, Stack, Toggle } from "rsuite";
import { PositionChildProps } from "rsuite/esm/internals/Picker";
import {
  debugConsoleDrawer,
  flowEditorSettings,
} from "../../../../store/flowEditor.store";
import { ApiResponse, FlowEditorSettingsConfigurations } from "@ecoflow/types";
import { useEffect, useState } from "react";
import updateFlowSettings from "../../../../service/flows/updateFlowSettings.service";
import { TiExport } from "react-icons/ti";

export default function FlowEditorSettingsDropdownMenu(
  {
    left,
    top,
    className,
  }: PositionChildProps &
    Pick<
      React.HTMLAttributes<HTMLElement>,
      "id" | "onMouseEnter" | "onMouseLeave"
    > & {
      onClose: (delay?: number) => NodeJS.Timeout | void;
    },
  ref: React.RefCallback<HTMLElement>
) {
  const openDebugConsoleDrawer = useSetAtom(debugConsoleDrawer);
  const [userFlowSettings, setUserFlowSettings] = useAtom(flowEditorSettings);
  const [flowSettings, setFlowEditorSettings] =
    useState<FlowEditorSettingsConfigurations>(userFlowSettings);
  const [flowSettingsUpdated, setFlowSettingsUpdated] =
    useState<FlowEditorSettingsConfigurations>(userFlowSettings);
  const [isLoading, setLoading] = useState<FlowEditorSettingsConfigurations>({
    keyboardAccessibility: false,
    controls: false,
    miniMap: false,
    panMiniMap: false,
    scrollPan: false,
  });

  const toggleHandler = (
    key: keyof FlowEditorSettingsConfigurations,
    value: boolean
  ) => {
    const flowEditorSettings = Object.create({});
    const flowEditorLoading = Object.create({});
    setFlowEditorSettings((flowSettings) => {
      flowEditorSettings[key] = value;
      return {
        ...flowSettings,
        ...flowEditorSettings,
      };
    });

    setLoading((loadings) => {
      flowEditorLoading[key] = true;
      return {
        ...loadings,
        ...flowEditorLoading,
      };
    });

    flowEditorSettings[key] = value;
    updateFlowSettings({ ...flowEditorSettings }).then(
      (response) => {
        setLoading((loadings) => {
          flowEditorLoading[key] = false;
          return {
            ...loadings,
            ...flowEditorLoading,
          };
        });
        setFlowEditorSettings((flowSettings) => {
          flowEditorSettings[key] = !value;
          return {
            ...flowSettings,
            ...flowEditorSettings,
          };
        });

        if (response.success)
          setFlowEditorSettings((flowSettings) => {
            flowEditorSettings[key] = response.payload[key];
            setFlowSettingsUpdated((flowSettings) => {
              return {
                ...flowSettings,
                ...flowEditorSettings,
              };
            });
            return {
              ...flowSettings,
              ...flowEditorSettings,
            };
          });
      },
      (reject: ApiResponse) => {
        setLoading((loadings) => {
          flowEditorLoading[key] = false;
          return {
            ...loadings,
            ...flowEditorLoading,
          };
        });
        setFlowEditorSettings((flowSettings) => {
          flowEditorSettings[key] = !value;
          return {
            ...flowSettings,
            ...flowEditorSettings,
          };
        });

        console.error(reject.payload);
      }
    );
  };

  useEffect(
    () => setUserFlowSettings(flowSettingsUpdated),
    [flowSettingsUpdated]
  );

  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu>
        <Dropdown.Item>
          <Stack justifyContent="space-between" spacing={20}>
            keyboard Accessibility
            <Toggle
              loading={isLoading.keyboardAccessibility}
              checked={flowSettings.keyboardAccessibility}
              onChange={(value) =>
                toggleHandler("keyboardAccessibility", value)
              }
            />
          </Stack>
        </Dropdown.Item>
        <Dropdown.Item>
          <Stack justifyContent="space-between" spacing={20}>
            Controls
            <Toggle
              loading={isLoading.controls}
              checked={flowSettings.controls}
              onChange={(value) => toggleHandler("controls", value)}
            />
          </Stack>
        </Dropdown.Item>
        <Dropdown.Item>
          <Stack justifyContent="space-between" spacing={20}>
            Mini Map
            <Toggle
              loading={isLoading.miniMap}
              checked={flowSettings.miniMap}
              onChange={(value) => toggleHandler("miniMap", value)}
            />
          </Stack>
        </Dropdown.Item>
        <Dropdown.Item>
          <Stack justifyContent="space-between" spacing={20}>
            Pan on Mini Map
            <Toggle
              loading={isLoading.panMiniMap}
              checked={flowSettings.panMiniMap}
              onChange={(value) => toggleHandler("panMiniMap", value)}
            />
          </Stack>
        </Dropdown.Item>
        <Dropdown.Item>
          <Stack justifyContent="space-between" spacing={20}>
            Pan on Scroll
            <Toggle
              loading={isLoading.scrollPan}
              checked={flowSettings.scrollPan}
              onChange={(value) => toggleHandler("scrollPan", value)}
            />
          </Stack>
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item
          icon={<IconWrapper icon={VscDebugConsole} />}
          onClick={() => openDebugConsoleDrawer(true)}
        >
          Open Debug Console
        </Dropdown.Item>
        <Dropdown.Item
          icon={<IconWrapper icon={TiExport} />}
          //Implementation left.
        >
          Open Debug Console
        </Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
}
