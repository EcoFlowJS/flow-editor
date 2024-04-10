import { IconWrapper } from "@ecoflow/components-lib";
import { FlowsConfigurationsDrawer } from "@ecoflow/types";
import { MouseEvent } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { LuCircle, LuCircleOff } from "react-icons/lu";
import { Drawer, IconButton, Tooltip, Whisper } from "rsuite";

interface DrawerHeaderProps {
  nodeConfigurations?: Required<
    Pick<
      FlowsConfigurationsDrawer,
      | "label"
      | "configured"
      | "disabled"
      | "description"
      | "appearance"
      | "nodeConfiguration"
    >
  >;

  enableDisabledButton?: (event: MouseEvent<HTMLElement>) => void;
  cancelButton?: (event: MouseEvent<HTMLElement>) => void;
  confirmButton?: (event: MouseEvent<HTMLElement>) => void;
}

export default function DrawerHeader({
  nodeConfigurations,
  enableDisabledButton = () => {},
  cancelButton = () => {},
  confirmButton = () => {},
}: DrawerHeaderProps) {
  return (
    <Drawer.Header>
      <Drawer.Title>Node Configurations</Drawer.Title>
      <Drawer.Actions>
        <Whisper
          placement="bottom"
          speaker={<Tooltip arrow={false}>Enable/Diable Node</Tooltip>}
        >
          <IconButton
            appearance="primary"
            color="cyan"
            icon={
              <IconWrapper
                icon={
                  nodeConfigurations && nodeConfigurations.disabled
                    ? LuCircleOff
                    : LuCircle
                }
              />
            }
            onClick={enableDisabledButton}
          >
            {nodeConfigurations && nodeConfigurations.disabled
              ? "Diabled"
              : "Enabled"}
          </IconButton>
        </Whisper>
        <Whisper
          placement="bottom"
          speaker={<Tooltip arrow={false}>Cancel</Tooltip>}
        >
          <IconButton
            appearance="primary"
            color="red"
            icon={<IconWrapper icon={FaXmark} />}
            onClick={cancelButton}
          />
        </Whisper>
        <Whisper
          placement="bottom"
          speaker={<Tooltip arrow={false}>Confirm</Tooltip>}
        >
          <IconButton
            appearance="primary"
            color="green"
            icon={<IconWrapper icon={FaCheck} />}
            onClick={confirmButton}
          />
        </Whisper>
      </Drawer.Actions>
    </Drawer.Header>
  );
}
