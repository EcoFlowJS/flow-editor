import NodeLists from "../../components/NodeLists/NodeLists.component";
import Header from "../../components/Header/Header.component";
import { useLayoutEffect } from "react";
import { Container, Content } from "rsuite";

export default function Editor() {
  useLayoutEffect(() => {
    document.title = "Flow Editor";
    window.history.replaceState(null, document.title, window.location.href);
  }, []);
  return (
    <Container style={{ width: "100vw", height: "100vh" }}>
      <Header />
      <Container>
        <NodeLists />
        <Content>{/* <FlowEditor /> */}</Content>
      </Container>
    </Container>
  );
}
