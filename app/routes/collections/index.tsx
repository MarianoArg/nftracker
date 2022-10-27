import { Link } from "@remix-run/react";

export default function CollectionIndexPage() {
  return (
    <p>
      No collection selected. Select a collection or{" "}
      <Link to="/collections/new" className="text-blue-500 underline">
        create a new collection.
      </Link>
    </p>
  );
}
