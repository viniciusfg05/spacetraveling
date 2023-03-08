import { GetStaticProps } from 'next';
import { useState } from 'react';

import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar } from 'react-icons/ai';

import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './home.module.scss';
import { getPrismicClient } from '../services/prismic';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export function formatDate(date: string): string {
  const formattedDate = format(new Date(date), 'dd  MMM yyyy', {
    locale: ptBR,
  });
  return formattedDate;
}

export default function Home({ postsPagination }: HomeProps) {
  const router = useRouter();

  const { next_page, results } = postsPagination;
  const [posts, setPosts] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState(next_page);

  async function handleNextPage(): Promise<void> {
    const response = await (await fetch(nextPage)).json();
    setNextPage(response.next_page);
    setPosts([...posts, ...response.results]);
  }

  if (router.isFallback) {
    // eslint-disable-next-line $rulename
    return <p>Carregando...</p>;
  }

  // eslint-disable-next-line $rulename
  return (
    <div className={styles.containerHome}>
      {posts.map(post => (
        <Link key={post.uid} href={`/post/${post.uid}`}>
          <div className={styles.contentHome}>
            <strong>{post.data.title}</strong>
            <p>{post.data.subtitle}</p>
            <div className={styles.info}>
              <time>
                <AiOutlineCalendar className={styles.infoCalender} />
                {formatDate(post.first_publication_date)}
              </time>
              <cite>
                <FiUser className={styles.infoUser} /> {post.data.author}
              </cite>
            </div>
            <div className={styles.divide} />
          </div>
        </Link>
      ))}

      {nextPage && (
        <button onClick={handleNextPage}>Carregar mais posts</button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const posts = await prismic.getByType('posts', {
    lang: 'pt-BR',
  });
  // eslint-disable-next-line $rulename

  const mapPostsResults = posts.results.map(resultPostPrismic => {
  // eslint-disable-next-line $rulename

    return {
  // eslint-disable-next-line $rulename

      uid: resultPostPrismic.uid,
      first_publication_date: resultPostPrismic.first_publication_date,
      data: {
        title: resultPostPrismic.data.title,
        subtitle: resultPostPrismic.data.subtitle,
        author: resultPostPrismic.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: posts.next_page,
    results: mapPostsResults,
  };

  return {
  // eslint-disable-next-line $rulename

    props: {
  // eslint-disable-next-line $rulename

      postsPagination,
    },
  };
};
