package vut.fit.dp.spravarizik.domain;


import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.serializer.OdpovedSerializer;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.List;

import static javax.persistence.GenerationType.IDENTITY;

/**
 * Datova trida pro odpoved na otazku, predstavuje tabulku Odpoved
 * @author Sara Skutova
 */
@JsonSerialize(using = OdpovedSerializer.class)
@Entity(name = "odpoved")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Odpoved")
public class Odpoved {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_odpovedi", unique = true, nullable = false)
    private long id;

    @Column(name = "text_odpovedi", nullable = false)
    private String textOdpovedi;

    //spojovaci odkaz, urcuje, ve kterchych otazkach je dana odpoved jako moznost
    @OneToMany (mappedBy = "odpoved", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OtazkaOdpovedi> item = new ArrayList<OtazkaOdpovedi>();

    //odkaz na to kde se dana odpoved skutecne vyskytla
    @OneToMany (mappedBy = "odpovedDOO", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DotazOtazOdpo> itemDOO = new ArrayList<DotazOtazOdpo>();

    public Odpoved() {
    }

    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTextOdpovedi() {
        return textOdpovedi;
    }

    public void setTextOdpovedi(String textOdpovedi) {
        this.textOdpovedi = textOdpovedi;
    }

    public List<OtazkaOdpovedi> getItem() {
        return item;
    }

    public void setItem(List<OtazkaOdpovedi> item) {
        this.item = item;
    }

    public List<DotazOtazOdpo> getItemDOO() {
        return itemDOO;
    }

    public void setItemDOO(List<DotazOtazOdpo> itemDOO) {
        this.itemDOO = itemDOO;
    }
}
