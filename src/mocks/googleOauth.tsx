// Stand-in for @react-oauth/google. The prototype has no login, so the Google button
// simply advances the demo instead of opening an account chooser.
import React from "react";

export const GoogleOAuthProvider = ({ children }: any) => <>{children}</>;

export const useGoogleLogin = (opts: any = {}) => {
  return () => {
    opts?.onSuccess?.({ access_token: "prototype-token" });
  };
};

export const googleLogout = () => {};
export const GoogleLogin = () => null;
export type TokenResponse = any;
export type CodeResponse = any;
