import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import ProjectStatsInfo from "./ProjectStatsInfo";

/**
 * Komponenta zobrazujici pocet rizik na projektu
 * cte data z Reduxu
 *
 * Autor: Sara Skutova
 * */
function RiskNumber() {
    const [risksCount, setRisksCount] = useState(0);
    const projectRisk = useSelector(state => state.projectRisks);

    useEffect(() => {
        setRisksCount(projectRisk.length);
    }, [projectRisk]);

    return(
        <ProjectStatsInfo title="Počet rizik" data={risksCount}/>
    );

}

export default RiskNumber;