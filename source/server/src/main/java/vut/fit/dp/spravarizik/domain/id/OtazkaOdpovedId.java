package vut.fit.dp.spravarizik.domain.id;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Trida pro spolecny klic mezi tabulkami  Otazka a Odpoved.
 * Umoznuje to vytvorit spolecnou dabulku, ktera reprezentuje prirazeni odpovedi k dane otazce
 *
 * @author Sara Skutova
 * */
@Embeddable
public class OtazkaOdpovedId implements Serializable {

    @Column(name = "id_otazky")
    private Long idOtazky;

    @Column(name = "id_odpovedi")
    private Long idOdpovedi;

    public OtazkaOdpovedId() {
    }

    /////////// GETTERS pozadovanych ID ////////////////

    public Long getIdOtazky() {
        return idOtazky;
    }

    public Long getIdOdpovedi() {
        return idOdpovedi;
    }

    //////////////////////////////////////////////////////

    @Override
    public int hashCode() {
        return Objects.hash(idOtazky, idOdpovedi);
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
            OtazkaOdpovedId myOBJ = (OtazkaOdpovedId) obj;
            if (this.idOtazky == myOBJ.idOtazky && this.idOdpovedi == myOBJ.idOdpovedi)
                return true;
            else
                return false;
        }
    }
}
