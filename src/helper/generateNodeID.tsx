import { v4 as uuidv4 } from "uuid";

const generateNodeID = () => `${uuidv4()}`;

export default generateNodeID;
