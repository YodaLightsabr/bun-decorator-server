import { Server } from "../lib/server";

class App extends Server {
    @App.get("/")
    home () {
        return new Request("Hello, world!")
    }
}

App.serve();
