import { IconWrapper } from "@ecoflow/components-lib";
import { KeyboardEvent, useEffect, useState } from "react";
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
import isEmpty from "lodash/isEmpty";

interface QueryStringParametersProps {
  queryStrings?: string[];
  onUpdate?: (id: string, value: string[]) => void;
}

export default function QueryStringParameters({
  queryStrings = [],
  onUpdate = () => {},
}: QueryStringParametersProps) {
  const [queryStringParameterValue, setQueryStringParameterValue] =
    useState("");
  const [queryStringParameterList, setQueryStringParameterList] =
    useState<string[]>(queryStrings);

  const handleQueryStringAddition = () =>
    setQueryStringParameterList((queryStringParameterList) => {
      if (
        queryStringParameterList.includes(queryStringParameterValue.trim()) ||
        /\s/g.test(queryStringParameterValue.trim()) ||
        isEmpty(queryStringParameterValue)
      )
        return queryStringParameterList;
      setQueryStringParameterValue("");
      return [...queryStringParameterList, queryStringParameterValue.trim()];
    });

  const handleQueryStringAdditionKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => (event.key === "Enter" ? handleQueryStringAddition() : null);

  const handleQueryStringRemoval = (id: number) =>
    setQueryStringParameterList((queryStringParameterList) => {
      queryStringParameterList.splice(id, 1);
      return [...queryStringParameterList];
    });

  useEffect(
    () => onUpdate("$url.query", queryStringParameterList),
    [queryStringParameterList]
  );
  return (
    <Panel
      bordered
      header="Query String Parameters :"
      style={{ marginTop: 20 }}
    >
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={24}>
          <InputGroup>
            <Input
              autoComplete="off"
              spellCheck={false}
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
                    <FlexboxGrid.Item colspan={20}>{value}</FlexboxGrid.Item>
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
  );
}
