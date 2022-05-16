import type { LogoutSuccess, LogoutError } from "lib/types";
import { destroySession, session_handler } from "lib/session";
import Cookies from "universal-cookie";

export const logout = async (
  session_id: string,
  user_id: string
): Promise<LogoutSuccess | LogoutError> => {
  try {
    await fetch("/api/auth/logout", {
      method: "PUT",
      body: JSON.stringify({ user_id, session_id }),
    });

    await destroySession(session_id);
    const cookies = new Cookies();
    cookies.remove("session_id");

    return { user_id, session_id } as LogoutSuccess;
  } catch (e: any) {
    return {
      is_error: true,
      error_code: e.code,
      error_message: e.message,
    } as LogoutError;
  }
};

export const session_check = async (req: any, res: any): Promise<any> => {
  try {
    const session = await session_handler(req.cookies.session_id);
    return [session, null];
  } catch ({ message, code }: any) {
    switch (code) {
      case "invalid-session-id": {
        res.setHeader("Set-Cookie", ["session_id=deleted; Max-Age=0"]);
        const error = {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
        return [null, error];
      }
    }
  }
};
