import { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnUnderline,
  BtnUndo,
  Editor,
  EditorProps,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { Panel } from "rsuite";
import "./style.less";

export default function NodeDescriptionTab({
  text = "",
  onChange = () => {},
  ...props
}: Omit<EditorProps, "value" | "onChange"> & {
  text?: string;
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(text);

  useEffect(() => onChange(value), [value]);
  return (
    <EditorProvider>
      <Panel
        bordered
        bodyFill
        header={
          <Toolbar>
            <BtnUndo />
            <BtnRedo />
            <Separator />
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
          </Toolbar>
        }
      >
        <Editor
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
      </Panel>
    </EditorProvider>
  );
}
