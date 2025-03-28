import type { Route } from "./+types/home";
import { Global } from "../global/global";

export function meta({}: Route.MetaArgs) {
  return [{ title: "everything app" }];
}

export default function Home() {
  return <Global />;
}
