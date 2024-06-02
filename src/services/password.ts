import * as argon from "argon2";

export class Password {
  static async toHash(pass: string) {
    const password = await argon.hash(pass);
    return password;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const passwordMatches = await argon.verify(
      storedPassword,
      suppliedPassword
    );
    return passwordMatches;
  }
}
