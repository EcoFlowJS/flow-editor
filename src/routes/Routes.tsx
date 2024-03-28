import { Error404 } from "@eco-flow/components-lib";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import BaseLayout from "../layout/BaseLayout/BaseLayout.layout";
import Dashboard from "../pages/Dashboard/Dashboard.page";

export default function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/editor/flow" element={<BaseLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}
