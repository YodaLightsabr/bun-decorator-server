import { Serve } from "bun";

type HTTPMethod = "get" | "post" | "put" | "patch" | "delete" | "options";
type Handler = (req: Request) => void;
type Route = `/` | `/${string}`;

export class Server {
    static routes = [];
    static specialRoutes: any = {};

    constructor () {
    }

    static addRoute (method: HTTPMethod, path: Route, func: Handler) {
        if (!this.routes[path]) this.routes[path] = {};
        this.routes[path][method] = func;
    }

    static get (route: Route) {
        return (target, property, descriptor) => {
            this.addRoute("get", route, descriptor.value);
        }
    }

    static post (route: Route) {
        return (target, property, descriptor) => {
            this.addRoute("post", route, descriptor.value);
        }
    }

    static put (route: Route) {
        return (target, property, descriptor) => {
            this.addRoute("put", route, descriptor.value);
        }
    }

    static patch (route: Route) {
        return (target, property, descriptor) => {
            this.addRoute("patch", route, descriptor.value);
        }
    }

    static delete (route: Route) {
        return (target, property, descriptor) => {
            this.addRoute("delete", route, descriptor.value);
        }
    }

    static config = {
        notFound: () => (target, property, descriptor) => {
            this.specialRoutes.notFound = descriptor.value;
        }
    }

    static serve ({ serverOptions }: {
        serverOptions?: Serve,
    } = {}) {
        return Bun.serve({
            ...serverOptions,
            fetch: async (req) => {
                const { pathname } = new URL(req.url);

                let handler = this.routes[pathname]?.[req.method.toLocaleLowerCase()];
                if (!handler) handler = this.config.notFound;
                if (!handler) return;

                const output = await handler.bind(new this)(req);

                if (output?.toResponse) return output.toResponse();
                return output;
            },
        });
    }

    static Errors = class {
        static NoHandler = class extends Error {}
    }
}

export { html } from "./tools/html";
export { sanitized } from "./tools/sanitized";