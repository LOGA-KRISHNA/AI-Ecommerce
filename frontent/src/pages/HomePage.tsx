import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpService from "../httpService";

export function HomePage() {

    const navigate = useNavigate();
    const [content, setContent] = useState("")
    const [cognitoUrl, setCognitoUrl] = useState("");

    useEffect(() => {

        httpService.fetch({
            url: '/api/public',
            options: {
                method: 'GET'
            }
        })
            .then((res) => {
                setContent(res.data.message);
            })
            .catch((err) => {
                console.error(err);
            });

    }, []);

    useEffect(() => {

        httpService.fetch({
            url: '/api/auth/url',
            options: {
                method: 'GET'
            }
        })
            .then((res) => {
                setCognitoUrl(res.data.url);
            })
            .catch((err) => {
                console.error(err);
            });

    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="p-4 flex justify-between items-center bg-white shadow">
                <h1 className="text-xl font-bold">Logo</h1>
                <button onClick={() => navigate('/profile')} className="text-blue-600">profile</button>
                <button onClick={() => window.location.href = cognitoUrl} className="text-blue-600">Login</button>
            </nav>
            <main className="text-center mt-10">
                <h2 className="text-4xl font-bold">Welcome</h2>
                <p>{content}</p>
            </main>
        </div>
    )
};


export default HomePage;