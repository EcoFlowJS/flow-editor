import { useEffect, useState } from "react";
import { FlexboxGrid, Input } from "rsuite";

interface StringInputProps {
  label?: string;
  inputValue?: string;
  onUpdate?: (value: string) => void;
}

export default function StringInput({
  label = "",
  inputValue,
  onUpdate = () => {},
}: StringInputProps) {
  const [value, setValue] = useState(inputValue ? inputValue : "");
  useEffect(() => onUpdate(value), [value]);

  return (
    <FlexboxGrid align="middle" justify="space-between">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: 300 }}>
        <Input
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={setValue}
        />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
