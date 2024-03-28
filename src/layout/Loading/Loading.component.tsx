import { PageLoader } from "@eco-flow/components-lib";
import "@eco-flow/components-lib/style.css";
import { FlexboxGrid } from "rsuite";

export default function Loading() {
  return (
    <FlexboxGrid
      justify="center"
      align="middle"
      style={{ width: "100vw", height: "100vh" }}
    >
      <FlexboxGrid.Item>
        <PageLoader scale="0.8" />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
