package vut.fit.dp.spravarizik.domain;



import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.serializer.OtazkaSerializer;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

import static javax.persistence.GenerationType.IDENTITY;

/**
 * Datova trida pro otazku v dotazniku, predstavuje tabulku Otazka
 * @author Sara Skutova
 */
@JsonSerialize(using = OtazkaSerializer.class)
@Entity(name = "otazka")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Otazka")
public class Otazka {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_otazky", unique = true, nullable = false)
    private long id;

    @NotBlank(message = "Otazka musi mit zadany text otazky")
    @Column(name = "text_otazky", nullable = false, columnDefinition="text")
    private String textOtazky;

    //do jake oblasti otazka patri
    @NotNull(message = "Otaska musi mit pridanou oblast, do ktere patri")
    @ManyToOne
    @JoinColumn(name = "fk_oblasti", nullable = false)
    private OblastOtazky oblastOtazky;

    //odkaz do spojovaci tabulky, urcuje prideleni odpovedi k dane otazce
    @OneToMany (mappedBy = "otazka", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OtazkaOdpovedi> odpovedi =  new ArrayList<OtazkaOdpovedi>();

    //odkaz do spojovaci tabulky, urcije prideleni otazky k dotazniku
    @OneToMany (mappedBy = "otazkaDotazniku", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DotaznikOtazka> dotazniky = new ArrayList<DotaznikOtazka>();

    //odlaz do spojovaci tabulky, urcuje jak se v danem projektu/riziku odpovidalo jejich prirazenem dotazniku, a kdo odpovidal
    @OneToMany (mappedBy = "otazkaDOO", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DotazOtazOdpo> itemDOO = new ArrayList<DotazOtazOdpo>();

    public Otazka() {
    }

    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTextOtazky() {
        return textOtazky;
    }

    public void setTextOtazky(String textOtazky) {
        this.textOtazky = textOtazky;
    }

    public OblastOtazky getOblastOtazky() {
        return oblastOtazky;
    }

    public void setOblastOtazky(OblastOtazky oblastOtazky) {
        this.oblastOtazky = oblastOtazky;
    }

    public List<OtazkaOdpovedi> getOdpovedi() {
        return odpovedi;
    }

    //zobrazoval se mi tam problem pri mazani, tohle by to snad melo opravit
    public void setOdpovedi(List<OtazkaOdpovedi> odpovedi) {
        this.odpovedi.retainAll(odpovedi);
        this.odpovedi.addAll(odpovedi);
    }

    public List<DotaznikOtazka> getDotazniky() {
        return dotazniky;
    }

    public void setDotazniky(List<DotaznikOtazka> dotazniky) {
        this.dotazniky = dotazniky;
    }

    public List<DotazOtazOdpo> getItemDOO() {
        return itemDOO;
    }

    public void setItemDOO(List<DotazOtazOdpo> itemDOO) {
        this.itemDOO = itemDOO;
    }
}
