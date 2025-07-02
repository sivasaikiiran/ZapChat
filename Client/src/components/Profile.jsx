import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Input } from "./index.js"
import { useForm } from 'react-hook-form'
import authService from '../Services/AuthService.js'
import { toast } from 'react-toastify'
import { login } from '../store/slices/userSlice.js'
import { useDispatch } from 'react-redux'

const Profile = () => {
    const user = useSelector((state) => state.user.userInfo);
    const inputFileRef = useRef();
    const currentImageSrcRef = useRef(user.imageUrl);
    const [file, setFile] = useState(null);
    const [hover, setHover] = useState(false);
    const dispatch = useDispatch();
    const [updating, setUpdating] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: user.email || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            imageUrl: user.imageUrl || "",
        }
    });
    const handleFileChange = (event) => {
        const newFile = event.target.files[0];
        if (newFile) {
            setFile(newFile)
            currentImageSrcRef.current = URL.createObjectURL(newFile);
        }
    }

    const submitHandler = async (data) => {
        try {
            setUpdating(true);

            const uploadFile = async () => {
                if (!file) return;
                const imageForm = new FormData();
                imageForm.append('imageFile', file);
                const imageUploadResult = await authService.uploadImage(imageForm);
                if (imageUploadResult.data) {
                    const { data: { imageDetails: { secure_url, public_id } } } = imageUploadResult;
                    currentImageSrcRef.current = secure_url;
                }
                else {
                    toast.error("Could Not Update Image ! Try again later");
                    return;
                }
            }
            await uploadFile();
            const result = await authService.updateProfile({
                ...data, imageUrl: currentImageSrcRef.current
            });
            setUpdating(false);
            if (!result.data) {
                // error
                const { response: { data: { message } } } = result;
                toast.error(message);
            }
            else {
                // success
                const { data: { message, userDetails } } = result;
                toast.success(message);
                dispatch(login(userDetails));
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='min-h-screen w-screen bg-[#2F3645] flex justify-center items-center'>
            <div
                className='bg-[#B3C8CF] p-4 rounded-md shadow-slate-900 shadow-2xl
                flex flex-col md:flex-row'
            >
                <section className='imageSection bg-[#C5705D] p-4 flex justify-center items-center'>
                    <img src={hover ? "../../public/add-icon-free-vector.jpg" : currentImageSrcRef.current}
                        alt="profileImage"
                        className='shadow-[#821131] shadow-2xl object-cover md:h-[150px] md:w-[150px] m-4'
                        style={{
                            borderRadius: "50%",
                        }}
                        onClick={() => {
                            inputFileRef.current.click();
                        }}
                        onMouseEnter={() => { setHover(true) }}
                        onMouseLeave={() => { setHover(false) }}
                    />
                    <input type="file"
                        name="profileImageInput"
                        id="profileImageInput"
                        ref={inputFileRef}
                        onChange={handleFileChange}
                        hidden
                    />
                </section>
                <section className='infoSection bg-[#F9E897] p-4'>
                    <form action="" onSubmit={handleSubmit(submitHandler)}>
                        <Input
                            {...register("email", {
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format"
                                },
                                required: {
                                    value: true,
                                    message: "Enter Email to continue!"
                                }
                            })}
                            type='email'
                            placeholder='Enter your email'
                            label='Enter email :'
                            className="border-none outline-none p-3 rounded-md bg-slate-800 text-white"
                        />
                        <p className='text-red-500 font-bold'>{errors.email?.message}</p>
                        <Input
                            {...register("firstName", {
                                required: {
                                    value: true,
                                    message: "FirstName is required !",
                                }
                            })}
                            type='text'
                            placeholder='Enter your FirstName'
                            label='Enter FirstName:'
                            className="border-none outline-none p-3 rounded-md bg-slate-800 text-white"
                        />
                        <p className='text-red-500 font-bold'>{errors.firstName?.message}</p>
                        <Input
                            {...register("lastName", {
                                required: {
                                    value: true,
                                    message: "LastName is required !",
                                }
                            })}
                            type='text'
                            placeholder='Enter your LastName'
                            label='Enter LastName:'
                            className="border-none outline-none p-3 rounded-md bg-slate-800 text-white"
                        />
                        <p className='text-red-500 font-bold'>{errors.lastName?.message}</p>
                        <div className='text-center mt-1'>
                            <button type='submit'
                                className='bg-red-500 py-1 px-4 text-white font-bold text-2xl
                            rounded-md hover:bg-red-600 duration-75'
                                disabled={updating}
                            >
                                {updating ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    )
}

export default Profile
