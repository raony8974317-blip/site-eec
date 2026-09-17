// src/ serveless.ts
import { getRequestListener } from "@hono/node-server";

// src/app.ts
import { Hono as hono12 } from "hono";

// src/routes/admin.routes.ts
import { Hono} from "hono";

// src/errors/http-error.ts
var HttpError = class extends Error {
    constructor(status, message){
        super(message);
        this.status = status;
        this.name = "HttpError";
    }
    status;
};
function errorBody(message){
    return { error: message};
}

// src/lib/supabase.ts
import { createServerCliente, parseCookieHeader } from "@supabase/ssr";
import { createCliente } from "Asupabase/supabase-js";
import { setCookie } from "hono/cookie";

//src/config/env.ts
