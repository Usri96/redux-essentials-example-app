import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import {
  selectAllPosts,
  fetchPosts,
  selectPostIds,
  selectPostById
} from './postsSlice'
import {Spinner} from "../../components/Spinner"

const PostExcerpt = ({postId}) => {
  const post = useSelector(state => selectPostById(state, postId))
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
  const orderedPostIds = useSelector(selectPostIds)

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

    content = orderedPostIds.map(postId => (
      <PostExcerpt postId={postId} key={postId} />
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