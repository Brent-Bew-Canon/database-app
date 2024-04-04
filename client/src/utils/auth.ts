import { jwtDecode } from "jwt-decode";

class AuthService {
  getProfile(): any {
    return jwtDecode(this.getToken());
  }

  loggedIn(): boolean {
    // Checks if there is a saved token and it's still valid
    const token: string | null = this.getToken();
    if (token === null) {
      return false;
    }
    if (this.isTokenExpired(token) === true) {
      return false;
    }
    return true;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      // Check if token expiry time is less than the current time
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return true; // Treat decoding errors as expired tokens
    }
  }

  getToken(): string | null {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  login(idToken: string): void {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);

    // window.location.assign("/Profile");
  }

  logout(): void {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
    // this will reload the page and reset the state of the application
    window.location.assign("/");
  }
}

export default new AuthService();
