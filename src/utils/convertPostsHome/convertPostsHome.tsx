import { PrismicDocument } from '@prismicio/types';
import { LANGUAGE } from '../../contants';
import { Post } from '../../pages';

type Props = {
  results: PrismicDocument<Record<string, any>, string, string>[];
};

/**
 * @export
 * @function
 * @name convertPostsHome
 * @description
 * Responsible for converting the posts from the Prismic API to the Post type.
 */

export const convertPostsHome = ({ results }: Props): Post[] => {
  const response: Post[] = results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: post.data.title.toString() as string,
        author: post.data.author.toString() as string,
        subtitle: post.data.subtitle.toString() as string,
      },
      first_publication_date: new Date(
        post.last_publication_date
      ).toLocaleDateString(LANGUAGE, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return response;
};
