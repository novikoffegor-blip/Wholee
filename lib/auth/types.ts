export type AuthRole = "guest" | "buyer" | "brand";
export type AccountRole = Exclude<AuthRole, "guest">;

export type DemoSessionResponse = {
  role: AuthRole;
};
