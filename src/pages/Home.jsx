import React, { useEffect, useState } from 'react';
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components';
import { useSelector } from "react-redux";

function Home() {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (!userData) {
            setPosts([]);
            return;
        }
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents);
            }
        });
    }, [userData]);

   
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className='w-full py-8'>
            <Container>
               
                <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                    You can read specific posts from all available posts using the search filter below.
                </h2>

             
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="🔍 Search posts by title..."
                        className="w-full md:w-2/3 lg:w-1/2 px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className='flex flex-wrap'>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div key={post.$id} className='p-2 w-full sm:w-1/2 lg:w-1/4'>
                                <PostCard {...post} userId={post.userId} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center text-gray-500">
                            No posts found.
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default Home;
