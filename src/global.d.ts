interface Session {
  passport?: {
    user: {
      googleId: string;
      name: string;
      email: string;
      picture: string;
      role: string;
    };
  };
}
