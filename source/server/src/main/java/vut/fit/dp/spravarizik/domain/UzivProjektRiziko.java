package vut.fit.dp.spravarizik.domain;

/**
 * Datova trida pro spojeni uzivatele, projektu a rizika predstavuje tabulku Uziv_Projekt_Riziko
 * @author Sara Skutova
 */

import vut.fit.dp.spravarizik.domain.id.UzivProjRizikId;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Entity(name = "uzivprojektriziko")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Uziv_Projekt_Riziko")
public class UzivProjektRiziko {

    @EmbeddedId
    private UzivProjRizikId id = new UzivProjRizikId();

    @NotNull(message = "Projekt u rizika musi byt zadan")
    @ManyToOne
    @MapsId("projekt")
    @JoinColumn(name = "id_proj", nullable = false)
    private Projekt idProjektR;

    @NotNull(message = "Uzivatel u rizika musi byt zadan")
    @ManyToOne
    @MapsId("uzivatel")
    @JoinColumn(name = "id_uziv", nullable = false)
    private Uzivatel idUzivatelR;

    @NotNull(message = "Riziko u rizika musi byt zadano")
    @ManyToOne
    @MapsId("riziko")
    @JoinColumn(name = "id_riziko", nullable = false)
    private RegistrRizik idRizikoR;

    @Column(name = "stav", nullable = false)
    private long stav;

    @Column(name = "pravdepodobnost")
    private long pravdepodobnost;

    @Column(name = "dopad")
    private long dopad;

    @Column(name = "popis_dopadu", columnDefinition="text")
    private String popisDopadu;

    @Column(name = "plan_reseni", columnDefinition="text")
    private String planReseni;

    @Column(name = "priorita")
    private long priorita;


    public UzivProjektRiziko() {
    }

    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////
    public UzivProjRizikId getId() {
        return id;
    }

    public void setId(UzivProjRizikId id) {
        this.id = id;
    }

    public Projekt getIdProjektR() {
        return idProjektR;
    }

    public void setIdProjektR(Projekt idProjektR) {
        this.idProjektR = idProjektR;
    }

    public Uzivatel getIdUzivatelR() {
        return idUzivatelR;
    }

    public void setIdUzivatelR(Uzivatel idUzivatelR) {
        this.idUzivatelR = idUzivatelR;
    }

    public RegistrRizik getIdRizikoR() {
        return idRizikoR;
    }

    public void setIdRizikoR(RegistrRizik idRizikoR) {
        this.idRizikoR = idRizikoR;
    }

    public long getStav() {
        return stav;
    }

    public void setStav(long stav) {
        this.stav = stav;
    }

    public long getPravdepodobnost() {
        return pravdepodobnost;
    }

    public void setPravdepodobnost(long pravdepodobnost) {
        this.pravdepodobnost = pravdepodobnost;
    }

    public long getDopad() {
        return dopad;
    }

    public void setDopad(long dopad) {
        this.dopad = dopad;
    }

    public String getPopisDopadu() {
        return popisDopadu;
    }

    public void setPopisDopadu(String popisDopadu) {
        this.popisDopadu = popisDopadu;
    }

    public String getPlanReseni() {
        return planReseni;
    }

    public void setPlanReseni(String planReseni) {
        this.planReseni = planReseni;
    }

    public long getPriorita() {
        return priorita;
    }

    public void setPriorita(long priorita) {
        this.priorita = priorita;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UzivProjektRiziko that = (UzivProjektRiziko) o;
        return idProjektR.getId() == that.idProjektR.getId() &&
                idUzivatelR.getId() == that.idUzivatelR.getId() &&
                idRizikoR.getId() == that.idRizikoR.getId() &&
                stav == that.stav &&
                pravdepodobnost == that.pravdepodobnost &&
                dopad == that.dopad &&
                priorita == that.priorita &&
                Objects.equals(popisDopadu, that.popisDopadu) &&
                Objects.equals(planReseni, that.planReseni);
    }
}
