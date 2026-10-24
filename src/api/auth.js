import { authApi } from "./api";

export async function adminLogin(identifier, password) {
  return authApi.login(identifier, password);
}

export async function adminLogout() {
  return authApi.logout();
}

export async function getAdminProfile() {
  return authApi.getMe();
}

export function getAdminUser() {
  return authApi.getUser();
}

export function getAdminToken() {
  return authApi.getToken();
}

export function clearAdminSession() {
  authApi.clearSession();
}
