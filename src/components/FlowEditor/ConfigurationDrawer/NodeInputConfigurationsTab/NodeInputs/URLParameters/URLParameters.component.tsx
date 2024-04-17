import { IconWrapper } from "@ecoflow/components-lib";
import { useState, KeyboardEvent, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import {
  Divider,
  FlexboxGrid,
  IconButton,
  Input,
  InputGroup,
  List,
  Panel,
  Text,
} from "rsuite";
import { MovedItemInfo } from "rsuite/esm/List/helper/useSortHelper";
import isEmpty from "lodash/isEmpty";

interface URLParametersProps {
  urlParameters?: string[];
  onUpdate?: (id: string, value: string[]) => void;
}

export default function URLParameters({
  urlParameters = [],
  onUpdate = () => {},
}: URLParametersProps) {
  const [urlParameterValue, setURLParameterValue] = useState("");
  const [urlParameterList, setURLParameterList] =
    useState<string[]>(urlParameters);

  const handleURLParameterAddition = () =>
    setURLParameterList((urlParameterList) => {
      if (
        urlParameterList.includes(urlParameterValue.trim()) ||
        /\s/g.test(urlParameterValue.trim()) ||
        isEmpty(urlParameterValue)
      )
        return urlParameterList;
      setURLParameterValue("");
      return [...urlParameterList, urlParameterValue.trim()];
    });

  const handleURLParameterAdditionKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => (event.key === "Enter" ? handleURLParameterAddition() : null);

  const handleURLParameterRemoval = (id: number) =>
    setURLParameterList((urlParameterList) => {
      urlParameterList.splice(id, 1);
      return [...urlParameterList];
    });

  const handleURLParameterSort = ({ oldIndex, newIndex }: MovedItemInfo) =>
    setURLParameterList((urlParameters) => {
      const moveData = urlParameters.splice(oldIndex, 1);
      const newData = [...urlParameters];
      newData.splice(newIndex, 0, moveData[0]);
      return newData;
    });

  useEffect(
    () => onUpdate("$url.params", urlParameterList),
    [urlParameterList]
  );
  return (
    <Panel bordered header="URL Parameters :" style={{ marginTop: 10 }}>
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={24}>
          <InputGroup>
            <Input
              autoComplete="off"
              spellCheck={false}
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
                    <FlexboxGrid.Item colspan={20}>{value}</FlexboxGrid.Item>
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
  );
}
