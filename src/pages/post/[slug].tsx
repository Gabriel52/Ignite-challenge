import { GetServerSideProps } from 'next';
import { RichText } from 'prismic-dom';
import { v4 } from 'uuid';
import { BiCalendarMinus, BiUser } from 'react-icons/bi';
import { FiClock } from 'react-icons/fi';

import { CLIENT_ID, WORDS_FOR_MINUTE } from '../../contants';
import { getPrismicClient } from '../../services/prismic';
import { convertingDate } from '../../utils/convertingDate';

import styles from './post.module.scss';
import { estimatedTimeRead } from '../../utils/estimatedTimeRead';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  readTime: number;
}

export default function Post({ post, readTime }: PostProps): JSX.Element {
  console.log(post);

  return (
    <section className={styles.containerStyled}>
      <div className={styles.contentBannerStyled}>
        <img src={post.data.banner.url} alt={post.data.title} />
      </div>
      <div className={styles.contentStyled}>
        <div>
          <h1>{post.data.title}</h1>
          <div className={styles.headerInformation}>
            <div className={styles.itemsHeader}>
              <span>
                <BiCalendarMinus />
              </span>
              <time>{post.first_publication_date}</time>
            </div>
            <div className={styles.itemsHeader}>
              <span>
                <BiUser />
              </span>
              <time>{post.data.author}</time>
            </div>
            <div className={styles.itemsHeader}>
              <span>
                <FiClock />
              </span>
              <time>{readTime} min</time>
            </div>
          </div>
          <div className={styles.contentText}>
            {post.data.content.map(content => (
              <div key={content.heading}>
                <h1>{content.heading}</h1>
                {content.body.map(({ text }) => (
                  <div key={v4()} dangerouslySetInnerHTML={{ __html: text }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params;
  const client = getPrismicClient({});
  const document = await client.getByUID(CLIENT_ID, String(slug), {});
  const response: Post = {
    first_publication_date: convertingDate(document.first_publication_date),
    data: {
      title: document.data.title,
      banner: {
        url: document.data.banner.url,
      },
      author: document.data.author,
      content: document.data.content,
    },
  };
  const VALUE_INITIAL = 0;

  const readTime = response.data?.content.reduce((acc, content) => {
    const headingTime = estimatedTimeRead(
      acc + content.heading.length / WORDS_FOR_MINUTE
    );
    const bodyTime = content.body.reduce((accBody, contentBody) => {
      return accBody + contentBody.text.length / WORDS_FOR_MINUTE;
    }, VALUE_INITIAL);
    return Math.round(headingTime + bodyTime);
  }, VALUE_INITIAL);
  return {
    props: { post: response, readTime },
  };
};
