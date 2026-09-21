// Stand-in for the product's withAuth wrapper. There is no login in the prototype,
// so every page is shown as if the sample customer were signed in.
import React from "react";

export default function withAuth<P>(Component: React.ComponentType<P>) {
  return function Authed(props: P) {
    return <Component {...(props as any)} />;
  };
}
