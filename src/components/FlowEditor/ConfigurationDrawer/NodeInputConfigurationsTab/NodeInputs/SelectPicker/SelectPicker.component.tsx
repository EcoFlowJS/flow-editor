import {
  API_METHODS,
  ApiResponse,
  ModuleSpecsInputsTypeOptions,
} from "@ecoflow/types";
import { useEffect, useState } from "react";
import { FlexboxGrid, SelectPicker as RsuiteSelectPicker } from "rsuite";
import getDB_Connections from "../../../../../../service/schema/getDB_Connections.service";
import { ItemDataType } from "rsuite/esm/internals/types";

interface SelectPickerProps {
  label?: string;
  type?: "DB_Selector" | "Methods" | "SelectPicker";
  inputPickerOptions?: String[] | ModuleSpecsInputsTypeOptions[];
  methods?: API_METHODS[];
  inputValue?: string;
  onUpdate?: (value: string | null) => void;
}

export default function SelectPicker({
  label = "",
  type = "SelectPicker",
  inputPickerOptions = [],
  methods = [],
  inputValue,
  onUpdate = () => {},
}: SelectPickerProps) {
  const [isLoadingFetchPicker, setLoadingFetchPicker] = useState(false);
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);
  const [value, setValue] = useState(inputValue ? inputValue : null);

  const isPickerOptionsIsString = (
    pickerOptions: String[] | ModuleSpecsInputsTypeOptions[]
  ): pickerOptions is string[] => typeof pickerOptions[0] === "string";

  const fetchPickerOptions = () => {
    if (type === "DB_Selector") {
      setLoadingFetchPicker(true);
      getDB_Connections().then(
        (response: ApiResponse) => {
          setLoadingFetchPicker(false);
          if (response.success) setPickerOptions(response.payload);
        },
        (reject: ApiResponse) => {
          setLoadingFetchPicker(false);
          if (reject.error) console.error(reject.payload);
        }
      );
    }
    if (type === "Methods") {
      setLoadingFetchPicker(true);
      setPickerOptions(methods as string[]);
      setLoadingFetchPicker(false);
    }

    if (type === "SelectPicker" && inputPickerOptions) {
      setLoadingFetchPicker(true);
      setPickerOptions(
        isPickerOptionsIsString(inputPickerOptions) ? inputPickerOptions : []
      );
      setLoadingFetchPicker(false);
    }
  };

  useEffect(() => fetchPickerOptions(), [inputPickerOptions]);
  useEffect(() => onUpdate(value), [value]);

  return (
    <FlexboxGrid align="middle" justify="space-between">
      <FlexboxGrid.Item style={{ width: 120 }}>{label}</FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ width: 300 }}>
        <RsuiteSelectPicker
          block
          loading={isLoadingFetchPicker}
          data={
            type === "SelectPicker" && inputPickerOptions
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
            type === "SelectPicker"
              ? inputPickerOptions &&
                isPickerOptionsIsString(inputPickerOptions)
                ? fetchPickerOptions
                : undefined
              : fetchPickerOptions
          }
          onClean={() => setValue(null)}
          onSelect={setValue}
          value={value}
        />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
