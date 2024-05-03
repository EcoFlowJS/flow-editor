import { ModuleSpecsInputsTypeOptions } from "@ecoflow/types";
import { useEffect, useState } from "react";
import { FlexboxGrid, CheckPicker as RsuiteCheckPicker } from "rsuite";
import { ItemDataType } from "rsuite/esm/MultiCascadeTree";

interface CheckPickerProps {
  label?: string;
  inputPickerOptions?: String[] | ModuleSpecsInputsTypeOptions[];
  inputValue?: string[];
  onUpdate?: (value: string[]) => void;
}

export default function CheckPicker({
  label = "",
  inputPickerOptions = [],
  onUpdate = () => {},
  inputValue,
}: CheckPickerProps) {
  const [isLoadingFetchPicker, setLoadingFetchPicker] = useState(false);
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);
  const [value, setValue] = useState(inputValue ? inputValue : []);

  const isPickerOptionsIsString = (
    pickerOptions: String[] | ModuleSpecsInputsTypeOptions[]
  ): pickerOptions is string[] => typeof pickerOptions[0] === "string";

  const fetchPickerOptions = () => {
    setLoadingFetchPicker(true);
    setPickerOptions(
      isPickerOptionsIsString(inputPickerOptions) ? inputPickerOptions : []
    );
    setLoadingFetchPicker(false);
  };

  useEffect(() => fetchPickerOptions(), [inputPickerOptions]);
  useEffect(() => onUpdate(value), [value]);

  return (
    <FlexboxGrid align="middle" justify="space-between">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: 300 }}>
        <RsuiteCheckPicker
          block
          loading={isLoadingFetchPicker}
          data={
            inputPickerOptions
              ? isPickerOptionsIsString(inputPickerOptions)
                ? pickerOptions.map((item) => ({
                    label: item,
                    value: item,
                  }))
                : (inputPickerOptions as ItemDataType<string>[])
              : pickerOptions.map((item) => ({
                  label: item,
                  value: item,
                }))
          }
          onOpen={
            inputPickerOptions && isPickerOptionsIsString(inputPickerOptions)
              ? fetchPickerOptions
              : undefined
          }
          onClean={() => setValue([])}
          onSelect={setValue}
          value={value}
        />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
