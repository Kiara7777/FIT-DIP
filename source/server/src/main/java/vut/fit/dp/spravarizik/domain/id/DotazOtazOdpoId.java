package vut.fit.dp.spravarizik.domain.id;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Trida pro spolecny klic mezi tabulkami Projekt, Uzivatel, Riziko, Dotaz, Otazka a Odpoved.
 * Umoznuje to vytvorit spolecnou dabulku, ktera reprezentuje jak dany uzivatel odpovedel na dany dotaznik k projektu
 *
 *  * @author Sara Skutova
 * */
@Embeddable
public class DotazOtazOdpoId implements Serializable {

    @Column(name = "id_proj")
    private Long projektID;

    @Column(name = "id_dotaz")
    private Long dotaznikID;

    @Column(name = "id_otazka")
    private Long otazkaID;

    @Column(name = "id_odpoved")
    private Long odpovedID;

    @Column(name = "id_uziv")
    private Long uzivatelID;

    public DotazOtazOdpoId() {
    }

    /////////// GETTERS pozadovanych ID ////////////////

    public Long getDotaznikID() {
        return dotaznikID;
    }

    public Long getOtazkaID() {
        return otazkaID;
    }

    public Long getOdpovedID() {
        return odpovedID;
    }

    public Long getProjektID() {
        return projektID;
    }

    public Long getUzivatelID() {
        return uzivatelID;
    }

    //////////////////////////////////////////////////////

    @Override
    public int hashCode() {
        return Objects.hash(projektID, uzivatelID, dotaznikID, odpovedID, otazkaID);
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
            DotazOtazOdpoId myOBJ = (DotazOtazOdpoId) obj;
            if (this.projektID == myOBJ.projektID && this.uzivatelID == myOBJ.uzivatelID &&
            this.dotaznikID == myOBJ.dotaznikID && this.odpovedID == myOBJ.odpovedID && this.otazkaID == myOBJ.otazkaID)
                return true;
            else
                return false;
        }
    }
}
