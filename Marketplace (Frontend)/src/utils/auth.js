// Authentication utility for marketplace frontend
class AuthService {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.landingPageUrl = 'http://localhost:3000';
  }

  async checkAuthStatus() {
    try {
      const response = await fetch(`${this.landingPageUrl}/api/auth-status`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        this.user = data.user;
        this.isAuthenticated = true;
        return true;
      } else {
        this.user = null;
        this.isAuthenticated = false;
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      this.user = null;
      this.isAuthenticated = false;
      return false;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${this.landingPageUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        this.user = null;
        this.isAuthenticated = false;
        // Redirect to landing page
        window.location.href = this.landingPageUrl;
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  requireAuth() {
    if (!this.isAuthenticated) {
      // Redirect to landing page login
      window.location.href = `${this.landingPageUrl}/login`;
      return false;
    }
    return true;
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }
}

// Create global auth service instance
window.authService = new AuthService();

export default window.authService;
