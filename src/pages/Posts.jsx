import React, {useEffect, useRef, useState} from 'react';
import {usePosts} from "../hooks/usePosts";
import {useFetching} from "../hooks/useFetching";
import PostService from "../API/PostService";
import {getPageCount} from "../utils/pages";
import MyButton from "../Components/UI/Button/MyButton";
import MyModal from "../Components/UI/MyModal/MyModal";
import PostFilter from "../Components/PostFilter";
import PostList from "../Components/Postlist";
import Pagination from "../Components/UI/Pagination/Pagination";
import Loader from "../Components/UI/Loader/Loader";
import PostForm from "../Components/PostForm";
import {useObserver} from "../hooks/UseObserver";
import MySelector from "../Components/UI/Selector/MySelector";


function Posts() {

    const [posts, setPosts] = useState([])
    const [filter, setFilter] = useState({sort: '', query: ''})
    const [modal, setModal] = useState(false)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
    const lastElement = useRef()


    const [fetchPosts, isPostsLoading, postsError] = useFetching(async (limit, page) => {
        const response = await PostService.getAll(limit, page)
        setPosts([...posts, ...response.data])
        const totalCount = response.headers['x-total-count']
        setTotalPages(getPageCount(totalCount, limit))
    })

    useObserver(lastElement, page < totalPages, isPostsLoading, () => {
        setPage(page + 1)
    })

    useEffect(() => {
        fetchPosts(limit, page)
    }, [page, limit])

    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    const changePage = (page) => {
        setPage(page)
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
            <MySelector
                value={limit}
                onChange={value => setLimit(value)}
                defaultValue={"Кол-во элементов на странице"}
                options={[
                    {value: 5, name: '5'},
                    {value: 10, name: '10'},
                    {value: 15, name: '15'},
                    {value: 20, name: '20'},
                    {value: 25, name: '25'},
                    {value: -1, name: 'Показать все'}
                ]}
            />
            {postsError &&
            <h1>Произошла ошибка {postsError}</h1>
            }
            <Pagination
                page={page}
                changePage={changePage}
                totalPages={totalPages}
            />

            <PostList remove={removePost} posts={sortedAndSearchedPosts} title="Посты про JS"/>

            <div ref={lastElement} style={{height: 20, background: 'red'}}> </div>

            {isPostsLoading &&
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}><Loader/></div>
            }
            <Pagination
                page={page}
                changePage={changePage}
                totalPages={totalPages}
            />
        </div>
    );
}

export default Posts;
