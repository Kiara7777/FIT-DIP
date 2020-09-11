package vut.fit.dp.spravarizik.domain;


import vut.fit.dp.spravarizik.domain.id.UzivProjektId;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Datova trida pro spojeni uzivatele s projektem predstavuje tabulku Uziv_Projekt
 * @author Sara Skutova
 */
@Entity(name = "uzivprojekt")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Uziv_Projekt")
public class UzivProjekt {

    ////tohle mapuje spojeny klic, ktery se definoval v UzivProjektId
    @EmbeddedId
    private UzivProjektId id = new UzivProjektId();

    @ManyToOne
    @MapsId("projectID") //tohle se musi jmenovat stejne jako atribut v ID
    @JoinColumn(name = "id_proj")
    private Projekt projekt;

    @ManyToOne
    @MapsId("uzivatelID")
    @JoinColumn(name = "id_uziv")
    private Uzivatel uzivatel;


    @Column(name = "vedouci",  columnDefinition = "boolean default false")
    private boolean vedouci;

    @NotNull(message = "Uživatel musí mít zadáno kdy začal na projektu pracovat")
    @Basic
    @Temporal(TemporalType.DATE)
    @Column(name = "datum_zacatku", nullable = false)
    private Date dateStart;

    @Basic
    @Temporal(TemporalType.DATE)
    @Column(name = "datum_ukonceni")
    private Date dateEnd;

    @Column(name = "aktivni",  columnDefinition = "boolean default false")
    private boolean aktivni;

    public UzivProjekt() {
    }

    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////
    public UzivProjektId getId() {
        return id;
    }

    public void setId(UzivProjektId id) {
        this.id = id;
    }

    public Projekt getProjekt() {
        return projekt;
    }

    public void setProjekt(Projekt projekt) {
        this.projekt = projekt;
    }

    public Uzivatel getUzivatel() {
        return uzivatel;
    }

    public void setUzivatel(Uzivatel uzivatel) {
        this.uzivatel = uzivatel;
    }

    public boolean isVedouci() {
        return vedouci;
    }

    public void setVedouci(boolean vedouci) {
        this.vedouci = vedouci;
    }

    public Date getDateStart() {
        return dateStart;
    }

    public void setDateStart(Date dateStart) {
        this.dateStart = dateStart;
    }

    public Date getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(Date dateEnd) {
        this.dateEnd = dateEnd;
    }

    public boolean isAktivni() {
        return aktivni;
    }

    public void setAktivni(boolean aktivni) {
        this.aktivni = aktivni;
    }
}

