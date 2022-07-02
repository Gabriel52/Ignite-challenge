import { GetStaticProps } from 'next';
import { BiCalendarMinus, BiUser } from 'react-icons/bi';
import Link from 'next/link';

import { LANGUAGE, TIME_FOR_REVALIDATE } from '../contants';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  results,
  next_page,
}: PostPagination): JSX.Element {
  return (
    <div className={styles.containerStyled}>
      <div>
        {results.map(item => (
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
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getAllByType('publication-custom-type');

  const results: Post[] = await postsResponse.map(post => {
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
  return {
    props: {
      results,
    },
    revalidate: TIME_FOR_REVALIDATE,
  };
  // TODO
};
