package vut.fit.dp.spravarizik.domain.id;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Trida pro spolecny klic mezi tabulkami Uzivatel a Projekt a Riziko.
 * Umoznuje to vytvorit spolecnou dabulku, ktera reprezentuje jak prirazeni rizika k projektu, tak i ktery uzivatel ma dane riziko na starosti
 *
 * @author Sara Skutova
 * */
@Embeddable
public class UzivProjRizikId implements Serializable {

    @Column(name = "id_proj")
    private Long projekt;

    @Column(name = "id_riziko")
    private Long riziko;

    @Column(name = "id_uziv")
    private Long uzivatel;

    public UzivProjRizikId() {
    }

    /////////// GETTERS pozadovanych ID ////////////////

    public Long getProjekt() {
        return projekt;
    }

    public Long getRiziko() {
        return riziko;
    }

    public Long getUzivatel() {
        return uzivatel;
    }

    public void setProjekt(Long idProjektu) {
        this.projekt = idProjektu;
    }

    public void setRiziko(Long idRizika) {
        this.riziko = idRizika;
    }

    public void setUzivatel(Long idUzivatele) {
        this.uzivatel = idUzivatele;
    }

    //////////////////////////////////////////////////////

    @Override
    public int hashCode() {
        return Objects.hash(projekt, riziko, uzivatel);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        else if (obj == null)
            return false;
        else if (getClass() != obj.getClass())
            return false;
        else {
            UzivProjRizikId myOBJ = (UzivProjRizikId) obj;
            if (this.projekt == myOBJ.projekt && this.riziko == myOBJ.riziko && this.uzivatel == myOBJ.uzivatel)
                return true;
            else
                return false;
        }
    }


}
