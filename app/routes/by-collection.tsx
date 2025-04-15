import type { Route } from "./+types/collection";
import { ByCollection } from '../by-collection/by-collection';

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.collection} | everything app` }];
}

export default function ByCollectionRoute({ params }) {
  return <ByCollection collection={params.collection} />;
}
