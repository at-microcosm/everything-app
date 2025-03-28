import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/global.tsx"),
  route("sup", "routes/sup.tsx")
] satisfies RouteConfig;
