import type { Route } from "./+types/sup";
// import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [{ title: "everything app" }];
}

export default function Sup() {
  return <p>sup</p>;
}
