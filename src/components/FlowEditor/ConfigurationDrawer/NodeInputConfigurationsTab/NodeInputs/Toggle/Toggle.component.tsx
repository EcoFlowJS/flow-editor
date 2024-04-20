import { useEffect, useState } from "react";
import { FlexboxGrid, Toggle as RsuiteToggle } from "rsuite";

interface ToggleProps {
  label?: string;
  inputValue?: boolean;
  onUpdate?: (value: boolean) => void;
}

export default function Toggle({
  label = "",
  onUpdate = () => {},
  inputValue,
}: ToggleProps) {
  const [value, setValue] = useState(inputValue ? inputValue : false);
  useEffect(() => onUpdate(value), [value]);

  return (
    <FlexboxGrid align="middle">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item>
        <RsuiteToggle checked={value} onChange={setValue} />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
