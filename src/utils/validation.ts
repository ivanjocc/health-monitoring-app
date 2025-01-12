export const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);

export const isPasswordStrong = (password: string) =>
  password.length >= 6 && /\d/.test(password);
