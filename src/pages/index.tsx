import { GetStaticProps } from 'next';
import { BiCalendarMinus, BiUser } from 'react-icons/bi';
import Link from 'next/link';

import { useEffect } from 'react';
import { TIME_FOR_REVALIDATE } from '../contants';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';
import { useHome } from './useHome';
import { convertingDate } from '../utils/convertingDate';

export interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export interface PostPagination {
  next_page: string;
  results: Post[];
}

export default function Home({
  results,
  next_page,
}: PostPagination): JSX.Element {
  const {
    posts,
    setPosts,
    nextPage,
    setNextPage,
    handlePaginationPosts,
  } = useHome();

  useEffect(() => {
    /**
     * @function
     * @name initialValue
     * @description
     * Responsible for setting the initial value of the posts state.
     */
    const initialValue = (): void => {
      setPosts(results);
      setNextPage(next_page);
    };
    initialValue();
  }, [next_page, results, setNextPage, setPosts]);

  return (
    <div className={styles.containerStyled}>
      <div>
        {posts.map(item => (
          <section key={item.uid}>
            <Link href={`/post/${item.uid}`}>
              <a>
                <h1>{item.data.title}</h1>
                <p>{item.data.subtitle}</p>
                <div className={styles.contentFooterStyled}>
                  <div>
                    <span>
                      <BiCalendarMinus />
                    </span>
                    <time>{item.first_publication_date}</time>
                  </div>
                  <div>
                    <span>
                      <BiUser />
                    </span>
                    <cite>{item.data.author}</cite>
                  </div>
                </div>
              </a>
            </Link>
          </section>
        ))}
        {nextPage && (
          <button
            type="button"
            onClick={handlePaginationPosts}
            className={styles.loadMoreButton}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const { results, next_page } = await prismic.getByType(
    'publication-custom-type',
    {
      pageSize: 1,
    }
  );

  const response: Post[] = await results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: post.data.title.toString() as string,
        author: post.data.author.toString() as string,
        subtitle: post.data.subtitle.toString() as string,
      },
      first_publication_date: convertingDate(post.first_publication_date),
    };
  });
  return {
    props: {
      results: response,
      next_page,
    },
    revalidate: TIME_FOR_REVALIDATE,
  };
};
