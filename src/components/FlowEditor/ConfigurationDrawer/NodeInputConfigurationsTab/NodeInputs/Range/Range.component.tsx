import { useEffect, useState } from "react";
import { FlexboxGrid, InputGroup, InputNumber } from "rsuite";

interface RangeProps {
  label?: string;
  inputValue?: {
    start: number;
    end: number;
  };
  onUpdate?: (value: { start: number; end: number }) => void;
}

export default function Range({
  label = "",
  inputValue,
  onUpdate = () => {},
}: RangeProps) {
  const [startValue, setStartValue] = useState(
    inputValue && inputValue.start.toString() ? inputValue.start.toString() : ""
  );
  const [endValue, setEndValue] = useState(
    inputValue && inputValue.end.toString() ? inputValue.end.toString() : ""
  );

  useEffect(
    () => onUpdate({ start: Number(startValue), end: Number(endValue) }),
    [startValue, endValue]
  );

  return (
    <FlexboxGrid align="middle" justify="space-between">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: 300 }}>
        <InputGroup>
          <InputNumber
            autoComplete="off"
            spellCheck={false}
            value={startValue}
            onChange={(start) =>
              setStartValue(() => {
                setEndValue((endValue) =>
                  endValue
                    ? Number(start!) > Number(endValue)
                      ? Number(start!).toString()
                      : endValue
                    : ""
                );
                return start!.toString();
              })
            }
          />
          <InputGroup.Addon>to</InputGroup.Addon>
          <InputNumber
            min={startValue ? Number(startValue) : undefined}
            autoComplete="off"
            spellCheck={false}
            value={endValue}
            onChange={(endValue) => setEndValue(endValue!.toString())}
          />
        </InputGroup>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
