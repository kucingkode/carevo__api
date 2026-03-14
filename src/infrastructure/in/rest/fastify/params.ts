import type { ChangeUserPasswordUseCase } from "@/domain/ports/in/auth/change-user-password";
import type { LoginUserUseCase } from "@/domain/ports/in/auth/login-user";
import type { LogoutUserUseCase } from "@/domain/ports/in/auth/logout-user";
import type { RefreshUserTokenUseCase } from "@/domain/ports/in/auth/refresh-user-token";
import type { RegisterUserUseCase } from "@/domain/ports/in/auth/register-user";
import type { ResetUserPasswordUseCase } from "@/domain/ports/in/auth/reset-user-password";
import type { SendPasswordResetEmailUseCase } from "@/domain/ports/in/auth/send-password-reset-email";
import type { SendVerificationEmailUseCase } from "@/domain/ports/in/auth/send-verification-email";
import type { VerifyUserEmailUseCase } from "@/domain/ports/in/auth/verify-user-email";
import type { GetBootcampsFeedUseCase } from "@/domain/ports/in/bootcamps/get-bootcamps-feed";
import type { ListBootcampsUseCase } from "@/domain/ports/in/bootcamps/list-bootcamps";
import type { GetCertificationsFeedUseCase } from "@/domain/ports/in/certifications/get-certifications-feed";
import type { ListCertificationsUseCase } from "@/domain/ports/in/certifications/list-certifications";
import type { CreateCommentUseCase } from "@/domain/ports/in/comments/create-comment";
import type { DeleteCommentUseCase } from "@/domain/ports/in/comments/delete-comment";
import type { ListCommentsUseCase } from "@/domain/ports/in/comments/list-comments";
import type { GetCommunitiesFeedUseCase } from "@/domain/ports/in/communities/get-communities-feed";
import type { JoinCommunityUseCase } from "@/domain/ports/in/communities/join-community";
import type { LeaveCommunityUseCase } from "@/domain/ports/in/communities/leave-community";
import type { ListCommunitiesUseCase } from "@/domain/ports/in/communities/list-communities";
import type { AiGenerateCvUseCase } from "@/domain/ports/in/cvs/ai-generate-cv";
import type { DownloadCvUseCase } from "@/domain/ports/in/cvs/download-cv";
import type { GetCvUseCase } from "@/domain/ports/in/cvs/get-cv";
import type { SaveCvUseCase } from "@/domain/ports/in/cvs/save-cv";
import type { UpdateCvUseCase } from "@/domain/ports/in/cvs/update-cv";
import type { GetFileUseCase } from "@/domain/ports/in/files/get-file";
import type { UploadFileUseCase } from "@/domain/ports/in/files/upload-file";
import type { CreatePostUseCase } from "@/domain/ports/in/posts/create-post";
import type { DeletePostUseCase } from "@/domain/ports/in/posts/delete-post";
import type { DeletePostLikeUseCase } from "@/domain/ports/in/posts/delete-post-like";
import type { GetPostsFeedUseCase } from "@/domain/ports/in/posts/get-posts-feed";
import type { LikePostUseCase } from "@/domain/ports/in/posts/like-post";
import type { GetProftoUseCase } from "@/domain/ports/in/proftos/get-profto";
import type { ListProftosUseCase } from "@/domain/ports/in/proftos/list-proftos";
import type { UpdateProftoUseCase } from "@/domain/ports/in/proftos/update-profto";

export type FastifyRestServerParams = {
  config: {
    host: string;
    port: number;

    // cors
    allowedOrigins: string[];

    // rate limit
    rateLimitMax: number;
    rateLimitWindowMs: number;

    // under presssure
    maxEventLoopDelay: number;
    maxHeapBytes: number;
    maxRssBytes: number;
    maxElu: number;
  };

  // health check
  pingDatabase: () => Promise<void>;

  // auth
  changeUserPasswordService: ChangeUserPasswordUseCase;
  loginUserService: LoginUserUseCase;
  logoutUserService: LogoutUserUseCase;
  refreshUserTokenService: RefreshUserTokenUseCase;
  registerUserService: RegisterUserUseCase;
  resetUserPasswordService: ResetUserPasswordUseCase;
  sendPasswordResetEmailService: SendPasswordResetEmailUseCase;
  sendVerificationEmailService: SendVerificationEmailUseCase;
  verifyUserEmailService: VerifyUserEmailUseCase;

  // bootcamps
  getBootcampsFeedService: GetBootcampsFeedUseCase;
  listBootcampsService: ListBootcampsUseCase;

  // certifications
  getCertificationsFeedService: GetCertificationsFeedUseCase;
  listCertificationsService: ListCertificationsUseCase;

  // comments
  createCommentService: CreateCommentUseCase;
  deleteCommentService: DeleteCommentUseCase;
  listCommentsService: ListCommentsUseCase;

  // communities
  getCommunitiesFeedService: GetCommunitiesFeedUseCase;
  joinCommunityService: JoinCommunityUseCase;
  leaveCommunityService: LeaveCommunityUseCase;
  listCommunitiesService: ListCommunitiesUseCase;

  // cvs
  aiGenerateCvService: AiGenerateCvUseCase;
  downloadCvService: DownloadCvUseCase;
  getCvService: GetCvUseCase;
  saveCvService: SaveCvUseCase;
  updateCvService: UpdateCvUseCase;

  // files
  getFileService: GetFileUseCase;
  uploadFileService: UploadFileUseCase;

  // posts
  createPostService: CreatePostUseCase;
  deletePostLikeService: DeletePostLikeUseCase;
  deletePostService: DeletePostUseCase;
  getPostsFeedService: GetPostsFeedUseCase;
  likePostService: LikePostUseCase;

  // proftos
  getProftoService: GetProftoUseCase;
  listProftosService: ListProftosUseCase;
  updateProftoService: UpdateProftoUseCase;
};
