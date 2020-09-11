package vut.fit.dp.spravarizik.domain.id;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Trida pro spolecny klic mezi tabulkami Dotaznik a Otazka.
 * Umoznuje to vytvorit spolecnou dabulku DotaznikOtazka, ktera urcuje jaka otazka je v danem dotazniku.
 *
 * @author Sara Skutova
 * */
@Embeddable
public class DotaznikOtazkaId implements Serializable {

    //koresponduje s id dotazniku
    @Column(name = "id_dotazniku")
    private Long dotaznikID;

    //koresponduje s id otazky
    @Column(name = "id_otazky")
    private Long otazkaID;

    public DotaznikOtazkaId() {
    }

    /**
     * Vrati id dotazniku
     * @return id dotazniku
     * */
    public Long getDotaznikID() {
        return dotaznikID;
    }

    /**
     * Vrati id otazky
     * @return id otazky
     * */
    public Long getOtazkaID() {
        return otazkaID;
    }

    @Override
    public int hashCode() {
        return Objects.hash(otazkaID, dotaznikID);
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
            DotaznikOtazkaId myOBJ = (DotaznikOtazkaId) obj;
            if (this.otazkaID == myOBJ.otazkaID && this.dotaznikID == myOBJ.dotaznikID)
                return true;
            else
                return false;
        }
    }
}
