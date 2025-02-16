import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UploadCloud } from "lucide-react"; // Importing icon for file upload

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

    const submit = async (data) => {
        if (!userData || !userData.$id) {
            console.error("User data is missing. Ensure the user is logged in.");
            return;
        }

        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }
            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });
            if (dbPost) {
                navigate(`/all-posts`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);
            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                if (dbPost) {
                    navigate(`/post/${dbPost.slug}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-col md:flex-row gap-6 p-6 bg-white shadow-lg rounded-lg">

            <div className="w-full md:w-2/3 space-y-4">
                <Input
                    label="Title"
                    placeholder="Enter blog title..."
                    className="w-full"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug"
                    placeholder="Generated slug..."
                    className="w-full"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content" name="content" control={control} defaultValue={getValues("content")} />
            </div>


            <div className="w-full md:w-1/3 space-y-4">

                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:border-blue-400 transition">
                    <UploadCloud className="text-gray-400 w-12 h-12 mb-2" />
                    <label className="text-sm text-gray-600">Upload Featured Image</label>
                    <input
                        type="file"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...register("image", { required: !post })}
                    />
                </div>


                {post && post.featuredImage && (
                    <div className="w-full rounded-lg overflow-hidden shadow-md">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="object-cover w-full h-48 rounded-lg"
                        />
                    </div>
                )}


                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="w-full"
                    {...register("status", { required: true })}
                />


                <Button type="submit" bgColor={post ? "bg-green-500" : "bg-blue-500"} className="w-full py-3 rounded-lg text-lg">
                    {post ? "Update Blog" : "Publish Blog"}
                </Button>
            </div>
        </form>
    );
}
