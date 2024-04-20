import { useEffect, useState } from "react";
import { FlexboxGrid, InputNumber } from "rsuite";

interface NumberInputProps {
  label?: string;
  inputValue?: number | string;
  onUpdate?: (value: number | string) => void;
}

export default function NumberInput({
  label = "",
  inputValue,
  onUpdate = () => {},
}: NumberInputProps) {
  const [value, setValue] = useState(inputValue ? inputValue : "");
  useEffect(() => onUpdate(value), [value]);

  return (
    <FlexboxGrid align="middle" justify="space-between">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: 300 }}>
        <InputNumber
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(value) => (value ? setValue(value) : null)}
        />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
