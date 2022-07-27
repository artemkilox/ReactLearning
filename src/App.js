import React, {useEffect, useMemo, useRef, useState} from 'react';
import Counter from "./Components/Counter";
import './Styles/App.css'
import PostItem from "./Components/PostItem";
import PostList from "./Components/Postlist";
import MyButton from "./Components/UI/Button/MyButton";
import MyInput from "./Components/UI/Input/MyInput";
import PostForm from "./Components/PostForm";
import MySelector from "./Components/UI/Selector/MySelector";
import PostFilter from "./Components/PostFilter";
import MyModal from "./Components/UI/MyModal/MyModal";
import {usePosts} from "./hooks/usePosts";
import axios from "axios";
import PostService from "./API/PostService";
import Loader from "./Components/UI/Loader/Loader";
import {useFetching} from "./hooks/useFetching";
import {getPageCount} from "./utils/pages";

function App() {

    // {id: 1, title: '1 JavaScript', body: '2 Description'},
    // {id: 2, title: '2 JavaScript', body: '3 Description'},
    // {id: 3, title: '3 JavaSasdasdcript', body: '1 Description'}

    const [posts, setPosts] = useState([])
    const [filter, setFilter] = useState({sort: '', query: ''})
    const [modal, setModal] = useState(false)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)

    // let pagesArray = []
    // for (let i = 0; i < totalPages; i++) {
    //
    // }

    const [fetchPosts, isPostsLoading, postsError] = useFetching(async () => {
        const response = await PostService.getAll(limit, page)
        setPosts(response.data)
        const totalCount = response.headers['x-total-count']
        setTotalPages(getPageCount(totalCount, limit))
    })

    useEffect(() => {
        fetchPosts()
    }, [])

    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    return (
        <div className="App">
            <MyButton  onClick={fetchPosts}>
                GET DATA
            </MyButton>
            <MyButton style={{marginTop: '30px'}} onClick={() => setModal(true)}>
                Создать пост
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>
            <hr style={{margin: '15px 0'}}/>
            <PostFilter
                filter={filter}
                setFilter={setFilter}
            />
            {postsError &&
                <h1>Произошла ошибка {postsError}</h1>
            }
            {isPostsLoading
                ? <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}><Loader/></div>
                : <PostList remove={removePost} posts={sortedAndSearchedPosts} title="Посты про JS"/>
            }
        </div>
    );
}

export default App;
