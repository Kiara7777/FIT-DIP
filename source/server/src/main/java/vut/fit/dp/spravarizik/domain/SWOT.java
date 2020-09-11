package vut.fit.dp.spravarizik.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;

import static javax.persistence.GenerationType.IDENTITY;

/**
 * Trida pro SWOT danalyzu daneho projektu. Reprezentuje tabulku SWOT. Tahle tabulka je primo zavisla na projektu
 * funguji ve stylu - ONE TO ONE, takze defakto se jedna o atribut daneho projektu
 *
 * @author Sara Skutova
 * */
@Entity(name = "swot")
@Table(name = "SWOT")
public class SWOT {

    //na rozdil od vsech ostatnich, zde neni pozadovano generovani id pro danou tabulku, zaznam v tabulce je zavisly na projektu
    @Id
    @Column(name = "id_swot", unique = true, nullable = false)
    private long id;

    @Column(name = "silne", nullable = false, columnDefinition="text")
    private String silne;

    @Column(name = "slabe", nullable = false, columnDefinition="text")
    private String slabe;

    @Column(name = "prilezitosti", nullable = false, columnDefinition="text")
    private String prilezitosti;

    @Column(name = "hrozby", nullable = false, columnDefinition="text")
    private String hrozby;

    //tady je odkaz na dany projekt
    @OneToOne
    @MapsId
    private Projekt projekt;

    public SWOT() {
    }

    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getSilne() {
        return silne;
    }

    public void setSilne(String silne) {
        this.silne = silne;
    }

    public String getSlabe() {
        return slabe;
    }

    public void setSlabe(String slabe) {
        this.slabe = slabe;
    }

    public String getPrilezitosti() {
        return prilezitosti;
    }

    public void setPrilezitosti(String prilezitosti) {
        this.prilezitosti = prilezitosti;
    }

    public String getHrozby() {
        return hrozby;
    }

    public void setHrozby(String hrozby) {
        this.hrozby = hrozby;
    }


    // @JsonIgnore znaci aby se pri serializaci, zatribut projektu ignoroval - jinac se to zacykli!!!
    @JsonIgnore
    public Projekt getProjekt() {
        return projekt;
    }

    // @JsonProperty znaci aby se pri deserializaci zaznam id projektu nebyl ignosrovan, ale musel byt v datec pritomen
    @JsonProperty
    public void setProjekt(Projekt projekt) {
        this.projekt = projekt;
    }
}
