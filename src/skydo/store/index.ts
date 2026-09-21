// import { create: _create, StateCreator } from 'zustand';
import _create, { StateCreator } from "zustand";
import client from "../apollo-client";
import { devtools } from "zustand/middleware";
import * as Sentry from "@sentry/nextjs";
import log from "./logger";

const resetters: (() => void)[] = [];

export const create = (<T extends unknown>(f: StateCreator<T> | undefined) => {
  if (f === undefined) return create;
  const store = _create(zustandDevtools(log(f)));
  const initialState = store.getState();
  resetters.push(() => {
    store.setState(initialState, true);
  });
  return store;
}) as typeof _create;

export const resetAllStores = () => {
  for (const resetter of resetters) {
    resetter();
  }
  client.clearStore();
  Sentry.setUser(null);
};

export const zustandDevtools = process.env.NODE_ENV === "development" ? devtools : (f: any) => f;
