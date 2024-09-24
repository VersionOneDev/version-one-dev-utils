import React, { useEffect } from "react";

import { AuthStore } from "../../stores/AuthStore";
import { UserStore } from "../../stores/UserStore";

import { useSelector } from "version-one-dev-utils/state";

import { UserAvatar } from "../../components/UserAvatar";

import Logo from "./logo.svg";

export function Header(props) {
  const auth = useSelector(() => AuthStore.getState());
  const user = useSelector(() => UserStore.select.byId(auth.id));

  useEffect(() => {
    UserStore.actions.get(auth);
  }, [auth]);

  return (
    <header className="flex bg-gray-900 items-center">
      <div className="flex-1">
        <img src={Logo} className="h-[100px]" alt="Todo App" />
      </div>

      {user && (
        <div className="flex items-center p-5">
          <UserAvatar name={user.name} url={user.avatar} />
          <div className="ml-4 text-xs">
            <p className="font-bold">{user.name}</p>
            <button
              className="underline hover:no-underline"
              onClick={AuthStore.actions.logout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
