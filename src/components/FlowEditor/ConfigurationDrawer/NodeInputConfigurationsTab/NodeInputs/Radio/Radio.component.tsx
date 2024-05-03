import { useEffect, useState } from "react";
import { FlexboxGrid, RadioGroup, Radio as RsuiteRadio } from "rsuite";

interface RadioProps {
  label?: string;
  inputValue?: string | number;
  radioValues?: string | string[];
  onUpdate?: (value: string | number) => void;
}

export default function Radio({
  label = "",
  inputValue,
  radioValues = [],
  onUpdate = () => {},
}: RadioProps) {
  const [radioValue, setRadioValue] = useState(inputValue ? inputValue : "");

  useEffect(() => onUpdate(radioValue), [radioValue]);

  return (
    <FlexboxGrid align="middle" justify="space-between">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: 300 }}>
        <RadioGroup
          name="radio-group"
          value={radioValue}
          onChange={setRadioValue}
        >
          {radioValues && Array.isArray(radioValues) ? (
            radioValues.map((value, key) => (
              <RsuiteRadio key={key} value={value}>
                {value}
              </RsuiteRadio>
            ))
          ) : radioValues && typeof radioValues === "string" ? (
            <RsuiteRadio value={radioValues}>{radioValues}</RsuiteRadio>
          ) : (
            <></>
          )}
        </RadioGroup>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
