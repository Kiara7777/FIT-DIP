package vut.fit.dp.spravarizik.domain;


import vut.fit.dp.spravarizik.domain.id.DotaznikOtazkaId;

import javax.persistence.*;

/**
 * Datova trida pro spojeni dotazniku s otazkou predstavuje tabulku Dotaznik_Otazka
 * @author Sara Skutova
 */
@Entity(name = "dotaznikotazka")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Dotaznik_Otazka")
public class DotaznikOtazka{

    //tohle mapuje spojeny klic, ktery se definoval v OtazkaDotaznikId
    @EmbeddedId
    private DotaznikOtazkaId id = new DotaznikOtazkaId();

    @ManyToOne
    @MapsId("otazkaID")
    @JoinColumn(name = "id_otazky", nullable = false)
    private Otazka otazkaDotazniku;

    @ManyToOne
    @MapsId("dotaznikID")
    @JoinColumn(name = "id_dotazniku", nullable = false)
    private Dotaznik dotaznik;

    @Column(name = "poradi", nullable = false)
    private long poradi;

    public DotaznikOtazka() {
    }

    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////
    public DotaznikOtazkaId getId() {
        return id;
    }

    public void setId(DotaznikOtazkaId id) {
        this.id = id;
    }

    public Otazka getOtazkaDotazniku() {
        return otazkaDotazniku;
    }

    public void setOtazkaDotazniku(Otazka otazkaDotazniku) {
        this.otazkaDotazniku = otazkaDotazniku;
    }

    public Dotaznik getDotaznik() {
        return dotaznik;
    }

    public void setDotaznik(Dotaznik dotaznik) {
        this.dotaznik = dotaznik;
    }

    public long getPoradi() {
        return poradi;
    }

    public void setPoradi(long poradi) {
        this.poradi = poradi;
    }
}
