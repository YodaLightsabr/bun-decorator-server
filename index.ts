import { Server, html } from "./lib/server";

class App extends Server {
    baseLayout ({ title }: { title: string }, body: string) {
        return html`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
                <title>${title}</title>
            </head>
            <body>
                ${body}
            </body>
            </html>
        `
    }

    @App.get("/")
    home (req: Request) {
        return this.baseLayout({ title: "Home" }, html`
            <h1>Hello, world!</h1>

            <p>Welcome to my cool website!</p>

            <h2>You should fill out my form:</h2>

            <form action="/data" method="POST">
                <input name="name" placeholder="Name" />

                <button type="submit">Submit</button>
            </form>
        `);
    }

    @App.post("/data")
    async form (req: Request) {
        const name = (await req.formData()).get("name");

        return this.baseLayout({ title: "Data" }, html`
            <h1>Your data:</h1>

            <p>Your name is: ${name}</p>

            <a href="/">Go back</a>
        `);
    }
}

App.serve();
