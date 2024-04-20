import { useEffect, useState } from "react";
import { DatePicker, FlexboxGrid } from "rsuite";

interface DateTimeProps {
  type: "Date" | "Time" | "DateTime";
  label?: string;
  inputValue?: Date | null;
  onUpdate?: (value: Date | null) => void;
}

export default function DateTime({
  type = "Date",
  label = "",
  onUpdate = () => {},
  inputValue,
}: DateTimeProps) {
  const [value, setValue] = useState(inputValue ? inputValue : null);
  useEffect(() => onUpdate(value), [value]);

  return (
    <FlexboxGrid align="middle" justify="space-between">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: 300 }}>
        <DatePicker
          block
          format={
            type === "Date"
              ? "dd/MM/yyyy"
              : type === "Time"
              ? "hh:mm:ss aa"
              : "dd/MM/yyyy hh:mm:ss aa"
          }
          showMeridian
          value={value}
          onChange={setValue}
          onClean={() => setValue(null)}
        />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
