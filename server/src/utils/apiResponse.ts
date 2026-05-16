export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const apiResponse = {
  success: <T,>(data: T): ApiSuccessResponse<T> => ({
    success: true,
    data,
  }),

  paginated: <T,>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): ApiPaginatedResponse<T> => ({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  }),

  error: (message: string, errors?: Array<{ field: string; message: string }>): ApiErrorResponse => ({
    success: false,
    message,
    ...(errors && { errors }),
  }),
};
