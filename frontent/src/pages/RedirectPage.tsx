import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpService from "../httpService";
import { useDispatch } from "react-redux";
import { setToken } from "../authSlice";

export function RedirectPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);

        const code = urlParams.get("code");

        if (!code) return;

        httpService.fetch({
            url: `/api/auth/callback?code=${code}`,
            options: {
                method: 'GET'
            }
        })
            .then((res) => {

                dispatch(setToken(res.data.token));

                navigate('/profile', { replace: true });

            })
            .catch((err) => {
                console.error(err);
            });

    }, [dispatch, navigate]);

    return (
        <div>
            Loging.....
        </div>
    )
}

export default RedirectPage;