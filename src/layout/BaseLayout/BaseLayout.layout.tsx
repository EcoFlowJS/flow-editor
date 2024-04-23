import { Outlet, useLocation } from "react-router-dom";
import {
  errorNotification,
  successNotification,
} from "../../store/notification.store";
import { useAtom } from "jotai";
import { useNotification } from "@ecoflow/components-lib";
import { useEffect, useState } from "react";
import { initService } from "../../service/init/init.service";
import initStatusState, {
  isLoggedIn,
  isLoggedOut,
} from "../../store/initStatusState.store";
import {
  connectSocketIO,
  disconnectSocketIO,
} from "../../utils/socket.io/socket.io";
import { Socket } from "socket.io-client";
import fetchUserPermissions from "../../service/user/fetchUserPermissions.service";
import {
  userPermissionFetched,
  userPermissions,
} from "../../store/users.store";
import defaultPermissions from "../../defaults/defaultPermissions.default";
import baseSocketIOHndlers from "./baseSocketIO.handlers";
import userSignoutService from "../../service/user/userSignout.service";
import useNavigator from "../../utils/useNavigator/useNavigator";
import Loading from "../../components/Loading/Loading.component";

export default function BaseLayout() {
  //Redirect Handler
  const redirect = (url: string) => {
    window.location.replace(window.location.origin + url);
  };
  const navigate = useNavigator();
  const location = useLocation();

  //Initialize Status State
  const [isLoading, setLoading] = useState(true);
  const [initStatus, setinitStatus] = useAtom(initStatusState);

  //User Permissions State
  const setUserPermissions = useAtom(userPermissions)[1];
  const [isPermissionsFetched, setPermissionsFetched] = useAtom(
    userPermissionFetched
  );

  //User Login Logout State
  const [loggedOut, setLoggedOut] = useAtom(isLoggedOut);
  const [loggedIn, setLoggedIn] = useAtom(isLoggedIn);

  //Notifications States
  const [successNotificationMessage, setSuccessNotificationMessage] =
    useAtom(successNotification);
  const [errorNotificationMessage, setErrorNotificationMessage] =
    useAtom(errorNotification);

  //Socket.IO Socket
  let socket: Socket | null = null;
  const [isSocketConnected, setSocketConnected] = useState(false);

  //Error Notification
  const errorNoti = useNotification({
    type: "error",
    header: (
      <>
        {errorNotificationMessage.header ? errorNotificationMessage.header : ""}
      </>
    ),
    placement: errorNotificationMessage.placement,
    children: (
      <>
        {errorNotificationMessage.message
          ? errorNotificationMessage.message
          : ""}
      </>
    ),
  });

  //Success Notification
  const successNoti = useNotification({
    type: "success",
    header: (
      <>
        {successNotificationMessage.header
          ? successNotificationMessage.header
          : ""}
      </>
    ),
    placement: successNotificationMessage.placement,
    children: (
      <>
        {successNotificationMessage.message
          ? successNotificationMessage.message
          : ""}
      </>
    ),
  });

  //Success Notification State Change
  useEffect(() => {
    if (successNotificationMessage.show) {
      setSuccessNotificationMessage({
        ...successNotificationMessage,
        show: false,
      });
      successNoti.show();
    }
  }, [successNotificationMessage]);

  //Error Notification State Change
  useEffect(() => {
    if (errorNotificationMessage.show) {
      setErrorNotificationMessage({
        ...errorNotificationMessage,
        show: false,
      });
      errorNoti.show();
    }
  }, [errorNotificationMessage]);

  //initial state change
  useEffect(() => {
    initService().then((status) => {
      setinitStatus({ ...status });
      setLoading(false);
    });

    return () => {
      if (isSocketConnected && socket !== null) disconnectSocketIO(socket)();
    };
  }, []);

  //setting up user status
  useEffect(() => {
    if (!isLoading) {
      if (initStatus.isNew && !initStatus.isLoggedIn) redirect("/auth/setup");
      if (!initStatus.isNew && !initStatus.isLoggedIn) redirect("/auth/login");
      if (!initStatus.isNew && initStatus.isLoggedIn) {
        navigate(location.pathname.substring("/editor/flow/".length));
        fetchUserPermissions("Permissions").then((response) => {
          if (response.success) {
            setPermissionsFetched(true);
            setUserPermissions({
              ...defaultPermissions,
              ...response.payload.permissions,
            });
          }
        });
      }
    }
  }, [location.pathname, initStatus]);

  //socket connection and disconnect
  useEffect(() => {
    if (
      !isLoading &&
      !initStatus.isNew &&
      initStatus.isLoggedIn &&
      socket === null
    ) {
      socket = socket !== null ? socket : connectSocketIO(initStatus.userID);
      socket.on("connect", () => setSocketConnected(true));
      socket.on("disconnect", () => setSocketConnected(false));
      baseSocketIOHndlers(socket, initStatus.userID!).onRoleUpdate(
        ({ isActiveUser, roles }) => {
          if (!isActiveUser) {
            setinitStatus({ ...initStatus, isLoggedIn: false });
            userSignoutService().then(() => {
              if (socket !== null) {
                disconnectSocketIO(socket)();
                socket = null;
              }
            });
            return;
          }
          setUserPermissions({ ...defaultPermissions, ...roles });
        }
      );
      return;
    }

    if (socket !== null) disconnectSocketIO(socket)();
  }, [initStatus]);

  //Logout state change
  useEffect(() => {
    if (loggedOut) {
      setLoggedOut(false);
      setinitStatus({ ...initStatus, isLoggedIn: false });
    }
  }, [loggedOut]);

  //Login state chnage
  useEffect(() => {
    if (loggedIn) {
      setLoggedIn(false);
      setinitStatus({ ...initStatus, isLoggedIn: true });
    }
  }, [loggedIn]);

  //Flow state change
  useEffect(() => {
    window.onbeforeunload = (event: BeforeUnloadEvent) =>
      event.preventDefault();
  }, []);

  return (
    <>
      {isLoading ||
      (!initStatus.isNew && initStatus.isLoggedIn && !isPermissionsFetched) ? (
        <Loading />
      ) : (
        <Outlet />
      )}
    </>
  );
}
