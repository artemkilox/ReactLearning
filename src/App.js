import React, {useRef, useState} from 'react';
import Counter from "./Components/Counter";
import './Styles/App.css'
import PostItem from "./Components/PostItem";
import Postlist from "./Components/Postlist";
import MyButton from "./Components/UI/Button/MyButton";
import MyInput from "./Components/UI/Input/MyInput";
import PostForm from "./Components/PostForm";
import MySelector from "./Components/UI/Selector/MySelector";

function App() {

    const [posts, setPosts] = useState(
        [{id: 1, title: '1 JavaScript', body: '2 Description'},
        {id: 2, title: '2 JavaScript', body: '3 Description'},
        {id: 3, title: '3 JavaSasdasdcript', body: '1 Description'}]
    )
    const [selectedSort, setSelectedSort] = useState('')


    const createPost = (newPost) => {
        setPosts([...posts, newPost])
    }

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    const sortPosts = (sort) => {
        setSelectedSort(sort);
        setPosts([...posts].sort((a, b) => a[sort].localeCompare(b[sort])))
    }

    return (
        <div className="App">
            <PostForm create={createPost}/>
            <hr style={{margin: '15px 0'}}/>
            <div>
                <MySelector
                    value={selectedSort}
                    onChange={sortPosts}
                    defaultValue="Сортировка..."
                    options={[
                        {value: 'title', name: 'По названию'},
                        {value: 'body', name: 'По описанию'},
                    ]}
                />
            </div>
            {posts.length !== 0
                ?
                <Postlist remove={removePost} posts={posts} title="Посты про JS"/>
                :
                <h1 style={{textAlign: 'center'}}>
                    Постов пока что нет! =)
                </h1>
            }
        </div>
    );
}

export default App;
