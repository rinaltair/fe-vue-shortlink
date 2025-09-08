import request from '@/utils/http'

export class UserService {
  // Login
  static login(params: Api.Auth.LoginParams) {
    return request.post<Api.Auth.LoginResponse>({
      url: '/auth/login',
      params
      // showErrorMessage: false // Do not show error message
    })
  }

  // Get user info
  static getUserInfo() {
    return request.get<Api.User.UserInfo>({
      url: '/api/user/info'
      // Custom request headers
      // headers: {
      //   'X-Custom-Header': 'your-custom-value'
      // }
    })
  }

  // Get user list
  static getUserList(params: Api.Common.PaginatingSearchParams) {
    return request.get<Api.User.UserListData>({
      url: '/api/user/list',
      params
    })
  }
}
