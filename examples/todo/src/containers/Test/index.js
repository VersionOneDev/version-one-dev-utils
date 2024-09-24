import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { ItemStore } from "../../stores/ItemStore";
import { routes } from "../../routes";
import { Link } from "react-router-dom/cjs/react-router-dom";

export function Test(props) {
  useEffect(() => {
    console.log("mount test1");
    const unsubscribe = ItemStore.actions.watch();
    return () => {
      console.log("unmount test1", unsubscribe);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("mount test2");
    const unsubscribe = ItemStore.actions.watch();
    return () => {
      console.log("unmount test2", unsubscribe);
      unsubscribe();
    };
  }, []);

  return (
    <>
      Test{" "}
      <Link
        className="underline hover:no-underline text-xs mt-1"
        to={() => routes.HOME}
        onClick={(e) => e.stopPropagation()}
      >
        View items
      </Link>
    </>
  );
}

Test.propTypes = {
  "data-testId": PropTypes.string,
};
