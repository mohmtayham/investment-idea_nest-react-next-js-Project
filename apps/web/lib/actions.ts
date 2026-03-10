"use server";

import { authFetch } from "./authFetch";
// قم بتغيير 'constants' إلى 'constant'
import { BACKEND_URL } from "./constant";

import { getSession } from "./session";

export const getProfile = async () => {
  // const session = await getSession();
  // const response = await fetch(`${BACKEND_URL}/auth/protected`, {
  //   headers: {
  //     authorization: `Bearer ${session?.accessToken}`,
  //   },
  // });

  const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  const result = await response.json();
  return result;
};
