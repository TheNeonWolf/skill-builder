export type ApiFieldErrors = Record<
  string,
  string[] | undefined
>;

export interface ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
  user?: T;
  errors?: ApiFieldErrors;
}