import { Nav, Sidebar, Sidenav } from "rsuite";

export default function NodeLists() {
  const navigationHandler = () => {};
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Sidebar
      style={{ display: "flex", flexDirection: "column" }}
      width={260}
      collapsible
    >
      <Sidenav
        expanded
        style={{
          height: "calc(100vh - 56px)",
          minHeight: 600,
          overflow: "auto",
        }}
        openKeys={["3"]}
      >
        <Sidenav.Body>
          <Nav onSelect={navigationHandler}>
            <Nav.Menu
              eventKey="3"
              trigger="hover"
              title="Advanced"
              placement="rightStart"
            >
              {[...Array(100)].map((_x, i) => (
                <Nav.Item
                  key={i}
                  draggable
                  onDragStart={(event) => {
                    onDragStart(
                      event,
                      i / 3 === 0 ? "output" : i / 2 === 0 ? "default" : "input"
                    );
                  }}
                >
                  Available Packages
                </Nav.Item>
              ))}
            </Nav.Menu>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
}
