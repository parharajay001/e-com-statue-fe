export interface APIError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export type AsyncThunkError = {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
};