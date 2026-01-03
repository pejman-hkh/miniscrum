import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret"
);

export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function getUser(req: Request) {
  const auth = req.headers.get("authorization");
  let userId = "";
  if (auth) {
    const token = auth.split(" ")[1];
    try {
      const payload: Record<string, unknown> = await verifyToken(token);
      userId = payload.id as string;
    } catch {
      //ignore
    }
  }
  return userId;
}