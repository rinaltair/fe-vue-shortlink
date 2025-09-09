/**
 * API status codes
 */
export enum ApiStatus {
  success = 200, // Success
  created = 201, // Created
  error = 400, // Error
  unauthorized = 401, // Unauthorized
  forbidden = 403, // Forbidden
  notFound = 404, // Not Found
  methodNotAllowed = 405, // Method Not Allowed
  requestTimeout = 408, // Request Timeout
  internalServerError = 500, // Internal Server Error
  notImplemented = 501, // Not Implemented
  badGateway = 502, // Bad Gateway
  serviceUnavailable = 503, // Service Unavailable
  gatewayTimeout = 504, // Gateway Timeout
  httpVersionNotSupported = 505 // HTTP Version Not Supported
}
