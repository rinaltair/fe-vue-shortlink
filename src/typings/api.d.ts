/**
 * namespace: Api
 *
 * All API-related type definitions
 * Using this in .vue files may error; configure in eslint.config.mjs: globals: { Api: 'readonly' }
 */
declare namespace Api {
  /** Base types */
  namespace Http {
    /** Base API response */
    interface BaseResponse<T = any> {
      // Status code
      code: number
      // Message
      message: string
      // Data
      data: T
    }
  }

  /** Common types */
  namespace Common {
    /** Pagination parameters */
    interface PaginatingParams {
      /** Current page number */
      current: number
      /** Page size */
      size: number
      /** Total items */
      total: number
    }

    /** Common search parameters */
    type PaginatingSearchParams = Pick<PaginatingParams, 'current' | 'size'>

    /** Enable status */
    type EnableStatus = '1' | '2'
  }

  /** Auth types */
  namespace Auth {
    /** Login parameters */
    interface LoginParams {
      userName: string
      password: string
    }

    /** Login response */
    interface LoginResponse {
      token: string
      refreshToken: string
    }
  }

  /** User types */
  namespace User {
    /** User info */
    interface UserInfo {
      userId: number
      userName: string
      roles: string[]
      buttons: string[]
      avatar?: string
      email?: string
      phone?: string
    }

    /** User list data */
    interface UserListData {
      records: UserListItem[]
      current: number
      size: number
      total: number
    }

    /** User list item */
    interface UserListItem {
      id: number
      avatar: string
      createBy: string
      createTime: string
      updateBy: string
      updateTime: string
      status: '1' | '2' | '3' | '4' // 1: Online 2: Offline 3: Abnormal 4: Cancelled
      userName: string
      userGender: string
      nickName: string
      userPhone: string
      userEmail: string
      userRoles: string[]
    }
  }
}
