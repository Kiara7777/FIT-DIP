package vut.fit.dp.spravarizik.domain.id;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Trida pro spolecny klic mezi tabulkami Uzivatel a Projekt.
 * Umoznuje to vytvorit spolecnou dabulku, ktera reprezentuje prirazeni uzivatelu k danemu projektu
 *
 * @author Sara Skutova
 * */
@Embeddable
public class UzivProjektId implements Serializable {

    @Column(name = "id_proj")
    private long projectID;

    @Column(name = "id_uziv")
    private long uzivatelID;

    public UzivProjektId() {
    }

    /////////// GETTERS a SETTERS pozadovanych ID ////////////////
    public long getProjectID() {
        return projectID;
    }

    public long getUzivatelID() {
        return uzivatelID;
    }

    public void setProjectID(long projectID) {
        this.projectID = projectID;
    }

    public void setUzivatelID(long uzivatelID) {
        this.uzivatelID = uzivatelID;
    }

    //////////////////////////////////////////////////////

    @Override
    public int hashCode() {
        return Objects.hash(projectID, uzivatelID);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        else if (obj == null)
            return  false;
        else if (getClass() != obj.getClass())
            return false;
        else {
            UzivProjektId myOBJ = (UzivProjektId) obj;
            if (this.projectID == myOBJ.projectID && this.uzivatelID == myOBJ.uzivatelID)
                return true;
            else
                return false;
        }
    }


}
