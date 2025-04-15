import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/global.tsx"),
  route("collections/:collection", "routes/by-collection.tsx"),
  route("sup", "routes/sup.tsx"),
] satisfies RouteConfig;
