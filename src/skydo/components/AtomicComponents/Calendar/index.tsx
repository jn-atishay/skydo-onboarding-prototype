import React, { FC } from "react";
import * as Sentry from "@sentry/nextjs";
import { CalendarProps } from "./propTypes";
import dynamic from "next/dynamic";

const CalendarImpl = dynamic(() => import("./CalendarImpl"), { ssr: false });

const Index: FC<CalendarProps> = (props) => {
  return (
    <Sentry.ErrorBoundary fallback={<></>}>
      <CalendarImpl {...props} />
    </Sentry.ErrorBoundary>
  );
};

export default Index;
