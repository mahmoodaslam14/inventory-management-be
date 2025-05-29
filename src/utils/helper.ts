import { ApiResponseDto } from './response.dto';

export function createSuccessResponse<T>(
  status: number,
  message: string,
  data?: T,
): ApiResponseDto<T> {
  return {
    status,
    message,
    success: true,
    data: removeCircularReferences(data),
  };
}
export function createErrorResponse<T>(
  status: number,
  message: string,
  error?: T,
): ApiResponseDto<T> {
  return { success: false, message: message, status: status, error: error };
}

export function removeCircularReferences(obj: any, seen = new Set()): any {
  if (obj && typeof obj === 'object') {
    if (seen.has(obj)) {
      return '[Circular Reference]';
    }
    seen.add(obj);
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        obj[index] = removeCircularReferences(item, seen);
      });
    } else {
      Object.keys(obj).forEach((key) => {
        obj[key] = removeCircularReferences(obj[key], seen);
      });
    }
  }
  return obj;
}
