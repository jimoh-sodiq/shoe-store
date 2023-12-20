export type TUser = {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    verificationToken: string;
    isVerified: boolean;
    verifiedDate: Date
  };
  