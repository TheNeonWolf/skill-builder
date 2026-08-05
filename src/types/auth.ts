export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  globalXp: number;
  activeCareerProfileId: string | null;
  createdAt: string;
}