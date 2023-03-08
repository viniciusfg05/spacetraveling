import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';

import { AiOutlineCalendar } from 'react-icons/ai';
import { FiClock, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import { formatDate } from '..';

interface Post {
  uid?: string | null;
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
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="Banner" />
      </div>
      <div className={styles.ConteinerPosts}>
        <main className={styles.ContentMain}>
          <header>
            <h2>{post.data.title}</h2>
            <div className={styles.Infos}>
              <time>
                <AiOutlineCalendar className={styles.icons} />
                {formatDate(post.first_publication_date)}
              </time>
              <cite>
                <FiUser className={styles.icons} />
                {post.data.author}
              </cite>
              <p>
                <FiClock className={styles.icons} /> 4 min
              </p>
            </div>
          </header>

          <section>
            {post.data.content.map(results => (
              <div key={results.heading} className={styles.contentSection}>
                <article>{results.heading}</article>
                <div
                  className={styles.body}
                  /*eslint-disable */
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(results.body),
                  }}
                />
              </div>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {
    lang: 'pt-BR',
  });

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient({});
  const { slug } = context.params;
  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: { post: response },
    revalidate: 10 * 60 * 24,
  };
};
