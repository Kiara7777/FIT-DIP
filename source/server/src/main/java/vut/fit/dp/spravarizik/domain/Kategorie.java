package vut.fit.dp.spravarizik.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.serializer.KategorieSerializer;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.List;

import static javax.persistence.GenerationType.IDENTITY;

/**
 * Datova trida pro kategorii rizika predstavuje tabulku Kategorie
 * @author Sara Skutova
 */
@JsonSerialize(using = KategorieSerializer.class)
@Entity(name = "kategorie")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Kategorie")
public class Kategorie {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_kategorie", unique = true, nullable = false)
    private long id;

    @Column(name = "nazev", nullable = false)
    private String nazev;

    @Column(name = "popis", nullable = false, columnDefinition="text")
    private String popis;

    //seznam rizik co maji danou kategorii
    @OneToMany(mappedBy = "kategorie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RegistrRizik> rizika = new ArrayList<RegistrRizik>();

    public Kategorie() {
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

    public List<RegistrRizik> getRizika() {
        return rizika;
    }

    public void setRizika(List<RegistrRizik> items) {
        this.rizika = items;
    }


}
