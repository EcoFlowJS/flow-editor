import { IconWrapper } from "@ecoflow/components-lib";
import { HiTag } from "react-icons/hi";
import { Divider, Input, InputProps, Panel, Stack, Text } from "rsuite";

export default function NodeNameInput({ ...props }: InputProps) {
  return (
    <>
      <Panel bodyFill>
        <Stack spacing={35}>
          <Text size="lg">
            <IconWrapper icon={HiTag} /> Name :
          </Text>
          <Stack.Item grow={1}>
            <Input id="nodename" autoComplete="off" {...props} />
          </Stack.Item>
        </Stack>
      </Panel>
      <Divider />
    </>
  );
}
