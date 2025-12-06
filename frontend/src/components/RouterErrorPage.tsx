import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Result, Button } from "antd";

export default function RouterErrorPage() {
  const error = useRouteError();

  let message = "Unexpected application error";

  if (isRouteErrorResponse(error)) {
    message = `${error.status} - ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <Result
      status="error"
      title="Something went wrong"
      subTitle={message}
      extra={
        <Button type="primary" onClick={() => (window.location.href = "/")}>
          Go Home
        </Button>
      }
    />
  );
}
