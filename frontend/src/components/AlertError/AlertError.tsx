import React, { FC, Dispatch, SetStateAction } from "react";

import './styles.css'

interface AlertErrorProps {
  error: string
  setError: Dispatch<SetStateAction<string>>
};

const AlertError: FC<AlertErrorProps> = function ({ error,  setError }) {
  function removeError() {
    setTimeout(() => {
      setError("");
    }, 2000);
  }

  return (
    <>
      {
        error ? <div className="alert">{error} {removeError()}</div> : ""
      }
    </>
  );
};

export default AlertError;
