import { FlowInputSpecs, NodeConfiguration } from "@ecoflow/types";
import { useEffect, useState } from "react";
import { FlexboxGrid, Text } from "rsuite";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import ListBox from "./ListBox/ListBox.component";
import Range from "./Range/Range.component";
import Radio from "./Radio/Radio.component";
import Checkbox from "./Checkbox/Checkbox.component";
import HiddenString from "./HiddenString/HiddenString.component";
import StringInput from "./StringInput/StringInput.component";
import NumberInput from "./NumberInput/NumberInput.component";
import DateTime from "./DateTime/DateTime.component";
import CheckPicker from "./CheckPicker/CheckPicker.component";
import Toggle from "./Toggle/Toggle.component";
import CodeEditor from "./CodeEditor/CodeEditor.component";
import SelectPicker from "./SelectPicker/SelectPicker.component";
import RouteInput from "./RouteInput/RouteInput.component";

interface NodeInputsProps {
  inputSpecs: FlowInputSpecs;
  nodeConfigurations?: NodeConfiguration["configs"];
  onChange?: (id: string, validated: boolean, value: any) => void;
}

export default function NodeInputs({
  inputSpecs,
  nodeConfigurations,
  onChange = () => {},
}: NodeInputsProps) {
  const {
    name,
    label,
    type,
    methods,
    hint,
    required,
    codeLanguage,
    radioValues,
    listBoxSorting,
    pickerOptions: inputPickerOptions,
    defaultValue,
  } = inputSpecs;

  const initialValue = Object.create({});
  initialValue[name] =
    nodeConfigurations && nodeConfigurations[name]
      ? nodeConfigurations[name]
      : defaultValue && type !== "Code"
      ? defaultValue
      : type === "Methods" ||
        type === "Date" ||
        type === "Time" ||
        type === "DateTime"
      ? null
      : type === "Toggle" || type === "Checkbox"
      ? false
      : type === "CheckPicker"
      ? []
      : "";
  const [inputValue, setInputValue] = useState(initialValue);
  const [codeValue, setCodeValue] = useState<{
    value?: string;
    validate: boolean;
  }>({
    value:
      type === "Code"
        ? inputValue[name].value ||
          (defaultValue as string | undefined) ||
          "\nreturn payload;"
        : "\nreturn payload;",
    validate: true,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const updateInputValue = (
    value?:
      | string
      | number
      | boolean
      | Date
      | null
      | any[]
      | { start: number; end: number }
  ) => {
    const updateValue = Object.create({});
    updateValue[name] = value;
    setInputValue(updateValue);
  };

  const updateResponse = (validated: boolean, value: any) =>
    onChange(name, validated, value);

  useEffect(() => {
    const value = type === "Code" ? codeValue : inputValue[name];
    const isRequired = isUndefined(required) ? false : required;
    switch (type) {
      case "Code":
        if (isRequired && isEmpty(value)) updateResponse(false, value);
        else if (isRequired && !isEmpty(value))
          updateResponse(true && codeValue.validate, value);
        else updateResponse(true && codeValue.validate, value);
        break;
      case "CheckPicker":
        setErrorMessage("");
        if (isRequired && (value === null || value.length === 0)) {
          setErrorMessage("Field is Required");
          updateResponse(false, value);
        } else if (isRequired && value.length > 0) updateResponse(true, value);
        else updateResponse(true, value);
        break;
      case "Toggle":
      case "Checkbox":
        setErrorMessage("");
        if (isRequired && !value) {
          setErrorMessage("Must be checked");
          updateResponse(false, value);
        } else if (isRequired && value) updateResponse(true, value);
        else updateResponse(true, value);
        break;
      case "Methods":
      case "Date":
      case "Time":
      case "DateTime":
      case "SelectPicker":
      case "DB_Selector":
        setErrorMessage("");
        if (isRequired && isEmpty(value)) {
          setErrorMessage("Field is Required");
          updateResponse(false, value);
        } else if (isRequired && !isEmpty(value)) updateResponse(true, value);
        else updateResponse(true, value);
        break;
      case "Range":
        setErrorMessage("");
        if (
          isRequired &&
          (isEmpty(value.start.toString()) || isEmpty(value.end.toString()))
        ) {
          setErrorMessage("Both Field is Required");
          updateResponse(false, value);
        } else if (isRequired && !isEmpty(value.start) && !isEmpty(value.end))
          updateResponse(
            true && Number(value.end) >= Number(value.start),
            value
          );
        else
          updateResponse(
            true && Number(value.end) >= Number(value.start),
            value
          );
        break;
      case "ListBox":
        setErrorMessage("");
        if (isRequired && !(value.length > 0))
          setErrorMessage("List must have at least a value");
        updateResponse(required ? value.length > 0 : true, value);
        break;
      default:
        setErrorMessage("");
        if (isRequired && isEmpty(value)) {
          setErrorMessage("Field is Required");
          updateResponse(false, value);
        } else if (isRequired && !isEmpty(value)) updateResponse(true, value);
        else updateResponse(true, value);
        break;
    }
  }, [inputValue[name], codeValue]);

  return (
    <>
      <FlexboxGrid justify="space-between" style={{ padding: "6px 0" }}>
        <FlexboxGrid.Item colspan={24}>
          {type === "Route" ? (
            <RouteInput
              label={label}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "DB_Selector" ||
            type === "Methods" ||
            type === "SelectPicker" ? (
            <SelectPicker
              label={label}
              type={type}
              inputPickerOptions={inputPickerOptions}
              methods={methods}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "Code" ? (
            <CodeEditor
              label={label}
              codeEditorValue={codeValue}
              language={codeLanguage || "javascript"}
              onValidate={(result) => {
                if (result.length === 0) {
                  setErrorMessage("");
                  setCodeValue((val) => ({ ...val, validate: true }));
                } else {
                  setErrorMessage("Invalid Code");
                  setCodeValue((val) => ({ ...val, validate: false }));
                }
              }}
              onUpdateCodeValue={setCodeValue}
            />
          ) : type === "Toggle" ? (
            <Toggle
              label={label}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "CheckPicker" ? (
            <CheckPicker
              label={label}
              inputPickerOptions={inputPickerOptions}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "Date" || type === "Time" || type === "DateTime" ? (
            <DateTime
              type={type}
              label={label}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "Number" ? (
            <NumberInput
              label={label}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "String" ? (
            <StringInput
              label={label}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "HiddenString" ? (
            <HiddenString
              label={label}
              inputValue={initialValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "Checkbox" ? (
            <Checkbox
              label={label}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "Radio" ? (
            <Radio
              label={label}
              radioValues={radioValues}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "Range" ? (
            <Range
              label={label}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          ) : type === "ListBox" ? (
            <ListBox
              label={label}
              listSortings={listBoxSorting}
              listBoxLists={inputValue[name] || []}
              onUpdate={updateInputValue}
            />
          ) : (
            <StringInput
              label={label}
              inputValue={inputValue[name]}
              onUpdate={updateInputValue}
            />
          )}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          {...(type === "Code" ? { colspan: 24 } : { style: { width: 120 } })}
        />
        <FlexboxGrid.Item
          {...(type === "Code"
            ? { colspan: 24 }
            : type === "Toggle"
            ? {}
            : { style: { width: 290 } })}
        >
          {errorMessage ? <Text muted>{errorMessage}</Text> : <></>}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          {...(type === "Code" ? { colspan: 24 } : { style: { width: 120 } })}
        />
        <FlexboxGrid.Item
          {...(type === "Code"
            ? { colspan: 24 }
            : type === "Toggle"
            ? {}
            : { style: { width: 290 } })}
        >
          {hint ? <Text muted>{hint}</Text> : <></>}
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  );
}
