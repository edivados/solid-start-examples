import { analyzeModule, BaseFileSystemRouter, cleanPath } from "vinxi/fs-router";

export class APIFileSystemRouter extends BaseFileSystemRouter {
  static readonly HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

  toPath(src: string) {
    // https://github.com/solidjs/solid-start/blob/2d75d5fedfd11f739b03ca34decf23865868ac09/packages/start/config/fs-router.js#L74
    const routePath = cleanPath(src, this.config)
    // remove the initial slash
    .slice(1)
    .replace(/index$/, "")
    .replace(/\[([^\/]+)\]/g, (_, m) => {
      if (m.length > 3 && m.startsWith("...")) {
        return `*${m.slice(3)}`;
      }
      if (m.length > 2 && m.startsWith("[") && m.endsWith("]")) {
        return `:${m.slice(1, -1)}?`;
      }
      return `:${m}`;
    });

    return routePath?.length > 0 ? `/${routePath}` : "/";
  }

  toRoute(src: string) {
    let path = this.toPath(src);
    
    const [_, exports] = analyzeModule(src);
    const hasDefault = exports.find(e => e.n === "default");
    const hasAPIRoutes = exports.find(exp => APIFileSystemRouter.HTTP_METHODS.includes(exp.n));
    if (hasDefault || hasAPIRoutes) {
      return {
        ...(exports.reduce((handlers, exp) => {
          if (APIFileSystemRouter.HTTP_METHODS.includes(exp.n)) {
            handlers[`$${exp.n}`] = {
              src,
              pick: [exp.n]
            }
          }
          return handlers;
        }, {} as any)),
        path,
        filePath: src
      };
    }
  }

}