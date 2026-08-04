export type ApiFieldErrors = Record<string, string[] | undefined>;

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  user?: T;
  errors?: ApiFieldErrors;
}