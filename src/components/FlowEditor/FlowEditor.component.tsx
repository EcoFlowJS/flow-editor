import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function FlowEditor() {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#CCC" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          attributionPosition="top-right"
        >
          <Controls />
          <MiniMap nodeStrokeWidth={3} />
          <Background color="#000" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
