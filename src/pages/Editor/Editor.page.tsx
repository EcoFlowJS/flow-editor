import NodeLists from "../../components/NodeLists/NodeLists.component";
import Header from "../../components/Header/Header.component";
import { useLayoutEffect } from "react";
import { Container, Content } from "rsuite";
import FlowEditor from "../../components/FlowEditor/FlowEditor.component";
import { useAtom } from "jotai";
import { exportModal } from "../../store/export.store";
import ExportModal from "../../components/ExportModal/ExportModal.component";

export default function Editor() {
  const [openModal, setOpenModal] = useAtom(exportModal);

  useLayoutEffect(() => {
    document.title = "Flow Editor";
    window.history.replaceState(null, document.title, window.location.href);
  }, []);
  return (
    <>
      <Container style={{ width: "100vw", height: "100vh" }}>
        <Header />
        <Container>
          <NodeLists />
          <Content>
            <FlowEditor />
          </Content>
        </Container>
      </Container>
      {openModal ? (
        <ExportModal open={openModal} onClose={() => setOpenModal(false)} />
      ) : (
        <></>
      )}
    </>
  );
}
