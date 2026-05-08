import { useEffect, useState } from "react";
import httpService from "../httpService";

export function Profile() {

    const [content, setContent] = useState("");

    useEffect(() => {

        httpService.fetchWithAuth({
            url: '/api/profile',
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

    return (
        <div>
            <div>Protected content</div>
            <div>{content}</div>
            <div>{content.providerType}</div>
        </div>
    )
}

export default Profile;