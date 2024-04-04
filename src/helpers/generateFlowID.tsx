const generateFlowID = () =>
  (Math.random() * 1e18).toString(36).slice(0, 5).toUpperCase() + "";

export default generateFlowID;
