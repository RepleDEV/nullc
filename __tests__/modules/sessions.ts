/* 

    (Partial) TS rewrite of https://github.com/rjz/supertest-session

    LICENSE:
    MIT License

    Copyright (C) RJ Zaworski <rj@rjzaworski.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as http from "http";
import * as https from "https";
import * as supertest from "supertest";
import { CookieAccessInfo as CookieAccess } from "cookiejar";
import { URL } from "url";
import methods from "methods";

type SessionOptions = supertest.AgentOptions & {
    before?: (test: supertest.Test) => void;
    cookieAccess?: CookieAccess;
    destroy?: () => void;
    helpers?: any;
} & Record<string, any>;
class Session {
    server: http.Server | https.Server;
    options: SessionOptions;
    agent: supertest.SuperAgentTest
    url: URL;
    cookieAccess: CookieAccess;

    constructor(app: any, options?: SessionOptions) {
        this.options = options || {};

        this.agent = supertest.agent(this.server, this.options);

        this.server = http.createServer(app);
        this.url = new URL(Session.getUrl(this.server));
        
        this.options = options || {};

        this.reset();

        if (this.options.helpers instanceof Object) {
            Object.assign(this, this.options.helpers);
        }
    }

    get cookies() {
        return this.agent.jar.getCookies(this.cookieAccess);
    }

    reset() {
        const agentOptions = Object.assign({}, this.options, {
            before: undefined,
            cookieAccess: undefined,
            destroy: undefined,
            helpers: undefined,
        });

        this.agent = supertest.agent(this.server, agentOptions);

        const cookieAccessOptions = this.options.cookieAccess;
        const { domain, path, secure, script } = cookieAccessOptions || {
            domain: this.url.hostname,
            path: this.url.pathname,
            secure: "https:" === this.url.protocol,
            script: false,
        };

        this.cookieAccess = new CookieAccess(domain, path, secure, script);
    }

    destroy() {
        if (this.options.destroy)
            this.options.destroy.call(this);

        this.reset();
    }

    static getUrl(app: http.Server | https.Server): string {
        if (!app.listening) app.listen(0);

        const addr = app.address();
        if (!addr) return "";

        const port = typeof addr === "string" ? +addr : addr.port;
        const protocol = app instanceof https.Server ? "https" : "http";

        return `${protocol}://127.0.0.1:${port}`;
    }

    // TODO: This is temp solution !! This isn't faithful to the original code.
    get(route: string) {
        const test = this.agent.get(route);

        if (this.options.before)
            this.options.before.call(this, test);
        
        return test;
    }

    post(route: string) {
        const test = this.agent.post(route);

        if (this.options.before)
            this.options.before.call(this, test);
        
        return test;
    }
}

export default Session;
export { Session };