const path = require("path")

exports.createPages = async ({actions, graphql, reporter}) => {
  const {createPage} = actions;
  const query = await graphql(`
    {
      posts: allMdx(filter: {fields: {source: {eq: "posts"}}}) {
        nodes {
          id
          frontmatter {
            subTitle
            title
            date(formatString: "YYYY년 M월 D일")
            tags
          }
          body
          slug
        }
      }
      site {
        siteMetadata {
          siteUrl
        }
      }
      logs: allMdx(filter: {fields: {source: {eq: "logs"}}}) {
        nodes {
          frontmatter {
            title
            datetime(formatString: "YYYY년 M월 D일")
          }
          body
          slug
        }
      }
    }
  `);
  if (query.errors) {
    reporter.panicOnBuild(`Error`);
    return;
  }
  query.data.posts.nodes.forEach(node => {
    createPage({
      path: `/posts/${node.slug}`,
      component: path.resolve("./src/components/templates/post.js"),
      context: {
        url: query.data.site.siteMetadata.siteUrl + "/posts/" + node.slug,
        id: node.id,
        title: node.frontmatter.title,
        subTitle: node.frontmatter.subTitle,
        date: node.frontmatter.date,
        tags: node.frontmatter.tags,
        content: node.body,
      },
    })
  });

  query.data.logs.nodes.forEach(node => {
    createPage({
      path: `/logs/${node.slug}`,
      component: path.resolve("./src/components/templates/log.js"),
      context: {
        url: query.data.site.siteMetadata.siteUrl + "/logs/" + node.slug,
        title: node.frontmatter.title,
        datetime: node.frontmatter.datetime,
        content: node.body,
      },
    })
  });
};