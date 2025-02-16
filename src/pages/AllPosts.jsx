import React, { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
function AllPosts() {
    const [posts, setPosts] = useState([])
    const userData = useSelector((state) => state.auth.userData);
    useEffect(() => {
        if (!userData) {
            setPosts([])
            return;
        }
        appwriteService.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [userData])
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts?.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard setPosts={setPosts} {...post} userId={post.userId} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts