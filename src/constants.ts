import { join } from "node:path";
import type { TxConfig } from "./domain/ports/out/database/database";

export const SERVICE_NAME = "api";
export const SERVICE_VERSION = "0.1.0";

export const CACHE_MAX_SIZE = 10_000;

export const EMAIL_TOKEN_TTL = 24 * 60 * 60_000; // 24h
export const PASSWORD_RESET_TOKEN_TTL = 24 * 60 * 60_000; // 24h
export const REFRESH_TOKEN_CLEANUP_INTERVAL = 24 * 60 * 60_000; // 24h

export const READ_ONLY_DB_TX: TxConfig = {
  accessMode: "read only",
};

export const cacheNamespaces = {
  POST_LIKES: "post_likes",
};

export const PDFMAKE_FONTS = {
  Inter: {
    normal: join(import.meta.dirname, "../fonts/Inter_28pt-Regular.ttf"),
    medium: join(import.meta.dirname, "../fonts/Inter_28pt-Medium.ttf"),
    bold: join(import.meta.dirname, "../fonts/Inter_28pt-Bold.ttf"),
    italics: join(import.meta.dirname, "../fonts/Inter_28pt-Italic.ttf"),
    bolditalics: join(
      import.meta.dirname,
      "../fonts/Inter_28pt-BoldItalic.ttf",
    ),
  },
};

// ===============================
// Port Directions
// ===============================

export const INBOUND_DIRECTION = "inbound";
export const OUTBOUND_DIRECTION = "outbound";

// ===============================
// Inbound Ports
// ===============================

export const REST_SERVER_PORT = "rest-server";

// ===============================
// Outbound ports
// ===============================

// database
export const DATABASE_PORT = "database";
export const BOOTCAMPS_REPOSITORY_PORT = "bootcamps-repository";
export const CERTIFICATIONS_REPOSITORY_PORT = "certifications-repository";
export const COMMENTS_REPOSITORY_PORT = "comments-repository";
export const COMMUNITIES_REPOSITORY_PORT = "communities-repository";
export const CVS_REPOSITORY_PORT = "cvs-repository";
export const FILES_REPOSITORY_PORT = "files-repository";
export const POSTS_REPOSITORY_PORT = "posts-repository";
export const USERS_REPOSITORY_PORT = "users-repository";
export const REFRESH_TOKENS_REPOSITORY_PORT = "refresh-tokens-repository";
export const PASSWORD_TOKENS_REPOSITORY_PORT = "password-tokens-repository";
export const EMAIL_TOKENS_REPOSITORY_PORT = "email-tokens-repository";
export const USER_LIKES_REPOSITORY_PORT = "user-likes-repository";
export const USER_COMMUNITIES_REPOSITORY_PORT = "user-communities-repository";

export const CACHE_PORT = "cache";
export const EMAIL_SENDER_PORT = "email-sender";
export const EMBEDDING_PROVIDER_PORT = "embedding-provider";
export const FILE_STORAGE_PORT = "file-storage";
export const HASHER_PORT = "hasher";
export const JWT_SIGNER_PORT = "jwt-signer";
export const LLM_PROVIDER_PORT = "llm-provider";
export const PDF_GENERATOR_PORT = "pdf-generator";
export const TOKEN_PROVIDER_PORT = "token-provider";

// ===============================
// Use Cases
// ===============================

// auth
export const CHANGE_USER_PASSWORD_USE_CASE = "change-user-password";
export const LOGIN_USER_USE_CASE = "login-user";
export const LOGOUT_USER_USE_CASE = "logout-user";
export const REFRESH_USER_TOKEN_USE_CASE = "refresh-user-token";
export const REGISTER_USER_USE_CASE = "register-user";
export const RESET_USER_PASSWORD_USE_CASE = "reset-user-password";
export const SEND_PASSWORD_RESET_EMAIL_USE_CASE = "send-password-reset-email";
export const SEND_VERIFICATION_EMAIL_USE_CASE = "send-verification-email";
export const VERIFY_USER_EMAIL_USE_CASE = "verify-user-email";
export const GOOGLE_OAUTH_USE_CASE = "google-oauth";

// bootcamps
export const GET_BOOTCAMPS_FEED_USE_CASE = "get-bootcamps-feed";
export const LIST_BOOTCAMPS_USE_CASE = "list-bootcamps";

// certifications
export const GET_CERTIFICATIONS_FEED_USE_CASE = "get-certifications-feed";
export const LIST_CERTIFICATIONS_USE_CASE = "list-certifications";

// comments
export const CREATE_COMMENT_USE_CASE = "create-comment";
export const DELETE_COMMENT_USE_CASE = "delete-comment";
export const LIST_COMMENTS_USE_CASE = "list-comments";

// communities
export const GET_COMMUNITIES_FEED_USE_CASE = "get-communities-feed";
export const JOIN_COMMUNITY_USE_CASE = "join-community";
export const LEAVE_COMMUNITY_USE_CASE = "leave-community";
export const LIST_COMMUNITIES_USE_CASE = "list-communities";

// cvs
export const AI_GENERATE_CV_USE_CASE = "ai-generate-cv";
export const DOWNLOAD_CV_USE_CASE = "download-cv";
export const GET_CV_USE_CASE = "get-cv";
export const SAVE_CV_USE_CASE = "save-cv";
export const UPDATE_CV_USE_CASE = "update-cv";
export const UPDATE_CV_EMBEDDING_USE_CASE = "update-cv-embedding";

// files
export const GET_FILE_USE_CASE = "get-file";
export const UPLOAD_FILE_USE_CASE = "upload-file";

// posts
export const CREATE_POST_USE_CASE = "create-post";
export const DELETE_POST_LIKE_USE_CASE = "delete-post-like";
export const DELETE_POST_USE_CASE = "delete-post";
export const GET_POSTS_FEED_USE_CASE = "get-posts-feed";
export const LIKE_POST_USE_CASE = "like-post";

// users
export const GET_USER_COMMUNITIES_USE_CASE = "get-user-communities";
export const GET_USER_PROFTO_USE_CASE = "get-user-profto";
export const LIST_USERS_USE_CASE = "list-users";
export const UPDATE_USER_PROFTO_USE_CASE = "update-user-profto";
export const GET_USER_USE_CASE = "get-user";
