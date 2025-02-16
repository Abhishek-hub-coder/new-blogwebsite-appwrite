



import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // Create a new post
    async createPost({ title, content, featuredImage, status, userId }) {
        try {
            const slug = title.toLowerCase().replace(/\s+/g, "-");
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                { title, slug, content, featuredimage: featuredImage, status, userId }
            );
            console.log("Post Created:", response);
            return response;
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", error);
        }
    }


    // Update an existing post
    async updatePost(postId, { title, content, featuredImage, status, userId }) {
        try {
            const slug = title.toLowerCase().replace(/\s+/g, "-");
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId, // Use unique ID, not slug
                {
                    title,
                    content,
                    featuredimage: featuredImage, // Ensure field name consistency
                    status,
                    slug,
                    userId
                }
            );
        } catch (error) {
            console.error("Appwrite service :: updatePost :: error", error);
        }
    }

    // Delete a post (Only creator can delete)
    async deletePost(postId) {
        console.log(postId)
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId
            );
            return true;
        } catch (error) {
            console.error("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    // Fetch a post by document ID
    async getPostById(postId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                postId
            );
        } catch (error) {
            console.error("Appwrite service :: getPostById :: error", error);
            return null;
        }
    }

    // Fetch a post by slug
    async getPost(slug) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("slug", slug)] // Query using slug
            );

            if (response.documents.length > 0) {
                return response.documents[0]; // Return first matching post
            }

            return null;
        } catch (error) {
            console.error("Appwrite service :: getPostBySlug :: error", error);
            return null;
        }
    }

    // Fetch all active posts
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.error("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    // Upload a file to storage
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.error("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    // Delete a file from storage
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.error("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    // Get file preview URL
    getFilePreview(fileId) {
        return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
    }

    async getPostBySlug(slug) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("slug", slug)] // Search by slug
            );

            if (response.documents.length > 0) {
                return response.documents[0]; // Return first matching post
            }

            return null;
        } catch (error) {
            console.error("Appwrite service :: getPostBySlug :: error", error);
            return null;
        }
    }



}

const service = new Service();
export default service;
