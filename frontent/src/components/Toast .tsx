import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { hideToast } from "../store/toastSlice";
import type { RootState } from "../store";

const Toast =()=>{
    const dispatch=useDispatch();
    const {message,visible,type}=useSelector((state: RootState)=>state.toast)

    useEffect(()=>{
        if(visible){
            setTimeout(()=>{
                dispatch(hideToast());
            },3000);
        }
    },[visible]);

    if(!visible) return null;
    return(
        <div className={`fixed z-1 top-5 right-5 bg-black text-white px-4 py-2 rounded-lg ${type==="success"?"bg-green-500":type==="error"?"bg-red-500":"bg-blue-500"}`} >{message}</div>
    )
}

export default Toast;
