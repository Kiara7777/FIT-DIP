package vut.fit.dp.spravarizik.uniteClass;

/**
 * Trida ktera vrati objekt karty dotazniku, at to nemusi klient delat cele sam - nazev, popis, pocet otazek, zda je v projektu pouzity
 *
 * @author Sara Skutova
 * */
public class DotaznikCard {

    private Long id;
    private String nazev;
    private String popis;
    private int pocetOtazek;
    private boolean pouzit;

    public DotaznikCard(Long id, String nazev, String popis, int pocetOtazek, boolean pouzit) {
        this.id = id;
        this.nazev = nazev;
        this.popis = popis;
        this.pocetOtazek = pocetOtazek;
        this.pouzit = pouzit;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public int getPocetOtazek() {
        return pocetOtazek;
    }

    public void setPocetOtazek(int pocetOtazek) {
        this.pocetOtazek = pocetOtazek;
    }

    public boolean isPouzit() {
        return pouzit;
    }

    public void setPouzit(boolean pouzit) {
        this.pouzit = pouzit;
    }
}
