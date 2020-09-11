import React, {useEffect, useRef, useState} from "react";
import ProjectStatsInfo from "./ProjectStatsInfo";
import {differenceInCalendarDays, isValid, parseISO} from "date-fns";
import {useSelector} from "react-redux";

/**
 * Komponenta ktera vypocte pocet dnu do deadline. Pocita to od aktualniho data do koncoveho.
 * props:
 * konec - koncove datum projektu, zidkaneho ze serveru
 *
 * Autor: Sara Skutova
 * */
function ProjectDealine(props) {

    const [deadline, setDeadline] = useState(0);
    const isPocatek = useRef(true);
    const endDate = useSelector(state => state.deadline);

    /**
     * Vypocet poctu dnu dokonce
     * */
    function countDeadline(endDate) {
        let date = parseISO(endDate);
        let today = new Date();

        if(isValid(date)) {
            let dead = differenceInCalendarDays(date, today);
            if (dead < 0)
                return 0;
            else
                return dead;
        }
        else
            return 0;

    }

    useEffect(() => {
        let dead = countDeadline(props.konec);
        setDeadline(dead);
    }, [props]);


    useEffect(() => {
        if (isPocatek.current)
            isPocatek.current = false;
        else {
            let dead = countDeadline(endDate);
            setDeadline(dead);
        }
    }, [endDate, isPocatek]);

    return(
        <ProjectStatsInfo title="Dnů do ukončení" data={deadline}/>
    );
}

export default ProjectDealine;