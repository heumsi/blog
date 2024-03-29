module.exports = {
  pathPrefix: `/blog`,
  siteMetadata: {
    title: "하나씩. 점을. 찍어나가며.",
    author: 'Heumsi',
    description: '소프트웨어 엔지니어 흠시의 블로그 입니다.',
    siteUrl: `https://heumsi.github.io/blog`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-plausible`,
      options: {
        domain: `heumsi.github.io/blog`,
      },
    },
    {
      resolve: 'gatsby-plugin-next-seo',
      options: {
        title: "하나씩. 점을. 찍어나가며.",
        language: "ko",
        description: "소프트웨어 엔지니어 흠시의 블로그 입니다.",
        canonical: "https://heumsi.github.io/blog",
        openGraph: {
          url: 'https://heumsi.github.io/blog',
          type: 'website',
          title: '하나씩. 점을. 찍어나가며.',
          description: "소프트웨어 엔지니어 흠시의 블로그 입니다.",
          site_name: '하나씩. 점을. 찍어나가며.',
        },
        twitter: {
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        },
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [
          `/dev-404-page`,
          `/404`,
          `/404.html`,
          `/logs/`,
        ],
        createLinkInHead: true,
        resolveSiteUrl: (data) => data.site.siteMetadata.siteUrl,
      }
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `heumsi-github-io`
      }
    },
    {
      // ref: https://dantechblog.gatsbyjs.io/posts/google-search-console/
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            title: '하나씩 점을 찍어나가며 - Heumsi의 블로그 RSS',
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + `/posts/${edge.node.slug}`,
                  guid: site.siteMetadata.siteUrl + `/posts/${edge.node.slug}`,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                });
              });
            },
            query: `
              {
                allMdx(
                  filter: {fields: {source: {eq: "posts"}}},
                  sort: { fields: [frontmatter___date], order: DESC }
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      slug
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: `G-ZRH97WV1XY`,
        head: true,
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://heumsi.github.io/blog',
        sitemap: 'https://heumsi.github.io/blog/sitemap/sitemap-index.xml',
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `logs`,
        path: `${__dirname}/content/logs`,
      }
    },
    `gatsby-plugin-mdx-source-name`,
    {
      resolve: `gatsby-plugin-mdx`,
      plugins: [
        `gatsby-remark-images`,
        `gatsby-remark-images-medium-zoom`
      ],
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          'gatsby-remark-mermaid',
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (e.g. <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (e.g. for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: "language-",
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: null,
              // This lets you set up language aliases.  For example,
              // setting this to '{ sh: "bash" }' will let you use
              // the language "sh" which will highlight using the
              // bash highlighter.
              aliases: {},
              // This toggles the display of line numbers globally alongside the code.
              // To use it, add the following line in gatsby-browser.js
              // right after importing the prism color scheme:
              //  require("prismjs/plugins/line-numbers/prism-line-numbers.css")
              // Defaults to false.
              // If you wish to only show line numbers on certain code blocks,
              // leave false and use the {numberLines: true} syntax below
              showLineNumbers: false,
              // If setting this to true, the parser won't handle and highlight inline
              // code used in markdown i.e. single backtick code like `this`.
              noInlineHighlight: false,
              // This adds a new language definition to Prism or extend an already
              // existing language definition. More details on this option can be
              // found under the header "Add new language definition or extend an
              // existing language" below.
              languageExtensions: [
                {
                  language: "superscript",
                  extend: "javascript",
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              // Customize the prompt used in shell output
              // Values below are default
              prompt: {
                user: "root",
                host: "localhost",
                global: false,
              },
              // By default the HTML entities <>&'" are escaped.
              // Add additional HTML escapes by providing a mapping
              // of HTML entities and their escape value IE: { '}': '&#123;' }
              escapeEntities: {},
            },
          },
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              linkImagesToOriginal: false // Important!
            }
          },
          `gatsby-remark-images-medium-zoom`, // Important!
        ],
      },
    },
  ],
}
