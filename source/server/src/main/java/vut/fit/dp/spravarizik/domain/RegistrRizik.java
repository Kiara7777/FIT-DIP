package vut.fit.dp.spravarizik.domain;


import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.serializer.RegistrRizikSerializer;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.List;

import static javax.persistence.GenerationType.IDENTITY;

/**
 * Datova trida pro rizika predstavuje tabulku RegistrRizik
 * @author Sara Skutova
 */
@JsonSerialize(using = RegistrRizikSerializer.class)
@Entity(name = "registrrizik")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Registr_Rizik")
public class RegistrRizik {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_rizika", unique = true)
    private long id;

    @Column(name = "nazev", nullable = false)
    private String nazev;

    @Column(name = "popis", nullable = false, columnDefinition="text")
    private String popis;

    @Column(name = "mozne_reseni", columnDefinition="text")
    private String mozneReseni;

    //odkaz na kategorii, do ktere dane riziko patri
    @ManyToOne
    @JoinColumn(name = "fk_kategorie", nullable = false)
    private Kategorie kategorie;

    //seznam, reprezentuje odkaz v tabulce prpo spojeni uzivatele, rizika a rptojektu - reprezentuje prideleni rizika k projekttu a ktery resitel/uzivatel ma riziko na starosti
    @OneToMany (mappedBy = "idRizikoR", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UzivProjektRiziko> itemUzProjRiz = new ArrayList<UzivProjektRiziko>();


    public RegistrRizik() {
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

    public String getMozneReseni() {
        return mozneReseni;
    }

    public void setMozneReseni(String mozneReseni) {
        this.mozneReseni = mozneReseni;
    }

    public Kategorie getKategorie() {
        return kategorie;
    }

    public void setKategorie(Kategorie kategorie) {
        this.kategorie = kategorie;
    }

    public List<UzivProjektRiziko> getItemUzProjRiz() {
        return itemUzProjRiz;
    }

    public void setItemUzProjRiz(List<UzivProjektRiziko> itemUzProjRiz) {
        this.itemUzProjRiz = itemUzProjRiz;
    }

}