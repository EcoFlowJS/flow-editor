import NodeLists from "../../components/NodeLists/NodeLists.component";
import FlowEditor from "../../components/FlowEditor/FlowEditor.component";
import Header from "../../components/Header/Header.component";

export default function Editor() {
  return (
    <>
      <Header />
      <NodeLists />
      <FlowEditor />
    </>
  );
}
