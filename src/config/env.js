export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  maxResumeSizeBytes: Number(
    import.meta.env.VITE_MAX_RESUME_SIZE_BYTES || 5 * 1024 * 1024,
  ),
};
