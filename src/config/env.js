export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://interview-prep-backend-c2hjedhmhvfthdgc.eastus-01.azurewebsites.net',
  wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || 'wss://interview-prep-backend-c2hjedhmhvfthdgc.eastus-01.azurewebsites.net',
  maxResumeSizeBytes: Number(
    import.meta.env.VITE_MAX_RESUME_SIZE_BYTES || 5 * 1024 * 1024,
  ),
};
