import type { Post } from "../types/post";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article>
      <h3>{post.body}</h3>
      <p>{post.body}</p>
    </article>
  );
}
