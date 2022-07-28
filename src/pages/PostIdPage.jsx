import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom'
import {useFetching} from "../hooks/useFetching";
import PostService from "../API/PostService";
import Loader from "../Components/UI/Loader/Loader";


const PostIdPage = () => {
    const params = useParams()
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const [fetchPostByID, isLoading, error] = useFetching(async (id) => {
        const response = await PostService.getByID(id)
        setPost(response.data)
    })

    const [fetchComments, isComLoading, comError] = useFetching(async (id) => {
        const response = await PostService.getCommentsByPostId(id)
        setComments(response.data)
    })

    useEffect(() => {
        fetchPostByID(params.id)
        fetchComments(params.id)

    }, [])

    return (
        <div>
            <h1>Вы открыли страницу поста c ID = {params.id}</h1>
            {isLoading
                ? <div style={{display: 'flex', justifyContent: 'center'}}><Loader/></div>
                : <div>{post.id}. {post.title}</div>
            }
            <h1>Комментарии к посту</h1>
            {isComLoading
                ? <div style={{display: 'flex', justifyContent: 'center'}}><Loader/></div>
                : <div>
                    {comments.map(comm =>
                        <div key={comm.email} style={{marginTop: 15}}>
                            <h5>{comm.email}</h5>
                            <div>{comm.body}</div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
};

export default PostIdPage;