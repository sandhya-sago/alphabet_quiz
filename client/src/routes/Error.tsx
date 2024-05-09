import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const err = error
    ? error.statusText
      ? error.statusText
      : error.message
        ? error.message
        : `${error}`
    : "unknown Error";

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{err}</i>
      </p>
    </div>
  );
}
