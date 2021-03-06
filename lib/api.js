import 'isomorphic-unfetch'

const API_URL = 'https://graphql.datocms.com'
const API_TOKEN = process.env.NEXT_EXAMPLE_CMS_DATOCMS_API_TOKEN

// See: https://www.datocms.com/blog/offer-responsive-progressive-lqip-images-in-2020
const responsiveImageFragment = `
  fragment responsiveImageFragment on ResponsiveImage {
  srcSet
    webpSrcSet
    sizes
    src
    width
    height
    aspectRatio
    alt
    title
    bgColor
    base64
  }
`

async function fetchAPI(query, { variables, preview } = {}) {
  const res = await fetch(API_URL + (preview ? '/preview' : ''), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  return json.data
}

export async function getPreviewProjectBySlug(slug) {
  const data = await fetchAPI(
    `
    query ProjectBySlug($slug: String) {
      project(filter: {slug: {eq: $slug}}) {
        slug
      }
    }`,
    {
      preview: true,
      variables: {
        slug,
      },
    }
  )
  return data?.project
}

export async function getallProjectsWithSlug() {
  const data = fetchAPI(`
    {
      allProjects {
        slug
      }
    }
  `)
  return data?.allProjects
}

export async function getAllProjectsByAuthor(id) {
  const data = fetchAPI(`
    query getProjectsByAuthor($id: ItemId) {
      allProjects(filter: {author: {eq: $id}} , orderBy: date_DESC) {
        id
        date
        title
        slug
        coverImage {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 1000, h: 1000 }) {
            ...responsiveImageFragment
          }
        }
        excerpt
        author {
          slug
          picture {
            url
          }
        }
        tags {
          name
          slug
        }
      }
    }
    ${responsiveImageFragment}
    `,
    {
      variables: {
        id
      }
    }
  )
  return data;
}

export async function getAllProjectsByTag(id) {
  const data = fetchAPI(`
    query getProjectsByTag($id: [ItemId]) {
      allProjects(filter: {tags: {anyIn: $id}}, orderBy: date_DESC) {
        id
        date
        title
        slug
        coverImage {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 1000, h: 1000 }) {
            ...responsiveImageFragment
          }
        }
        excerpt
        author {
          slug
          name
          picture {
            url(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100})
          }
        }
        tags {
          id
          name
          slug
        }
      }
    }
    ${responsiveImageFragment}
    `,
    {
      variables: {
        id
      }
    }
  )
  return data;
}


export async function getAllAuthorsWithSlug() {
  const data = fetchAPI(`
    {
      allAuthors {
        slug
      }
    }
  `)
  return data?.allAuthors
}

export async function getAllTagsWithSlug() {
  const data = fetchAPI(`
    {
      allTags {
        slug
      }
    }
  `)
  return data?.allTags
}



export async function getAllProjectsForHome(preview) {
  const data = await fetchAPI(
    `
    {
      allProjects(orderBy: date_DESC, first: 20) {
        title
        slug
        excerpt
        date
        coverImage {
          responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 1000, h: 1000 }) {
            ...responsiveImageFragment
          }
        }
        author {
          name
          picture {
            url(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100})
          }
          slug
        }
        tags {
          name
          slug
        }
        category {
          name
        }
      }
    }
    ${responsiveImageFragment}
  `,
    { preview }
  )
  return data?.allProjects
}

export async function getAuthors(slug, preview){
  const data = await fetchAPI(
  `
  query AuthorBySlug($slug: String) {
    author(filter: {slug: {eq: $slug}}) {
        id
        name
        picture {
          url(imgixParams: {fm: jpg, fit: crop, w: 500, h: 500, sat: -100})
        }
        artistStatement
        website
        slug
      }
    }
  `,
    {
      preview,
      variables: {
        slug,
      },
    }
  )
  return data
}

export async function getTags(slug, preview){
  const data = await fetchAPI(
  `
  query TagBySlug($slug: String) {
    tag(filter: {slug: {eq: $slug}}) {
        id
        name
        slug
      }
    }
  `,
    {
      preview,
      variables: {
        slug,
      },
    }
  )
  return data
}


export async function getProjectAndMoreProjects(slug, preview) {
  const data = await fetchAPI(
  `
  query ProjectBySlug($slug: String) {
    project(filter: {slug: {eq: $slug}}) {
      title
      slug
      content
      excerpt
      date
      ogImage: coverImage{
        url(imgixParams: {fm: jpg, fit: crop, w: 1200, h: 600 })
      }
      coverImage {
        responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
          ...responsiveImageFragment
        }
      }
      author {
        name
        picture {
          url(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100})
        }
        slug
      }
      collaborators
      labAffiliation {
        name
      }
      tags {
        id
        name
        slug
      }
      videoLink
      externalUrl
      sourceCodeUrl
      medium
      imageGallery {
        id
        responsiveImage(imgixParams: {fm: jpg, fit: clip, h: 900, w: 1200}) {
          ...responsiveImageFragment
        }
      }
    }

    moreProjects: allProjects(orderBy: date_DESC, first: 2, filter: {slug: {neq: $slug}}) {
      title
      slug
      excerpt
      date
      coverImage {
        responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
          ...responsiveImageFragment
        }
      }
      author {
        name
        picture {
          url(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100})
        }
        slug
      }
    }
  }

  ${responsiveImageFragment}
  `,
    {
      preview,
      variables: {
        slug,
      },
    }
  )
  return data
}
