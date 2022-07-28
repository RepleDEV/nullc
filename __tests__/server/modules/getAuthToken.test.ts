import getAuthToken from "../../../src/server/modules/getAuthToken";
import randomStringGenerator from "../../modules/randomStringGenerator";

describe("Twitter auth token params test", () => {
    it("should return correct params", async () => {
        const code = randomStringGenerator(24);
        const client_id = randomStringGenerator(16);
        const code_verifier = randomStringGenerator(16);

        const config = await getAuthToken(code, client_id, code_verifier, true);

        expect(config.method).toBe("POST");
        expect(config.url).toBe("https://api.twitter.com/2/oauth2/token");
        expect(config.params.code).toBe(code);
        expect(config.params.grant_type).toBe("authorization_code");
        expect(config.params.client_id).toBe(client_id);
        expect(config.params.redirect_uri).toBe("http://localhost:3000/callback");
        expect(config.params.code_verifier).toBe(code_verifier);
        expect(config.headers && config.headers["Content-Type"]).toBe("application/x-www-form-urlencoded");
    });
});