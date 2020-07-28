import { useContext } from "react";
import { AlertModalContext } from "../context/alert";
import { AlertModalProp } from "../components/AlertModal/AlertModal";

type AlertHook = {
  showAlert: (props: AlertModalProp) => void;
};

export const useAlert = (): AlertHook => {
  const { setAlert } = useContext(AlertModalContext);

  const showAlert = (props: AlertModalProp): void => setAlert(props);

  return {
    showAlert
  };
};
