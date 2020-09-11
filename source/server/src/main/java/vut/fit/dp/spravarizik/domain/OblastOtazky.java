package vut.fit.dp.spravarizik.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.serializer.OblastOtazkySerializer;
import vut.fit.dp.spravarizik.domain.serializer.RoleSerializer;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

import static javax.persistence.GenerationType.IDENTITY;

/**
 * Datova trida pro Oblast otazky, predstavuje tabulku oblastOtazky
 * @author Sara Skutova
 */
@JsonSerialize(using = OblastOtazkySerializer.class)
@Entity(name = "oblastotazky")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Oblast_Otazky")
public class OblastOtazky {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_oblasti", unique = true, nullable = false)
    private long id;

    @NotBlank(message = "Nazev oblasti musi byt zadan")
    @Column(name = "nazev", nullable = false)
    private String nazev;

    //seznam otazek spadajici do dane oblasti
    @OneToMany(mappedBy = "oblastOtazky", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Otazka> items = new ArrayList<Otazka>();

    public OblastOtazky() {
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

    public List<Otazka> getItems() {
        return items;
    }

    public void setItems(List<Otazka> items) {
        this.items = items;
    }
}
