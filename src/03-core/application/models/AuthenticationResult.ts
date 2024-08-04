class AuthenticationResult {
  accessToken: string = '';
  isAuthenticated: boolean = false;
  errorMessage: string = '';

  constructor(
    accessToken: string,
    isAuthenticated: boolean,
    errorMessage: string
  ) {
    this.accessToken = accessToken;
    this.isAuthenticated = isAuthenticated;
    this.errorMessage = errorMessage;
  }
}

export default AuthenticationResult;
