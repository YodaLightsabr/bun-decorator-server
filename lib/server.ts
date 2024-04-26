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
        return <T extends TypedPropertyDescriptor<(req: Request) => void>>(target, property, descriptor: T) => {
            this.addRoute("get", route, descriptor.value);
        }
    }

    static post (route: Route) {
        return <T extends TypedPropertyDescriptor<(req: Request) => void>>(target, property, descriptor: T) => {
            this.addRoute("post", route, descriptor.value);
        }
    }

    static put (route: Route) {
        return <T extends TypedPropertyDescriptor<(req: Request) => void>>(target, property, descriptor: T) => {
            this.addRoute("put", route, descriptor.value);
        }
    }

    static patch (route: Route) {
        return <T extends TypedPropertyDescriptor<(req: Request) => void>>(target, property, descriptor: T) => {
            this.addRoute("patch", route, descriptor.value);
        }
    }

    static delete (route: Route) {
        return <T extends TypedPropertyDescriptor<(req: Request) => void>>(target, property, descriptor: T) => {
            this.addRoute("delete", route, descriptor.value);
        }
    }

    static config = {
        notFound: () => (target, property, descriptor) => {
            this.specialRoutes.notFound = descriptor.value;
        }
    }

    static async handle (req: Request, handler: Handler) {
        return await handler.bind(new this)(req); // Allow for modifications in subclasses
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

                const output = await this.handle(req, handler);

                if (output?.toResponse) return output.toResponse();
                return output;
            },
        });
    }
}

export { html } from "./tools/html";
export { sanitized } from "./tools/sanitized";