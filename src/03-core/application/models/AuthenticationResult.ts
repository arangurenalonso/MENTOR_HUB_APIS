class AuthenticationResult {
  accessToken: string = '';
  refreshToken: string;
  isAuthenticated: boolean = false;
  errorMessage: string = '';

  constructor(
    accessToken: string,
    refreshToken: string,
    isAuthenticated: boolean,
    errorMessage: string
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.isAuthenticated = isAuthenticated;
    this.errorMessage = errorMessage;
  }
}

export default AuthenticationResult;
