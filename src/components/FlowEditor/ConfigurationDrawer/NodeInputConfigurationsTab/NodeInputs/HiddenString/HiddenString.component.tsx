import { InputPassword } from "@ecoflow/components-lib";
import { useEffect, useState } from "react";
import { FlexboxGrid } from "rsuite";

interface HiddenStringProps {
  label?: string;
  inputValue?: string;
  onUpdate?: (value: string) => void;
}

export default function HiddenString({
  label = "",
  inputValue,
  onUpdate = () => {},
}: HiddenStringProps) {
  const [value, setValue] = useState(inputValue ? inputValue : "");
  useEffect(() => onUpdate(value), [value]);

  return (
    <FlexboxGrid align="middle" justify="space-between">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: 300 }}>
        <InputPassword
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={setValue}
        />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
