package vut.fit.dp.spravarizik.domain;


import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.serializer.DotaznikSerializer;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import java.util.*;

import static javax.persistence.GenerationType.IDENTITY;

/**
 * Datova trida pro dotaznik, predstavuje tabulku DOtaznik
 * @author Sara Skutova
 */
@JsonSerialize(using = DotaznikSerializer.class)
@Entity(name = "dotaznik")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Dotaznik")
public class Dotaznik {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_dotaz", unique = true, nullable = false)
    private long id;

    @NotBlank(message = "Dotaznik musi mit nazev")
    @Column(name = "nazev", nullable = false, columnDefinition="text")
    private String nazev;

    @NotBlank(message = "Dotaznik musí mít popis")
    @Column(name = "popis", nullable = false, columnDefinition="text")
    private String popis;

    /////////////////////////////////////////////////////////////////////////////
    //seznam projektu co maji prideleny dany dotaznik
    @OneToMany(mappedBy = "dotaznikProjektu")
    private List<Projekt> projekts = new ArrayList<Projekt>();
    /////////////////////////////////////////////////////////////////////////////

    //Odkaz do tabulky, ktera spojuje dotaznik a otazku, urcuje jake otazky dotaznik ma
    @OneToMany (mappedBy = "dotaznik", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DotaznikOtazka> otazky = new ArrayList<DotaznikOtazka>();


    //Odtaz to tabulky, ktera spojuje dotaznik, otazku, odpoved s projektem, uzivatelem a rizikem, urcuje jak se v danem dotaniku odpovidlo
    //kdo odpovidal a zda se dotaznik tykal projektu nebo rizika - TODO mozna se bude menit
    @OneToMany (mappedBy = "dotaznikDOO", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DotazOtazOdpo> itemDOO = new ArrayList<DotazOtazOdpo>();



    public Dotaznik() {
    }

    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNazev() {
        return nazev;
    }

    public void setNazev(String nazev) {
        this.nazev = nazev;
    }

    public String getPopis() {
        return popis;
    }

    public void setPopis(String popis) {
        this.popis = popis;
    }

    public List<DotaznikOtazka> getOtazky() {
        return otazky;
    }

    public void setOtazky(List<DotaznikOtazka> otazky) {

        this.otazky.retainAll(otazky);
        this.otazky.addAll(otazky);
    }

    public List<DotazOtazOdpo> getItemDOO() {
        return itemDOO;
    }

    public void setItemDOO(List<DotazOtazOdpo> itemDOO) {
        this.itemDOO = itemDOO;
    }

    public List<Projekt> getProjekts() {
        return projekts;
    }

    public void setProjekts(List<Projekt> projekts) {
        this.projekts = projekts;
    }
}
