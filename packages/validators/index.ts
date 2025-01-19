import { z } from "zod";

const SignupCreds = z.object({
  username: z.string(),
  password: z.string().min(6),
  email: z.string().email(),
});

const SigninCreds = z.object({
  username: z.string(),
  password: z.string(),
});

const Session = z.object({
  sessionId: z.string(),
  startTime: z.string() || z.null(),
  status: z.literal("inactive") || z.literal("active"),
  title: z.string(),
});

// const UserSession = z.object({});
type SignupType = z.infer<typeof SignupCreds>;
type SigninType = z.infer<typeof SigninCreds>;
type SessionType = z.infer<typeof Session>;

export { SignupCreds, SigninCreds };
export type { SignupType, SigninType, SessionType };
