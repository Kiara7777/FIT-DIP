import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {changeFalse, setErrorCode} from "../actions";
import {trackPromise} from "react-promise-tracker";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

export const useGetData = (url, rerun) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const dispatch = useDispatch();
    const source = useRef(axios.CancelToken.source());

    const getData = useCallback(async () => {
        //console.log("CALLBACK");
        setLoading(true);
        try {
            const response = await axios.get(url, {cancelToken: source.current.token});
            setData(response.data);
            setLoading(false);
        } catch (e) {
            if (!axios.isCancel(e)) {
                dispatch(setErrorCode(e.response.status));
            }
        }},[url, dispatch]);


    useEffect(() => {
        //console.log("MOUNT");
        trackPromise(getData());
    }, [getData]);

    useEffect(() => {
        if (rerun) {
            //console.log("rerun", true);
            trackPromise(getData());
            dispatch(changeFalse());
        } else {
            //console.log("rerun", false);
        }
    }, [rerun, getData, dispatch]);

    useEffect(() => {
        const testS = source;
        return() => {
            //console.log("UNMOUNT");
            testS.current.cancel();
        }
    }, [source]);

    return [ loading, data ];
};