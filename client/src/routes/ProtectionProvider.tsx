import type { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { app } from "../client";

export const protectedLoader = async ({ request }: LoaderFunctionArgs) => {
  // If the user is not logged in and tries to access proteceted route, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  try {
    await app.reAuthenticate();
  } catch {
    console.log("Cannot reauthenticate");
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  console.log("No need to login");
  return null;
};
