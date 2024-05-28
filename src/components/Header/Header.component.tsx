import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import {
  FlexboxGrid,
  IconButton,
  Navbar,
  Stack,
  Tooltip,
  Whisper,
  Header as RsuiteHeader,
} from "rsuite";
import { isLoggedOut } from "../../store/initStatusState.store";
import themeMode from "../../store/theme.mode";
import { FaGithub } from "react-icons/fa";
import { MdDarkMode, MdLightMode, MdSpaceDashboard } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import userSignoutService from "../../service/user/userSignout.service";
import { ApiResponse } from "@ecoflow/types";
import DeployButton from "./DeployButton/DeployButton.component";

export default function Header() {
  const [darkMode, setDarkMode] = useAtom(themeMode);
  const toogleMode = () => setDarkMode(!darkMode);
  const setLogout = useAtom(isLoggedOut)[1];

  const logoutHaandler = () => {
    userSignoutService().then((response: ApiResponse) => {
      if (response.success) setLogout(true);
    });
  };

  return (
    <RsuiteHeader>
      <Navbar
        style={{
          borderBottom: "1px solid var(--dashboard-navbar-border-color)",
        }}
      >
        <Link
          style={{ color: "var(--rs-navbar-default-text)" }}
          to="/editor/flow"
        >
          <Navbar.Brand as="div" style={{ width: "260px" }}>
            ECO-FLOW:FLOW
          </Navbar.Brand>
        </Link>
        <FlexboxGrid justify="end" align="middle" style={{ height: 56 }}>
          <FlexboxGrid.Item>
            <Stack spacing={10} style={{ paddingRight: 18 }}>
              <DeployButton />
              <Whisper
                placement="bottom"
                speaker={<Tooltip arrow={false}>GitHub Repo</Tooltip>}
              >
                <IconButton
                  appearance="subtle"
                  style={{ fontSize: "1.5rem" }}
                  icon={<FaGithub />}
                  href="https://github.com/EcoFlowJS/eco-flow"
                  target="_blank"
                  as="a"
                />
              </Whisper>
              <Whisper
                placement="bottom"
                speaker={<Tooltip arrow={false}>Toggle Light/Dark</Tooltip>}
              >
                <IconButton
                  appearance="subtle"
                  style={{ fontSize: "1.5rem" }}
                  icon={darkMode ? <MdLightMode /> : <MdDarkMode />}
                  onClick={toogleMode}
                />
              </Whisper>
              <Whisper
                placement="bottom"
                speaker={<Tooltip arrow={false}>Main Dashboaard</Tooltip>}
              >
                <IconButton
                  appearance="subtle"
                  style={{ fontSize: "1.5rem" }}
                  icon={<MdSpaceDashboard />}
                  as="a"
                  href={`${window.location.origin}/auth`}
                />
              </Whisper>
              <Whisper
                placement="bottom"
                speaker={<Tooltip arrow={false}>Logout</Tooltip>}
              >
                <IconButton
                  appearance="subtle"
                  style={{ fontSize: "1.5rem" }}
                  icon={<LuLogOut />}
                  onClick={logoutHaandler}
                />
              </Whisper>
            </Stack>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Navbar>
    </RsuiteHeader>
  );
}
