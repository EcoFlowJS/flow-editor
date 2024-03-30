import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {
  // useCallback, useRef,
  useState,
} from "react";
// import ReactFlow, {
//   Background,
//   BackgroundVariant,
//   Controls,
//   MiniMap,
//   ReactFlowProvider,
//   addEdge,
//   useEdgesState,
//   useNodesState,
// } from "reactflow";
import "reactflow/dist/style.css";
import { Button, FlexboxGrid } from "rsuite";

// const initialNodes = [
//   {
//     id: "1",
//     type: "input",
//     data: { label: "input node" },
//     position: { x: 250, y: 5 },
//   },
// ];

// let id = 0;
// const getId = () => `dndnode_${id++}`;

export default function FlowEditor() {
  // const reactFlowWrapper = useRef(null);
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // const onConnect = useCallback(
  //   (params: any) => setEdges((eds) => addEdge(params, eds)),
  //   []
  // );

  // const onDragOver = useCallback(
  //   (event: {
  //     preventDefault: () => void;
  //     dataTransfer: { dropEffect: string };
  //   }) => {
  //     event.preventDefault();
  //     event.dataTransfer.dropEffect = "move";
  //   },
  //   []
  // );

  // const onDrop = useCallback(
  //   (event: any) => {
  //     event.preventDefault();

  //     const type = event.dataTransfer.getData("application/reactflow");

  //     // check if the dropped element is valid
  //     if (typeof type === "undefined" || !type) {
  //       return;
  //     }

  //     // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
  //     // and you don't need to subtract the reactFlowBounds.left/top anymore
  //     // details: https://reactflow.dev/whats-new/2023-11-10
  //     const position = reactFlowInstance.screenToFlowPosition({
  //       x: event.clientX,
  //       y: event.clientY,
  //     });
  //     const newNode = {
  //       id: getId(),
  //       type,
  //       position,
  //       data: { label: `${type} node` },
  //     };

  //     setNodes((nds) => nds.concat(newNode));
  //   },
  //   [reactFlowInstance]
  // );

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <FlexboxGrid>
        <FlexboxGrid.Item colspan={20}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {[...Array(100)].map((_x, i) => (
              <Tab key={i} label="Item" />
            ))}
          </Tabs>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <Button>gfv</Button>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <div style={{ width: "calc(100vw - 260px)" }}>
        {/* <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {[...Array(100)].map((_x, i) => (
            <Tab key={i} label="Item" />
          ))}
        </Tabs> */}
      </div>
    </>
  );
}
