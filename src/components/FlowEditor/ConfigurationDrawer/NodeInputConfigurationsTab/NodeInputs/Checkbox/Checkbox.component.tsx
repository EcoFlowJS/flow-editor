import { useEffect, useState } from "react";
import { FlexboxGrid, Checkbox as RsuiteCheckbox } from "rsuite";

interface CheckboxProps {
  label?: string;
  inputValue?: boolean;
  onUpdate?: (value: boolean) => void;
}

export default function Checkbox({
  label = "",
  inputValue,
  onUpdate = () => {},
}: CheckboxProps) {
  const [value, setValue] = useState(inputValue ? inputValue : false);

  useEffect(() => onUpdate(value), [value]);

  return (
    <FlexboxGrid align="middle" justify="space-between">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: 300 }}>
        <RsuiteCheckbox checked={value} onChange={() => setValue(!value)} />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
