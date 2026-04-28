import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { env } from "./env.js";

const PgSession = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PgSession({
    conString: env.DATABASE_URL,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  name: "messaging_app.sid",
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: env.IS_PRODUCTION,
  cookie: {
    httpOnly: true,
    secure: env.IS_PRODUCTION,
    sameSite: env.IS_PRODUCTION ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
