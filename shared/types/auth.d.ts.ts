// auth.d.ts
declare module "#auth-utils" {
  // the user as it is available on the client side
  interface User {
    id: string;
    username: string;
    nickname: string;
    remark: string;
    email: string;
  }

  // the session includes the user and any other session data you want to store
  interface UserSession {
    loggedInAt: Date;
  }

  // the secure session data is only available on the server side
  // we didn't add any secure session data in this example
  interface SecureSessionData {
    // Add your own fields
  }
}

export { };