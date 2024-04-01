import { IconWrapper } from "@ecoflow/components-lib";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { Input, InputGroup } from "rsuite";
import { PrependParameters } from "rsuite/esm/@types/utils";
import "./style.less";

interface FilterNodeProps {
  onChange?: PrependParameters<
    React.ChangeEventHandler<HTMLInputElement>,
    [value: string]
  >;
}

export default function FilterNode({ onChange }: FilterNodeProps) {
  return (
    <InputGroup inside className="filter-node">
      <InputGroup.Addon>
        <IconWrapper icon={PiMagnifyingGlassBold} />
      </InputGroup.Addon>
      <Input placeholder="Filter Node" onChange={onChange} />
    </InputGroup>
  );
}
