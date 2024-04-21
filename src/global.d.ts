interface Session {
  passport?: {
    user: {
      id: number;
      googleId: string;
      name: string;
      email: string;
      picture: string;
      role: string;
    };
  };
}

interface Req {
  session: Session;
}
