import { AppResponse } from '@/types/generic.type'

export const createResponse = <T>(message: string, data?: T): AppResponse<T> => {
  return {
    message: message,
    timestamp: new Date().toISOString(),
    data: data,
  }
}
