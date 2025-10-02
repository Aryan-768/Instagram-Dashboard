export interface InstagramProfile {
  username: string;
  display_name: string;
  followers: number;
  following: number;
  posts: number;
  latest_post_likes: number;
  latest_post_views: number | null;
}
