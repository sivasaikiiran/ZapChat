import React, { useEffect } from 'react'
import { useState } from 'react';
import { Input } from "./index.js"
import { useForm } from 'react-hook-form';
import authService from '../Services/AuthService.js';
import { toast } from 'react-toastify';
import { login } from '../store/slices/userSlice.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TailSpin, Comment, Discuss } from 'react-loader-spinner';



const Auth = () => {
    const [bgLink, setBglink] = useState("https://w0.peakpx.com/wallpaper/30/145/HD-wallpaper-polygonal-abstract-red-dark-background-abstract-dark-red-deviantart.jpg")
    const [authState, setAuthState] = useState("login");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [wait, setWait] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            login: {
                email: "",
                password: "",
            },
            signup: {
                email: "",
                password: "",
                firstName: "",
                lastName: "",
            }
        }
    })

    const handleLogin = async (data) => {
        try {
            setWait(true);
            const result = await authService.login(data.login);
            setWait(false)
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
                navigate('/');
            }
        } catch (error) {
            setWait(false)
            console.log(error)
            toast.error("Internal Server Error ! Try again later !");
        }
    };

    const handleSignUp = async (data) => {
        console.log("SignUp data : ", data.signup)
        try {
            setWait(true)
            const result = await authService.signUp(data.signup);
            setWait(false)

            if (!result.data) {
                // error
                const { response: { data: { message } } } = result;
                toast.error(message);
            }
            else {
                // success
                const { data: { message } } = result;
                toast.success(message);
                setAuthState("login");
            }
        } catch (error) {
            setWait(false)
            console.log(error)
            toast.error("Internal Server Error ! Try again later !");
        }
    }

    const handleAuthState = () => {
        (authState == "login") ? setAuthState("signup") : setAuthState("login");
    }

    // reset form values when state changes from login to signup or vice-versa
    useEffect(() => {
        reset({
            login: {
                email: "",
                password: "",
            },
            signup: {
                email: "",
                password: "",
                firstName: "",
                lastName: "",
            }
        })
    }, [authState])

    return (
        <div className={`flex justify-center items-center min-h-screen relative font-raleway`}>
            <img src={bgLink} alt="Background Image" className='absolute min-h-screen w-screen object-fit' />
            <div className=' formContainer text-black bg-[#EEF7FF] backdrop-blur-md p-2 rounded-md max-w-96
            m-2'>
                <div className=''>
                    <h1 className='text-4xl text-center p-2 font-bold'>Welcome To ZapChat</h1>
                    <div
                        className=' flex md:flex-row flex-col justify-around items-center text-2xl mt-2 gap-7 p-2'
                    >
                        <h1 className={`px-2 cursor-pointer hover:font-semibold ${authState == "login" && "border-b-4 border-red-600"}
                    `} onClick={handleAuthState}>Login</h1>
                        <h1 className={`px-2 cursor-pointer hover:font-semibold ${authState == "signup" && "border-b-4 border-red-600"}`} onClick={handleAuthState}>SignUp</h1>
                    </div>
                </div>
                <form action="" onSubmit={(authState == "login") ? handleSubmit(handleLogin) : handleSubmit(handleSignUp)}>
                    {authState === "login" &&
                        <>
                            <Input
                                {...register("login.email", {
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
                            <p className='text-red-500 font-bold'>{errors.login?.email?.message}</p>
                            <div>
                                <div className='flex flex-col'>
                                    <Input
                                        {...register("login.password", {
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                                message: "Incorrect Password Format ! Password should be atleast 6 characters long with  atleast one lowerCase letter, one upperCase letter, one digit and a special character"
                                            },
                                            required: {
                                                value: true,
                                                message: "Enter password to continue!"
                                            }
                                        })}
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder='Enter password to continue'
                                        label='Enter password !'
                                        className="border-none outline-none p-3 rounded-md bg-slate-800 text-white"
                                    />
                                    <button type='button'
                                        className='self-end px-2 font-bold text-md hover:bg-slate-600 rounded-md py-2 hover:text-white duration-200'
                                        onClick={() => {
                                            return setPasswordVisible((prev) => prev === true ? false : true)
                                        }}
                                    >
                                        {passwordVisible ? "Hide Password !" : "Show Password !"}
                                    </button>
                                    <p className='text-red-500 font-bold'>{errors.login?.password?.message}</p>
                                </div>
                                <div className='text-center mt-1'>
                                    <button type='submit' className={`py-1 px-4 ${!wait && "bg-red-500 hover:bg-red-600"} text-white font-bold text-2xl rounded-md duration-75 disabled:cursor-not-allowed`}
                                        disabled={wait}
                                    >
                                        {wait ? <Discuss
                                            height={"60"}
                                            color='#ff727d'
                                        /> : "Submit"}
                                    </button>
                                </div>
                            </div>
                        </>
                    }

                    {authState === "signup" &&
                        <>
                            <Input
                                {...register("signup.firstName", {
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
                            <p className='text-red-500 font-bold'>{errors.signup?.firstName?.message}</p>
                            <Input
                                {...register("signup.lastName", {
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
                            <p className='text-red-500 font-bold'>{errors.signup?.lastName?.message}</p>
                            <Input
                                {...register("signup.email", {
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
                            <p className='text-red-500 font-bold'>{errors.signup?.email?.message}</p>
                            <div>
                                <div className='flex flex-col'>
                                    <Input
                                        {...register("signup.password", {
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                                message: "Incorrect Password Format ! Password should be atleast 6 characters long with  atleast one lowerCase letter, one upperCase letter, one digit and a special character"
                                            },
                                            required: {
                                                value: true,
                                                message: "Enter password to continue!"
                                            }
                                        })}
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder='Enter password to continue'
                                        label='Enter password !'
                                        className="border-none outline-none p-3 rounded-md bg-slate-800 text-white"
                                    />
                                    <button type='button'
                                        className='self-end px-2 font-bold text-md hover:bg-slate-600 rounded-md py-2 hover:text-white duration-200'
                                        onClick={() => {
                                            return setPasswordVisible((prev) => prev === true ? false : true)
                                        }}
                                    >
                                        {passwordVisible ? "Hide Password !" : "Show Password !"}
                                    </button>
                                    <p className='text-red-500 font-bold'>{errors.signup?.password?.message}</p>
                                </div>
                            </div>
                            <div className='text-center mt-1'>
                                    <button type='submit' className={`py-1 px-4 ${!wait && "bg-red-500 hover:bg-red-600"} text-white font-bold text-2xl rounded-md duration-75 disabled:cursor-not-allowed`}
                                        disabled={wait}
                                    >
                                        {wait ? <Discuss
                                            height={"60"}
                                            color='#ff727d'
                                        /> : "Submit"}
                                    </button>
                                </div>
                        </>
                    }
                </form>
            </div>
        </div>
    );
}

export default Auth
