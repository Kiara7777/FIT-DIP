package vut.fit.dp.spravarizik.domain;

import vut.fit.dp.spravarizik.domain.id.OtazkaOdpovedId;

import javax.persistence.*;

/**
 * Datova trida pro spojeni otazky a odpovedi predstavuje tabulku Otazka_Odpovedi
 * @author Sara Skutova
 */
@Entity(name = "otazkaodpovedi")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Otazka_Odpovedi")
public class OtazkaOdpovedi {

    //tohle mapuje spojeny klic, ktery se definoval v OtazkaOdpovedId
    @EmbeddedId
    private OtazkaOdpovedId id = new OtazkaOdpovedId();

    @ManyToOne
    @MapsId("idOtazky")
    @JoinColumn(name = "id_otazky", nullable = false)
    private Otazka otazka;

    @ManyToOne
    @MapsId("idOdpovedi")
    @JoinColumn(name = "id_odpovedi", nullable = false)
    private Odpoved odpoved;

    @Column(name = "poradi", nullable = false)
    private long poradi;

    public OtazkaOdpovedi() {
    }

    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////

    public OtazkaOdpovedId getId() {
        return id;
    }

    public void setId(OtazkaOdpovedId id) {
        this.id = id;
    }

    public Otazka getOtazka() {
        return otazka;
    }

    public void setOtazka(Otazka otazka) {
        this.otazka = otazka;
    }

    public Odpoved getOdpoved() {
        return odpoved;
    }

    public void setOdpoved(Odpoved odpoved) {
        this.odpoved = odpoved;
    }

    public long getPoradi() {
        return poradi;
    }

    public void setPoradi(long poradi) {
        this.poradi = poradi;
    }
}
