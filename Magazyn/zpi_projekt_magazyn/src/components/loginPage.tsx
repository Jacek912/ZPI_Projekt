'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from 'next/navigation';

function LoginForm() {
    const [username, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.get("/api/login", {
                params: {
                    username,
                    password,
                },
            });

            const token = response.data?.token || response.data;
            if (!token) {
                throw new Error("No token received");
            }


            localStorage.setItem("token", token);

 
            router.replace("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="grid grid-cols-2 h-screen w-screen place-items-center bg-gray-100">
            <div className="shadow-lg p-5 rounded-lg border-t-4 border-loginImageColor bg-white h-1/3 w-1/2">
                <p className="flex flex-col mb-5 text-center font-medium text-2xl">Podaj dane logowania</p> 
                <form onSubmit={handleLogin} className="flex flex-col gap-12">
                    <input
                        type="text"
                        className="border-solid border border-loginImageColor rounded-lg p-4 text-2xl"
                        value={username}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Login"
                        required
                    />
                    <input
                        type="password"
                        className="border-solid border border-loginImageColor rounded-lg p-4 text-2xl"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Hasło"
                        required
                    />
                    <button className="bg-loginImageColor rounded-lg p-4 text-white mt-5 text-2xl" type="submit">
                        Zaloguj
                    </button>
                </form>
            </div>
            <div className="bg-loginImageColor w-full h-full place-content-center place-items-center">
                <Image
                    src="/loginImage.jpg"
                    width={700}
                    height={700}
                    alt="Login Illustration"
                />
            </div>
        </div>
    );
};

export default LoginForm;
