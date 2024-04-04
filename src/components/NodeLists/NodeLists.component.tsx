import { Nav, Placeholder, Sidebar, Sidenav } from "rsuite";
import Nodes from "./Nodes/Nodes.component";
import { useEffect, useState } from "react";
import fetchModules from "../../service/module/fetchModules.server";
import { useAtom } from "jotai";
import { ecoModules as EcoModules } from "../../store/module.store";
import { Modules } from "@ecoflow/types";
import FilterNode from "./FilterNode/FilterNode.component";
import cloneDeep from "lodash/cloneDeep";
import "./style.less";

export default function NodeLists() {
  const [isLoading, setLoading] = useState(true);
  const [ecoModules, setEcoModules] = useAtom(EcoModules);
  const [modules, setModules] = useState<Modules>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const filterNodeHandler = (value: string) => {
    if (value.trim().length === 0) {
      setModules(cloneDeep(ecoModules));
      return;
    }

    setModules(
      cloneDeep(ecoModules)
        .map((module) => {
          module.nodes = module.nodes.filter((node) =>
            node.name.toLowerCase().includes(value.toLowerCase())
          );
          return module.nodes.length > 0 ? module : null;
        })
        .filter((node) => node !== null) as Modules
    );
  };

  useEffect(() => setModules(cloneDeep(ecoModules)), [ecoModules]);

  useEffect(() => {
    fetchModules().then((response) => {
      setLoading(false);
      if (response.success) {
        setEcoModules(cloneDeep(response.payload));
        setOpenKeys((response.payload as Modules).map((m) => m.id._id));
      }
    });
  }, []);

  return (
    <Sidebar
      width={200}
      className="sidebar"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <FilterNode onChange={filterNodeHandler} />
      <Sidenav
        expanded
        className="sidenav-scrollbar"
        style={{
          height: "calc(100vh - 57px - 35px)",
          minHeight: 600,
          overflow: "auto",
        }}
        onOpenChange={setOpenKeys}
        openKeys={openKeys}
      >
        <Sidenav.Body>
          {isLoading ? (
            <Placeholder.Paragraph active rows={5} />
          ) : (
            <Nav>
              {modules.map((module, key) => (
                <Nav.Menu
                  key={key}
                  eventKey={module.id._id}
                  title={module.name}
                  placement="rightStart"
                >
                  {module.nodes.map((node, key) => (
                    <Nodes
                      key={key}
                      nodeID={node.id}
                      type={node.type}
                      label={node.name}
                    />
                  ))}
                </Nav.Menu>
              ))}
            </Nav>
          )}
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
}
