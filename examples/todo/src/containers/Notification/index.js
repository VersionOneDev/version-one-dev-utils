import React from "react";
import classnames from "classnames";
import { usePending, useErrors } from "version-one-dev-utils/state";

export function Notification() {
  const { getPending } = usePending();
  const { getError, clearError } = useErrors();

  const error = getError();
  const pending = getPending();

  const [text, setText] = React.useState();

  React.useEffect(() => {
    if (error) {
      setText("Something went wrong");
    } else if (pending) {
      setText("Updating...");
    }
  }, [error, pending]);

  return (
    <div
      className={classnames(
        "fixed bottom-2 left-1/2 p-4 bg-gray-200 text-gray-800 rounded-md transition-all duration-300 opacity-0 text-center shadow-md",
        (error || pending) && "opacity-100",
        error && "bg-red-50 border-red-500"
      )}
      style={{
        minWidth: 200,
        transform: `translate(-50%, ${error || pending ? "0" : "40px"})`,
      }}
    >
      {text}
      {text === "Something went wrong" && (
        <button
          className="text-xs ml-4 underline hover:no-underline text-blue-500 hover:text-blue-600"
          onClick={() => clearError()}
        >
          Close
        </button>
      )}
    </div>
  );
}
