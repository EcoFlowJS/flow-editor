import { Editor, OnValidate } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { FlexboxGrid, Heading, Panel } from "rsuite";

interface CodeEditorProps {
  label?: string;
  language?: string;
  codeEditorValue?: {
    value?: string;
    validate: boolean;
  };
  onValidate?: OnValidate;
  onUpdateCodeValue?: (value: { value?: string; validate: boolean }) => void;
}

export default function CodeEditor({
  label = "",
  language,
  codeEditorValue,
  onValidate = () => {},
  onUpdateCodeValue = () => {},
}: CodeEditorProps) {
  const [codeValue, setCodeValue] = useState(
    codeEditorValue
      ? codeEditorValue
      : {
          value: "\nreturn payload;",
          validate: true,
        }
  );

  useEffect(() => onUpdateCodeValue(codeValue), [codeValue]);

  return (
    <FlexboxGrid align="middle">
      <FlexboxGrid.Item colspan={24}>
        <Heading style={{ padding: "5px 10px" }}>{label}</Heading>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24}>
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
            language={language}
            theme="vs-dark"
            onChange={(value) => setCodeValue((val) => ({ ...val, value }))}
            onValidate={onValidate}
            value={codeValue.value}
          />
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
