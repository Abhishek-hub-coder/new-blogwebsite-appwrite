import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (!userData) {
            setPosts([]);
            return;
        }
        appwriteService.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents);
            }
        });
    }, [userData]);

   
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='w-full py-8'>
            <Container>
               
                <div className="relative w-full max-w-md mx-auto mb-6">
                    <span className="absolute left-4 top-3 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search posts by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
                    />
                </div>

                <div className='flex flex-wrap'>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard setPosts={setPosts} {...post} userId={post.userId} />
                            </div>
                        ))
                    ) : (
                        <p className="w-full text-center text-gray-500">No posts found.</p>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
