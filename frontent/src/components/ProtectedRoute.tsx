import { useEffect } from "react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import type { RootState } from "../store/index"

import {
  showToast,
} from "../store/toastSlice";

const ProtectedRoute = () => {

  const dispatch = useDispatch();

  const token = useSelector(
    (state: RootState) =>
      state.auth.token
  );

  const localToken =
    localStorage.getItem("token");

  const isAuthenticated =
    token || localToken;

  useEffect(() => {

    if (!isAuthenticated) {

      dispatch(
        showToast({
          type: "error",
          message: "Need to login first",
        })
      );
    }

  }, [isAuthenticated]);

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;