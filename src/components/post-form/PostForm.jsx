import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [previewImage, setPreviewImage] = useState(post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : null);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null); // Store file object

    // Slug generation function
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/-+/g, "-"); // Remove multiple hyphens
    };

    // Automatically update slug when title changes
    useEffect(() => {
        const title = watch("title");
        if (title) {
            setValue("slug", generateSlug(title), { shouldValidate: true });
        }
    }, [watch("title"), setValue]);

    const submit = async (data) => {
        if (!userData || !userData.$id) {
            console.error("User data is missing. Ensure the user is logged in.");
            return;
        }

        let fileId = null;

        // Upload new file only if a new file is selected
        if (selectedFile) {
            const fileUpload = await appwriteService.uploadFile(selectedFile);
            if (!fileUpload) {
                console.error("File upload failed.");
                return;
            }
            fileId = fileUpload.$id;
        }

        if (post) {
            if (fileId) {
                appwriteService.deleteFile(post.featuredImage);
            }
            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: fileId || post.featuredImage, // Use new file if available, otherwise keep the old one
            });
            if (dbPost) {
                navigate(`/all-posts`);
            }
        } else {
            if (!fileId) {
                console.error("No image selected.");
                return;
            }
            data.featuredImage = fileId;
            const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

            if (dbPost) {
                navigate(`/post/${dbPost.slug}`);
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // Store file object
            setSelectedFileName(file.name);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setSelectedFileName("");
            setPreviewImage(null);
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    readOnly // Make slug read-only since it's auto-generated
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <label className="block text-gray-700 font-semibold mb-2">Featured Image:</label>
                <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    onChange={handleImageChange} // Handle file selection
                    className="hidden"
                    id="fileInput"
                />
                <label htmlFor="fileInput" className="cursor-pointer flex items-center gap-2 border px-4 py-2 rounded-md bg-gray-100">
                    📂 {selectedFileName || "Click to upload an image"}
                </label>
                {previewImage && (
                    <img src={previewImage} alt="Selected preview" className="rounded-lg mt-2 w-full object-cover h-32" />
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}