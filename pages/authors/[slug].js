import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import Header from '../../components/header'
import Footer from '../../components/footer'
import ProjectHeader from '../../components/project-header'
import Layout from '../../components/layout'
import { getAllAuthorsWithSlug, getAuthors, getAllProjectsByAuthor } from '../../lib/api'
import AuthorName from '../../components/author-name'
import ProjectTitle from '../../components/project-title'
import Head from 'next/head'
import Intro from '../../components/intro'
import Avatar from '../../components/avatar'
import Loading from '../../components/loading'
import AuthorPicture from '../../components/author-picture'
import ArtistProjects from '../../components/artist-projects'
import { CMS_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import markdownStyles from '../../components/markdown-styles.module.css'
import { ParallaxProvider } from 'react-scroll-parallax';

export default function Author({ author, projects, preview}) {

  const router = useRouter()
  if (!router.isFallback && !author?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <ParallaxProvider>
    <Layout preview={preview}>
      <Container>
        {router.isFallback ? (
          <Loading>loading…</Loading>
        ) : (
          <>
          <Intro />
            <article>
          <Head>
            <title>
              {author.name} | bricolage
            </title>
          </Head>
          <AuthorName name={author.name}/>
          <div className="grid grid-cols-1 md:grid-cols-3 mb-20">
          <div className="md:col-start-1 md:col-end-2 z-10 mr-6">
            <div className="max-w-2xl mx-auto">
                <div className="hidden md:block">
                  <AuthorPicture name={author.name} picture={author.picture} />
                </div>


                <div className="block md:hidden mb-6 text-blue">
                  <Avatar name={author.name}  picture={author.picture} slug={author.slug}/>
                </div>

              </div>
          </div>

              <div className="md:col-start-2 md:col-end-4 z-10 shadow-xl py-6">
                <div
                    className={markdownStyles['markdown']}
                    dangerouslySetInnerHTML={{ __html: author.artistStatement }}
                  />
                <div className="m-6 text-purple text-lg"> <a className="hover:underline" href={author.website}> {author.website} </a></div>
              </div>
          </div>
          </article>
          { projects.length > 0 && <ArtistProjects projects={projects} /> }
          <Footer/>
          </>
        )}
      </Container>
    </Layout>
    </ParallaxProvider>
  )
}

export async function getStaticProps({ params, preview }) {
  const data = await getAuthors(params.slug, preview)
  const authorProjects = await getAllProjectsByAuthor(data?.author?.id)

  return {
    props: {
      author: data?.author,
      projects: authorProjects?.allProjects,
      preview: preview || null
    },
  }
}

export async function getStaticPaths() {
  const allAuthors = await getAllAuthorsWithSlug()
  return {
    paths: allAuthors?.map(author => `/authors/${author.slug}`) || [],
    fallback: true,
  }
}
