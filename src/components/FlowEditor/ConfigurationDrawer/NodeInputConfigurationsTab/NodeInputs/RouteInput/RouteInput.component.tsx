import { useEffect, useState } from "react";
import { FlexboxGrid, Input, InputGroup } from "rsuite";

interface RouteInputProps {
  label?: string;
  inputValue?: string;
  onUpdate?: (value: string) => void;
}

export default function RouteInput({
  label = "",
  inputValue,
  onUpdate = () => {},
}: RouteInputProps) {
  const [value, setValue] = useState(inputValue ? inputValue : "");
  useEffect(() => onUpdate(value), [value]);

  return (
    <FlexboxGrid align="middle" justify="space-between">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: 300 }}>
        <InputGroup>
          <InputGroup.Addon>/</InputGroup.Addon>
          <Input
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={setValue}
          />
        </InputGroup>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
