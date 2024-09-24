import React from "react";
import classnames from "classnames";
import { usePending, useErrors } from "version-one-dev-utils/state";

export function Notification() {
  const { getPending } = usePending();
  const { getError, clearError } = useErrors();

  const error = getError();
  const pending = getPending();

  const [message, setMessage] = React.useState({ type: null, value: null });

  React.useEffect(() => {
    if (error) {
      if (message.value !== error.value.message) {
        setMessage({ type: "Error", value: error.value.message });
      }
    } else if (pending) {
      if (pending.type !== message.value) {
        setMessage({ type: "Pending", value: pending.type });
      }
    }
  }, [error, pending, setMessage, message.value]);

  return (
    <div
      className={classnames(
        "fixed bottom-8 left-8 p-4 bg-gray-900 rounded-md transition-all duration-300 shadow-md"
      )}
      style={{
        minWidth: 300,
        transform: `translate(0, ${error || pending ? "0" : "40px"})`,
        opacity: error || pending ? 1 : 0,
      }}
    >
      <div className="text-xs mb-2 flex items-center">
        <div
          className={classnames(
            "inline-block rounded-full mr-2",
            message.type === "Pending" && "bg-amber-500",
            message.type === "Error" && "bg-red-500"
          )}
          style={{ width: 10, height: 10 }}
        />
        <span className="flex-1">{message.type}</span>
        {message.type === "Error" && (
          <button
            className="text-xs ml-4 underline hover:no-underline text-blue-500 hover:text-blue-600"
            onClick={() => clearError()}
          >
            Clear
          </button>
        )}
      </div>
      <span className="text-sm">{message.value}</span>
    </div>
  );
}
