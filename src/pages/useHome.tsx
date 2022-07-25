import { Dispatch, SetStateAction, useState } from 'react';
import { Post } from '.';
import { convertPostsHome } from '../utils/convertPostsHome';

type ReturnHomeType = {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
  setNextPage: Dispatch<SetStateAction<string>>;
  handlePaginationPosts: () => Promise<void>;
  nextPage: string;
};
export const useHome = (): ReturnHomeType => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState('');

  /**
   * @function
   * @name handlePaginationPosts
   * @description
   * Responsible for searching for the next pages of posts.
   */
  const handlePaginationPosts = async (): Promise<void> => {
    const response = await fetch(nextPage);
    const data = await response.json();
    console.log(data);
    const restPost = convertPostsHome({ results: data.results });
    setPosts([...posts, ...restPost]);
    setNextPage(data.next_page);
  };

  return {
    posts,
    nextPage,
    setPosts,
    setNextPage,
    handlePaginationPosts,
  };
};
