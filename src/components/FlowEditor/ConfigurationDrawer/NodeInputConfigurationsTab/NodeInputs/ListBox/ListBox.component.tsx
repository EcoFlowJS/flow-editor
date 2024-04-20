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

interface ListBoxProps {
  listBoxLists?: string[];
  listSortings?: boolean;
  label?: string;
  onUpdate?: (value: string[]) => void;
}

export default function ListBox({
  listBoxLists = [],
  listSortings = false,
  label = "",
  onUpdate = () => {},
}: ListBoxProps) {
  const [listBoxListInputValue, setParameterValue] = useState("");
  const [listBoxListValues, setListBoxLists] = useState<string[]>(listBoxLists);

  const handleParameterAddition = () =>
    setListBoxLists((listBoxListValues) => {
      if (
        listBoxListValues.includes(listBoxListInputValue.trim()) ||
        /\s/g.test(listBoxListInputValue.trim()) ||
        isEmpty(listBoxListInputValue)
      )
        return listBoxListValues;
      setParameterValue("");
      return [...listBoxListValues, listBoxListInputValue.trim()];
    });

  const handleParameterAdditionKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => (event.key === "Enter" ? handleParameterAddition() : null);

  const handleParameterRemoval = (id: number) =>
    setListBoxLists((listBoxListValues) => {
      listBoxListValues.splice(id, 1);
      return [...listBoxListValues];
    });

  const handleListBoxSort = ({ oldIndex, newIndex }: MovedItemInfo) =>
    setListBoxLists((listBoxLists) => {
      const moveData = listBoxLists.splice(oldIndex, 1);
      const newData = [...listBoxLists];
      newData.splice(newIndex, 0, moveData[0]);
      return newData;
    });

  useEffect(() => onUpdate(listBoxListValues), [listBoxListValues]);
  return (
    <Panel bordered header={`${label} :`} style={{ marginTop: 10 }}>
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={24}>
          <InputGroup>
            <Input
              autoComplete="off"
              spellCheck={false}
              placeholder={label}
              onChange={setParameterValue}
              value={listBoxListInputValue}
              onKeyDown={handleParameterAdditionKeyDown}
            />
            <InputGroup.Button onClick={handleParameterAddition}>
              Insert
            </InputGroup.Button>
          </InputGroup>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <Divider />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={22}>
          {listBoxListValues.length === 0 ? (
            <FlexboxGrid justify="center">
              <Text muted>No {label} available</Text>
            </FlexboxGrid>
          ) : (
            <List
              bordered
              sortable={listSortings}
              onSort={handleListBoxSort}
              style={{
                overflow: "auto",
                maxHeight: 300,
                wordBreak: "break-word",
              }}
            >
              {listBoxListValues.map((value, key) => (
                <List.Item key={key} index={key}>
                  <FlexboxGrid justify="space-between" align="middle">
                    <FlexboxGrid.Item colspan={20}>{value}</FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                      <IconButton
                        appearance="subtle"
                        color="red"
                        icon={<IconWrapper icon={FaXmark} />}
                        onClick={() => handleParameterRemoval(key)}
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
