import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-7xl font-bold">404</h1>

      <p className="text-muted-foreground">
        Page not found
      </p>

      <Link
        to="/"
        className="px-4 py-2 rounded bg-black text-white"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;