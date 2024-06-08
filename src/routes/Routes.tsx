import { Error404 } from "@ecoflow/components-lib";
import { Route, Routes as RouterRoutes, useNavigate } from "react-router-dom";
import BaseLayout from "../layout/BaseLayout/BaseLayout.layout";
import Editor from "../pages/Editor/Editor.page";

export default function Routes() {
  const navigate = useNavigate();
  return (
    <RouterRoutes>
      <Route path="/editor/flow" element={<BaseLayout />}>
        <Route index element={<Editor />} />
      </Route>
      <Route
        path="*"
        element={
          <Error404 showBackButton onClick={() => navigate("/editor/flow")} />
        }
      />
    </RouterRoutes>
  );
}
