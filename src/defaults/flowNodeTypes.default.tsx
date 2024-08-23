import ConfigurationNode from "../components/FlowEditor/ConfigurationNode/ConfigurationNode.component";
import DebugNode from "../components/FlowEditor/DebugNode/DebugNode.component";
import EventEmitterNode from "../components/FlowEditor/EventEmitterNode/EventEmitterNode.component";
import EventListenerNode from "../components/FlowEditor/EventListenerNode/EventListenerNode.component";
import MiddlewareNode from "../components/FlowEditor/MiddlewareNode/MiddlewareNode.component";
import RequestNode from "../components/FlowEditor/RequestNode/RequestNode.component";
import ResponseNode from "../components/FlowEditor/ResponseNode/ResponseNode.component";

const flowNodeTypes = {
  Request: RequestNode,
  Middleware: MiddlewareNode,
  Response: ResponseNode,
  Debug: DebugNode,
  EventListener: EventListenerNode,
  EventEmitter: EventEmitterNode,
  Configuration: ConfigurationNode,
};

export default flowNodeTypes;
