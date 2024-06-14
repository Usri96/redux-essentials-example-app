import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { fetchPosts, selectAllPosts } from './postsSlice'
import {Spinner} from "../../components/Spinner"

const PostExcerpt = ({post}) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
      <ReactionButtons post={post} />
    </article>
  )
}

export const PostsList = () => {
  const posts = useSelector(selectAllPosts)

  const dispatch = useDispatch()

  const postStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if(postStatus === "idle") {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content

  if (postStatus === "loading") {
    content = <Spinner />
  } else if (postStatus === "succeded") {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map(post => (
      <PostExcerpt post={post} key={post.id} />
    ))  
  }
  else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }
   return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}