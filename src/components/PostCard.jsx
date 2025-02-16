import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";
import { Button } from "../components";

function PostCard({ $id, title, featuredimage, userId, slug, setPosts }) {
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = userData ? userId === userData.$id : false;

    return (
        <div className="w-full bg-gray-100 rounded-xl p-4 relative">
            <Link to={`/post/${slug}`}>
                <div className="w-full justify-center mb-4">
                    <img src={appwriteService.getFilePreview(featuredimage)} alt={title} className="rounded-xl" />
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
            </Link>

            {isAuthor && (
                <div className="absolute top-2 right-2 flex">
                    <Link to={`/edit-post/${slug}`}>
                        <Button bgColor="bg-green-500" className="mr-2">Edit</Button>
                    </Link>
                    <Button bgColor="bg-red-500" onClick={async () => {
                        appwriteService.deletePost($id)
                        appwriteService.getPosts([]).then((posts) => {
                            if (posts) {
                                setPosts(posts.documents)
                            }
                        })
                    }}>
                        Delete
                    </Button>
                </div>
            )}
        </div>
    );
}

export default PostCard;
