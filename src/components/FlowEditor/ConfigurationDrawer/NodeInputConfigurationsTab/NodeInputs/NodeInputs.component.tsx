import {
  ApiResponse,
  ModuleSpecsInputs,
  ModuleSpecsInputsTypeOptions,
} from "@ecoflow/types";
import { useEffect, useState, KeyboardEvent } from "react";
import {
  CheckPicker,
  Checkbox,
  DatePicker,
  FlexboxGrid,
  Heading,
  Input,
  InputGroup,
  InputNumber,
  Panel,
  Radio,
  RadioGroup,
  SelectPicker,
  Toggle,
  Text,
  Divider,
  List,
  IconButton,
} from "rsuite";
import getDB_Connections from "../../../../../service/schema/getDB_Connections.service";
import { ItemDataType } from "rsuite/esm/MultiCascadeTree";
import { Editor } from "@monaco-editor/react";
import { IconWrapper, InputPassword } from "@ecoflow/components-lib";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";
import { FaXmark } from "react-icons/fa6";
import { MovedItemInfo } from "rsuite/esm/List/helper/useSortHelper";

interface NodeInputsProps {
  inputSpecs: ModuleSpecsInputs;
  isEndNode?: boolean;
  onChange?: (id: string, validated: boolean, value: any) => void;
}

export default function NodeInputs({
  inputSpecs,
  isEndNode = false,
  onChange = () => {},
}: NodeInputsProps) {
  const {
    name,
    lable,
    type,
    methods,
    required,
    radioValues,
    pickerOptions: inputPickerOptions,
    defaultValue,
  } = inputSpecs;

  const initialValue = Object.create({});
  initialValue[name] =
    defaultValue && type !== "Code"
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
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);
  const [isLoadingFetchPicker, setLoadingFetchPicker] = useState(false);
  const [codeValue, setCodeValue] = useState({
    value:
      type === "Code" && defaultValue
        ? (defaultValue as string | undefined)
        : "\nreturn payload;",
    validate: true,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [queryStringParameterValue, setQueryStringParameterValue] =
    useState("");
  const [queryStringParameterList, setQueryStringParameterList] = useState<
    string[]
  >([]);

  const [urlParameterValue, setURLParameterValue] = useState("");
  const [urlParameterList, setURLParameterList] = useState<string[]>([]);

  const isPickerOptionsIsString = (
    pickerOptions: String[] | ModuleSpecsInputsTypeOptions[]
  ): pickerOptions is string[] => typeof pickerOptions[0] === "string";

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

    if (
      (type === "SelectPicker" || type === "CheckPicker") &&
      inputPickerOptions
    ) {
      setLoadingFetchPicker(true);
      setPickerOptions(
        isPickerOptionsIsString(inputPickerOptions) ? inputPickerOptions : []
      );
      setLoadingFetchPicker(false);
    }
  };

  const handleQueryStringAddition = () =>
    setQueryStringParameterList((queryStringParameterList) => {
      if (
        queryStringParameterList.includes(queryStringParameterValue.trim()) ||
        /\s/g.test(queryStringParameterValue.trim()) ||
        isEmpty(queryStringParameterValue)
      )
        return queryStringParameterList;
      return [...queryStringParameterList, queryStringParameterValue.trim()];
    });

  const handleURLParameterAddition = () =>
    setURLParameterList((urlParameterList) => {
      if (
        urlParameterList.includes(urlParameterValue.trim()) ||
        /\s/g.test(urlParameterValue.trim()) ||
        isEmpty(urlParameterValue)
      )
        return urlParameterList;
      return [...urlParameterList, urlParameterValue.trim()];
    });

  const handleQueryStringRemoval = (id: number) =>
    setQueryStringParameterList((queryStringParameterList) => {
      queryStringParameterList.splice(id, 1);
      return [...queryStringParameterList];
    });

  const handleURLParameterRemoval = (id: number) =>
    setURLParameterList((urlParameterList) => {
      urlParameterList.splice(id, 1);
      return [...urlParameterList];
    });

  const handleQueryStringAdditionKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => (event.key === "Enter" ? handleQueryStringAddition() : null);

  const handleURLParameterAdditionKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => (event.key === "Enter" ? handleURLParameterAddition() : null);

  const handleURLParameterSort = ({ oldIndex, newIndex }: MovedItemInfo) =>
    setURLParameterList((urlParameters) => {
      const moveData = urlParameters.splice(oldIndex, 1);
      const newData = [...urlParameters];
      newData.splice(newIndex, 0, moveData[0]);
      return newData;
    });

  const updateResponse = (validated: boolean, value: any, id = name) =>
    onChange(id, validated, value);

  useEffect(() => {
    const value = type === "Code" ? codeValue.value : inputValue[name];
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
        if (isRequired && (isEmpty(value.start) || isEmpty(value.end))) {
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

  useEffect(
    () => updateResponse(true, queryStringParameterList, "$url.query"),
    [queryStringParameterList]
  );

  useEffect(
    () => updateResponse(false, urlParameterList, "$url.params"),
    [urlParameterList]
  );

  return (
    <>
      <FlexboxGrid
        justify="space-between"
        align="middle"
        style={{ padding: "6px 0" }}
      >
        <FlexboxGrid.Item
          {...(type === "Code" ? { colspan: 24 } : { style: { width: 120 } })}
        >
          {type === "Code" ? (
            <Heading style={{ padding: "5px 10px" }}>{lable}</Heading>
          ) : (
            `${lable} :`
          )}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          {...(type === "Code"
            ? { colspan: 24 }
            : type === "Toggle"
            ? {}
            : { style: { width: 300 } })}
        >
          {type === "Route" ? (
            <Input
              type="text"
              name={name}
              value={inputValue[name]}
              onChange={updateInputValue}
            />
          ) : type === "DB_Selector" ||
            type === "Methods" ||
            type === "SelectPicker" ? (
            <SelectPicker
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
              onClean={() => updateInputValue(null)}
              onSelect={updateInputValue}
              value={inputValue[name]}
            />
          ) : type === "Code" ? (
            <Panel
              bodyFill
              bordered
              style={{
                backgroundColor: "#1e1e1e",
                padding: "10px 0",
                overflow: "visible",
              }}
            >
              <Editor
                options={{
                  showUnused: true,
                  minimap: { enabled: false },
                  fontSize: 16,
                }}
                wrapperProps={{ fontSize: 20 }}
                height={500}
                language="javascript"
                theme="vs-dark"
                onChange={(value) => setCodeValue((val) => ({ ...val, value }))}
                onValidate={(result) => {
                  if (result.length === 0) {
                    setErrorMessage("");
                    setCodeValue((val) => ({ ...val, validate: true }));
                  } else {
                    setErrorMessage("Invalid Code");
                    setCodeValue((val) => ({ ...val, validate: false }));
                  }
                }}
                value={codeValue.value}
              />
            </Panel>
          ) : type === "Toggle" ? (
            <Toggle
              checked={inputValue[name] as boolean}
              onChange={updateInputValue}
            />
          ) : type === "CheckPicker" ? (
            <CheckPicker
              block
              loading={isLoadingFetchPicker}
              data={
                type === "CheckPicker" && inputPickerOptions
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
                type === "CheckPicker"
                  ? inputPickerOptions &&
                    isPickerOptionsIsString(inputPickerOptions)
                    ? fetchPickerOptions
                    : undefined
                  : fetchPickerOptions
              }
              onClean={() => updateInputValue([])}
              onSelect={updateInputValue}
              value={inputValue[name]}
            />
          ) : type === "Date" || type === "Time" || type === "DateTime" ? (
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
              value={inputValue[name]}
              onChange={updateInputValue}
              onClean={() => updateInputValue(null)}
            />
          ) : type === "Number" ? (
            <InputNumber
              name={name}
              value={inputValue[name]}
              onChange={updateInputValue}
            />
          ) : type === "String" ? (
            <Input value={inputValue[name]} onChange={updateInputValue} />
          ) : type === "HiddenString" ? (
            <InputPassword
              value={inputValue[name]}
              onChange={updateInputValue}
            />
          ) : type === "Checkbox" ? (
            <Checkbox
              checked={inputValue[name]}
              value={inputValue[name]}
              onChange={(value) => updateInputValue(!value)}
            />
          ) : type === "Radio" ? (
            <RadioGroup
              name="radio-group"
              value={inputValue[name]}
              onChange={updateInputValue}
            >
              {radioValues && Array.isArray(radioValues) ? (
                radioValues.map((value, key) => (
                  <Radio key={key} value={value}>
                    {value}
                  </Radio>
                ))
              ) : radioValues && typeof radioValues === "string" ? (
                <Radio value={radioValues}>{radioValues}</Radio>
              ) : (
                <></>
              )}
            </RadioGroup>
          ) : type === "Range" ? (
            <InputGroup>
              <InputNumber
                value={inputValue[name].start}
                onChange={(start) =>
                  updateInputValue({
                    ...inputValue[name],
                    start,
                    end: inputValue[name].end
                      ? Number(start!) > Number(inputValue[name].end)
                        ? Number(start!).toString()
                        : inputValue[name].end
                      : undefined,
                  })
                }
              />
              <InputGroup.Addon>to</InputGroup.Addon>
              <InputNumber
                min={
                  inputValue[name].start
                    ? Number(inputValue[name].start)
                    : undefined
                }
                value={inputValue[name].end}
                onChange={(end) =>
                  updateInputValue({ ...inputValue[name], end })
                }
              />
            </InputGroup>
          ) : (
            <Input value={inputValue[name]} onChange={updateInputValue} />
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
      </FlexboxGrid>
      {isEndNode ? (
        <>
          <Panel bordered header="URL Parameters :" style={{ marginTop: 10 }}>
            <FlexboxGrid justify="center" align="middle">
              <FlexboxGrid.Item colspan={24}>
                <InputGroup>
                  <Input
                    placeholder="URL Parameters"
                    onChange={setURLParameterValue}
                    value={urlParameterValue}
                    onKeyDown={handleURLParameterAdditionKeyDown}
                  />
                  <InputGroup.Button onClick={handleURLParameterAddition}>
                    Insert
                  </InputGroup.Button>
                </InputGroup>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={24}>
                <Divider />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={22}>
                {urlParameterList.length === 0 ? (
                  <FlexboxGrid justify="center">
                    <Text muted>No URL parameters available</Text>
                  </FlexboxGrid>
                ) : (
                  <List
                    bordered
                    sortable
                    onSort={handleURLParameterSort}
                    style={{
                      overflow: "auto",
                      maxHeight: 300,
                      wordBreak: "break-word",
                    }}
                  >
                    {urlParameterList.map((value, key) => (
                      <List.Item key={key} index={key}>
                        <FlexboxGrid justify="space-between" align="middle">
                          <FlexboxGrid.Item colspan={20}>
                            {value}
                          </FlexboxGrid.Item>
                          <FlexboxGrid.Item>
                            <IconButton
                              appearance="subtle"
                              color="red"
                              icon={<IconWrapper icon={FaXmark} />}
                              onClick={() => handleURLParameterRemoval(key)}
                            />
                          </FlexboxGrid.Item>
                        </FlexboxGrid>
                      </List.Item>
                    ))}
                  </List>
                )}
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Panel>
          <Panel
            bordered
            header="Query String Parameters :"
            style={{ marginTop: 20 }}
          >
            <FlexboxGrid justify="center" align="middle">
              <FlexboxGrid.Item colspan={24}>
                <InputGroup>
                  <Input
                    placeholder="Query String Parameters"
                    onChange={setQueryStringParameterValue}
                    value={queryStringParameterValue}
                    onKeyDown={handleQueryStringAdditionKeyDown}
                  />
                  <InputGroup.Button onClick={handleQueryStringAddition}>
                    Insert
                  </InputGroup.Button>
                </InputGroup>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={24}>
                <Divider />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={22}>
                {queryStringParameterList.length === 0 ? (
                  <FlexboxGrid justify="center">
                    <Text muted>No Query parameters available</Text>
                  </FlexboxGrid>
                ) : (
                  <List
                    bordered
                    style={{
                      overflow: "auto",
                      maxHeight: 300,
                      wordBreak: "break-word",
                    }}
                  >
                    {queryStringParameterList.map((value, key) => (
                      <List.Item key={key}>
                        <FlexboxGrid justify="space-between" align="middle">
                          <FlexboxGrid.Item colspan={20}>
                            {value}
                          </FlexboxGrid.Item>
                          <FlexboxGrid.Item>
                            <IconButton
                              appearance="subtle"
                              color="red"
                              icon={<IconWrapper icon={FaXmark} />}
                              onClick={() => handleQueryStringRemoval(key)}
                            />
                          </FlexboxGrid.Item>
                        </FlexboxGrid>
                      </List.Item>
                    ))}
                  </List>
                )}
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Panel>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
