// Stand-in for next/dynamic: loads the component instead of code-splitting it.
import React from "react";

const dynamic = (loader: any, options: any = {}) => {
  const Lazy = React.lazy(() =>
    Promise.resolve()
      .then(() => loader())
      .then((m: any) => (m && m.default ? m : { default: m }))
      .catch(() => ({ default: () => null }))
  );
  const Loading = options?.loading ?? (() => null);
  return function DynamicComponent(props: any) {
    return (
      <React.Suspense fallback={<Loading />}>
        <Lazy {...props} />
      </React.Suspense>
    );
  };
};

export default dynamic;
