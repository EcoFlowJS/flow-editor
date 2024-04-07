import DebugNode from "../components/FlowEditor/DebugNode/DebugNode.component";
import MiddlewareNode from "../components/FlowEditor/MiddlewareNode/MiddlewareNode.component";
import RequestNode from "../components/FlowEditor/RequestNode/RequestNode.component";
import ResponseNode from "../components/FlowEditor/ResponseNode/ResponseNode.component";

const flowNodeTypes = {
  Request: RequestNode,
  Middleware: MiddlewareNode,
  Response: ResponseNode,
  Debug: DebugNode,
};

export default flowNodeTypes;
