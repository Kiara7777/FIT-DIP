package vut.fit.dp.spravarizik.uniteClass;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.Projekt;
import vut.fit.dp.spravarizik.domain.UzivProjekt;
import vut.fit.dp.spravarizik.domain.serializer.ProjectCardSerializer;
import vut.fit.dp.spravarizik.domain.serializer.ProjektSerializer;

import java.util.List;

/**
 * Trida ktera vrati objekt karty projektu, at to nemusi klient delat cele sam
 *
 * @author Sara Skutova
 * */
@JsonSerialize(using = ProjectCardSerializer.class)
public class ProjectCard {

    private Long projectId;
    private String projectName;
    private String projectDescript;
    private boolean active;
    private String managerName;

    public ProjectCard(Projekt projekt, String name) {
        this.projectId = projekt.getId();
        this.projectName = projekt.getNazev();
        this.projectDescript = projekt.getPopis();
        this.active = projekt.isAktivni();
        this.managerName = name;
    }

    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////
    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectDescript() {
        return projectDescript;
    }

    public void setProjectDescript(String projectDescript) {
        this.projectDescript = projectDescript;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }
}
