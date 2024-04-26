# decorator server

A simple server with Bun and TypeScript using decorators for routing.

## Development

```sh
git clone https://github.com/yodalightsabr/bun-decorator-server
cd bun-decorator-server
bun install

bun dev
```

## Example

Run this example with `bun run examples/simple.ts`

```ts
import { Server } from "../lib/server";

class App extends Server {
    @App.get("/")
    home () {
        return new Request("Hello, world!")
    }
}

App.serve();

```