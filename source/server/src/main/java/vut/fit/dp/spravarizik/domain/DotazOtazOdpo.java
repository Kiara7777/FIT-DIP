package vut.fit.dp.spravarizik.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.id.DotazOtazOdpoId;
import vut.fit.dp.spravarizik.domain.serializer.DotazOtazOdpoSerializer;
import vut.fit.dp.spravarizik.domain.serializer.RegistrRizikSerializer;
import vut.fit.dp.spravarizik.repository.DotazOtazOdpoRepository;


import javax.persistence.*;

/**
 * Velka spojovaci tabulka. Spojuje Dotanik, Otazku, Odpoved s Projektem, Uzivatelem
 * Urcuje jak se v danem dotazniku odpovidalo na danou otazku, jaky uzivatel tak odpovial
 *
 * @author Sara Skutova
 * */
@JsonSerialize(using = DotazOtazOdpoSerializer.class)
@Entity(name = "dotazotazodpo")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Dotaz_Otaz_Odpo")
public class DotazOtazOdpo {

    //tohle mapuje spojeny klic, ktery se definoval v DotazOtazOdpoId
    @EmbeddedId
    private DotazOtazOdpoId id = new DotazOtazOdpoId();

    @ManyToOne
    @MapsId("projektID")
    @JoinColumn(name = "id_proj", nullable = false)
    private Projekt projektDOO;

    @ManyToOne
    @MapsId("uzivatelID")
    @JoinColumn(name = "id_uziv", nullable = false)
    private Uzivatel uzivatelDOO;

    @ManyToOne
    @MapsId("dotaznikID")
    @JoinColumn(name = "id_dotaz", nullable = false)
    private Dotaznik dotaznikDOO;

    @ManyToOne
    @MapsId("otazkaID")
    @JoinColumn(name = "id_otazka", nullable = false)
    private Otazka otazkaDOO;

    @ManyToOne
    @MapsId("odpovedID")
    @JoinColumn(name = "id_odpoved", nullable = false)
    private Odpoved odpovedDOO;

    public DotazOtazOdpo() {
    }



    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////
    public DotazOtazOdpoId getId() {
        return id;
    }

    public void setId(DotazOtazOdpoId id) {
        this.id = id;
    }

    public Projekt getProjektDOO() {
        return projektDOO;
    }

    public void setProjektDOO(Projekt idProjektDOO) {
        this.projektDOO = idProjektDOO;
    }

    public Uzivatel getUzivatelDOO() {
        return uzivatelDOO;
    }

    public void setUzivatelDOO(Uzivatel idUzivatelDOO) {
        this.uzivatelDOO = idUzivatelDOO;
    }

    public Dotaznik getDotaznikDOO() {
        return dotaznikDOO;
    }

    public void setDotaznikDOO(Dotaznik idDotazDOO) {
        this.dotaznikDOO = idDotazDOO;
    }

    public Otazka getOtazkaDOO() {
        return otazkaDOO;
    }

    public void setOtazkaDOO(Otazka idOtazkaDOO) {
        this.otazkaDOO = idOtazkaDOO;
    }

    public Odpoved getOdpovedDOO() {
        return odpovedDOO;
    }

    public void setOdpovedDOO(Odpoved idOdpovedDOO) {
        this.odpovedDOO = idOdpovedDOO;
    }
}
