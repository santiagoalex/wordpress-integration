/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component, Fragment } from 'react'
import CategoryPosts from './graphql/CategoryPosts.graphql'
import withSettings from './components/withSettings'
import { compose, graphql, DataProps } from 'react-apollo'
import { Spinner, Pagination } from 'vtex.styleguide'
import { Container } from 'vtex.store-components'
import WordpressTeaser from './components/WordpressTeaser'
import Helmet from 'react-helmet'
import styles from './components/list.css'

interface OtherProps {
  appSettings: AppSettings
  params: any
}
interface AppSettings {
  titleTag: string
  blogRoute: string
}
type DataPropsWithParams = DataProps<any, any> & OtherProps

class WordpressCategory extends Component<DataPropsWithParams> {
  state = {
    page: 1,
    per_page: 10,
  }
  render() {
    const {
      appSettings,
      appSettings: { titleTag },
      data: {
        fetchMore,
        loading,
        error,
        wpCategory,
        wpCategory: { name, wpPosts },
      },
    } = this.props
    return (
      <Fragment>
        {wpCategory && name && (
          <Fragment>
            <Helmet>
              <title>{titleTag != '' ? name + ' | ' + titleTag : name}</title>
            </Helmet>
            <h2 className={`${styles.listTitle} t-heading-2 tc`}>{name}</h2>
          </Fragment>
        )}
        <Container className={`${styles.listContainer} pt2 pb8`}>
          <div className="ph3">
            <Pagination
              rowsOptions={[10, 20, 30, 40]}
              currentItemFrom={
                this.state.page * this.state.per_page - this.state.per_page + 1
              }
              currentItemTo={this.state.page * this.state.per_page}
              textOf="of"
              textShowRows="posts per page"
              totalItems={wpPosts != null ? wpPosts.total_count : 0}
              onRowsChange={(event: any) => {
                const firstPage = 1
                const perPage = event.target.value
                this.setState({ per_page: event.target.value, page: 1 })
                fetchMore({
                  variables: {
                    wp_page: firstPage,
                    wp_per_page: perPage,
                    category: this.props.params.categoryid,
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev
                    return fetchMoreResult
                  },
                })
              }}
              onPrevClick={() => {
                if (this.state.page > 1) {
                  const prevPage = this.state.page - 1
                  this.setState({ page: this.state.page - 1 })
                  fetchMore({
                    variables: {
                      wp_page: prevPage,
                      wp_per_page: this.state.per_page,
                      category: this.props.params.categoryid,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev
                      return fetchMoreResult
                    },
                  })
                }
              }}
              onNextClick={() => {
                const nextPage = this.state.page + 1
                this.setState({ page: this.state.page + 1 })
                fetchMore({
                  variables: {
                    wp_page: nextPage,
                    wp_per_page: this.state.per_page,
                    category: this.props.params.categoryid,
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev
                    return fetchMoreResult
                  },
                })
              }}
            />
          </div>
          {loading && (
            <div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
              <Spinner />
            </div>
          )}
          {error && (
            <div className="ph5" style={{ minHeight: 800 }}>
              Error: {error.message}
            </div>
          )}
          {wpPosts != null ? (
            <div className={`${styles.listFlex} mv4 flex flex-row flex-wrap`}>
              {wpPosts.posts.map((post: PostData, index: number) => (
                <div
                  key={index}
                  className={`${styles.listFlexItem} mv3 w-100-s w-50-l ph4`}
                >
                  <WordpressTeaser
                    title={post.title.rendered}
                    author={post.author.name}
                    excerpt={post.excerpt.rendered}
                    date={post.date}
                    id={post.id}
                    image={
                      post.featured_media != null
                        ? post.featured_media.source_url
                        : ''
                    }
                    altText={
                      post.featured_media != null
                        ? post.featured_media.alt_text
                        : ''
                    }
                    mediaType={
                      post.featured_media != null
                        ? post.featured_media.media_type
                        : ''
                    }
                    showAuthor={false}
                    showCategory={false}
                    showDate
                    showExcerpt
                    useTextOverlay={false}
                    settings={appSettings}
                  />
                </div>
              ))}
            </div>
          ) : (
            !loading &&
            !error && (
              <div>
                <h2>No posts found.</h2>
              </div>
            )
          )}
        </Container>
      </Fragment>
    )
  }
}

export default compose(
  withSettings,
  graphql(CategoryPosts, {
    options: (props: DataPropsWithParams) => ({
      variables: { category: props.params.categoryid },
      notifyOnNetworkStatusChange: true,
    }),
  })
)(WordpressCategory)
