import React, {useEffect, useState} from "react";
import ProjectStatsInfo from "./ProjectStatsInfo";
import {useSelector} from "react-redux";

/**
 * Komponenta zobrazujici pocet aktualne pracujicih lidi na projektu
 * Ziskava informace z REDUXU
 *
 * Autor: Sara Skutova
 * */
function PeopleNumber() {

    const [people, setPeople] = useState(0);
    const peopleCouterState = useSelector(state => state.projectPlCount);

    useEffect(() => {
        setPeople(peopleCouterState);
    }, [peopleCouterState]);

    return(
        <ProjectStatsInfo title="Počet členů týmu" data={people}/>
    );
}

export default PeopleNumber;