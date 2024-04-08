import { IconWrapper } from "@ecoflow/components-lib";
import { useAtom, useSetAtom } from "jotai";
import { VscDebugConsole } from "react-icons/vsc";
import { Dropdown, Popover, Stack, Toggle } from "rsuite";
import { PositionChildProps } from "rsuite/esm/internals/Picker";
import {
  debugConsoleDrawer,
  flowEditorSettings,
} from "../../../../store/flowEditor.store";
import { FlowEditorSettingsConfigurations } from "@ecoflow/types";
import { useState } from "react";

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
  const [flowSettings, setFlowEditorSettings] = useAtom(flowEditorSettings);
  const [isLoading, _setLoading] = useState<FlowEditorSettingsConfigurations>({
    disabledkeyboard: false,
    controls: false,
    miniMap: false,
    panMiniMap: false,
    scrollPan: false,
  });
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu>
        <Dropdown.Item>
          <Stack justifyContent="space-between" spacing={20}>
            Disabled keyboard
            <Toggle
              loading={isLoading.disabledkeyboard}
              checked={flowSettings.disabledkeyboard}
              onChange={(value) =>
                setFlowEditorSettings({
                  ...flowSettings,
                  disabledkeyboard: value,
                })
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
              onChange={(value) =>
                setFlowEditorSettings({
                  ...flowSettings,
                  controls: value,
                })
              }
            />
          </Stack>
        </Dropdown.Item>
        <Dropdown.Item>
          <Stack justifyContent="space-between" spacing={20}>
            Mini Map
            <Toggle
              loading={isLoading.miniMap}
              checked={flowSettings.miniMap}
              onChange={(value) =>
                setFlowEditorSettings({
                  ...flowSettings,
                  miniMap: value,
                })
              }
            />
          </Stack>
        </Dropdown.Item>
        <Dropdown.Item>
          <Stack justifyContent="space-between" spacing={20}>
            Pan on Mini Map
            <Toggle
              loading={isLoading.panMiniMap}
              checked={flowSettings.panMiniMap}
              onChange={(value) =>
                setFlowEditorSettings({
                  ...flowSettings,
                  panMiniMap: value,
                })
              }
            />
          </Stack>
        </Dropdown.Item>
        <Dropdown.Item>
          <Stack justifyContent="space-between" spacing={20}>
            Pan on Scroll
            <Toggle
              loading={isLoading.scrollPan}
              checked={flowSettings.scrollPan}
              onChange={(value) =>
                setFlowEditorSettings({
                  ...flowSettings,
                  scrollPan: value,
                })
              }
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
      </Dropdown.Menu>
    </Popover>
  );
}
