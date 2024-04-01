import {
  Button,
  ButtonGroup,
  Dropdown,
  IconButton,
  Popover,
  Whisper,
} from "rsuite";
import ArrowDownIcon from "@rsuite/icons/ArrowDown";
import { IconWrapper } from "@ecoflow/components-lib";
import { GrDeploy } from "react-icons/gr";
import { RiNodeTree, RiRestartLine } from "react-icons/ri";
import { TbBinaryTree2 } from "react-icons/tb";

export default function DeployButton() {
  return (
    <ButtonGroup>
      <Button
        appearance="subtle"
        startIcon={<IconWrapper icon={GrDeploy} />}
        style={{ minWidth: 100 }}
      >
        Deploy
      </Button>
      <Whisper
        placement="bottomEnd"
        trigger="click"
        speaker={({ onClose, left, top, className }, ref) => {
          const handleSelect = (eventKey: string | undefined) => {
            onClose();
            console.log(eventKey);
          };
          return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
              <Dropdown.Menu onSelect={handleSelect}>
                <Dropdown.Item
                  eventKey="Full"
                  icon={<IconWrapper icon={GrDeploy} />}
                >
                  Full Deploy
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="CurrentFlow"
                  icon={<IconWrapper icon={TbBinaryTree2} />}
                >
                  Current Flow
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="OnlyModifiedNode"
                  icon={<IconWrapper icon={RiNodeTree} />}
                >
                  Modified Nodes
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item
                  eventKey="RestartFlow"
                  icon={<IconWrapper icon={RiRestartLine} />}
                >
                  Restart Flow
                </Dropdown.Item>
              </Dropdown.Menu>
            </Popover>
          );
        }}
      >
        <IconButton icon={<ArrowDownIcon />} appearance="subtle" />
      </Whisper>
    </ButtonGroup>
  );
}
