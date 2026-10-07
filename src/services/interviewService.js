import { DEFAULT_TSC_OPTIONS } from "../constants/tscOptions";
import { env } from "../config/env";

/**
 * @typedef {Object} GenerateInterviewPayload
 * @property {string} [user_id]
 * @property {string} candidate_name
 * @property {string} candidate_email
 * @property {string} l2_panel
 * @property {string} l2_email
 * @property {string} level
 * @property {string} jd_name
 * @property {string} role
 * @property {string} tsc
 * @property {File} [file]
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTscOptions() {
  await delay(250);
  return [...DEFAULT_TSC_OPTIONS];
}

export async function getJdOptions() {
  const response = await fetch(
    `${env.apiBaseUrl.replace(/\/$/, "")}/list_blobs`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load JD list");
  }

  const data = await response.json();
  const entries = Array.isArray(data)
    ? data
    : Array.isArray(data?.files)
      ? data.files
      : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.blobs)
          ? data.blobs
          : [];

  return entries
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item?.file_name === "string") return item.file_name;
      if (typeof item?.name === "string") return item.name;
      if (typeof item?.filename === "string") return item.filename;
      if (typeof item?.jd_name === "string") return item.jd_name;
      return "";
    })
    .filter(Boolean)
    .filter(
      (name) =>
        name.toLowerCase().endsWith(".docx") ||
        name.toLowerCase().endsWith(".pdf") ||
        name.toLowerCase().endsWith(".txt"),
    );
}

/**
 * Future API: POST /api/resumes/upload
 * @param {File} file
 */
export async function uploadResume(file) {
  await delay(400);
  return {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
  };
}

/**
 * Real API: POST /interview-candidate
 * @param {GenerateInterviewPayload} payload
 */
export async function generateInterviewLink(payload) {
  const endpoint = `${env.apiBaseUrl.replace(/\/$/, "")}/interview-candidate`;
  const formData = new FormData();

  formData.append(
    "user_id",
    Number(payload.user_id ?? localStorage.getItem("user_id") ?? 1),
  );
  formData.append("candidate_name", payload.candidate_name ?? "");
  formData.append("candidate_email", payload.candidate_email ?? "");
  formData.append("l2_panel", payload.l2_panel ?? "");
  formData.append("l2_email", payload.l2_email ?? "");
  formData.append("level", payload.level ?? "");
  formData.append("jd_name", payload.jd_name ?? "");
  formData.append("role", payload.role ?? "");
  formData.append("tsc", payload.tsc ?? "");

  if (payload.file) {
    formData.append("file", payload.file, payload.file.name);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Failed to generate interview link");
  }

  return response.json();
}
