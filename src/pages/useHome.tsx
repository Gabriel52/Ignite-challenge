import { Dispatch, SetStateAction, useState } from 'react';
import { Post } from '.';
import { getPrismicClient } from '../services/prismic';
import { convertPostsHome } from '../utils/convertPostsHome';

type ReturnHomeType = {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
  nextPage: string;
  setNextPage: Dispatch<SetStateAction<string>>;
  handlePaginationPosts: () => Promise<Post[]>;
};
const INITIAL_VALUE_PAGINATION = 20;
export const useHome = (): ReturnHomeType => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState('');
  const [numberPage, setNumberPage] = useState(INITIAL_VALUE_PAGINATION);

  /**
   * @function
   * @name handlePaginationPosts
   * @description
   * Responsible for searching for the next pages of posts.
   */
  const handlePaginationPosts = async (): Promise<Post[]> => {
    const prismic = getPrismicClient({});
    setNumberPage(numberPage + 10);
    const primicParams = {
      pageSize: numberPage,
    };
    const { results } = await prismic.getByType('publication-custom-type', {
      ...primicParams,
      after: nextPage,
    });
    const response = convertPostsHome({ results });
    return response;
  };

  return {
    posts,
    setPosts,
    nextPage,
    setNextPage,
    handlePaginationPosts,
  };
};
