package vut.fit.dp.spravarizik.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.serializer.ProjektSerializer;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import java.util.*;

import static javax.persistence.GenerationType.IDENTITY;

/**
 * Trida urcujici Projekt, reprezentuje tabulku Projekt
 *
 * @author Sara Skutova
 * */
@JsonSerialize(using = ProjektSerializer.class)
@Entity(name = "projekt")
@Table(name = "Projekt")
public class Projekt {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_proj", unique = true, nullable = false)
    private long id;

    @NotBlank(message = "Projekt musí mít zadán název")
    @Column(name = "nazev")
    private String nazev;

    @NotBlank(message = "Projekt musí mít popis")
    @Column(name = "popis", columnDefinition="text")
    private String popis;

    @NotNull(message = "Projekt musí mít pořáteční datum")
    @Basic
    @Temporal(TemporalType.DATE)
    @Column(name = "start", nullable = false)
    private Date start;

    @NotNull(message = "Projekt musí mít zadán přepokládanou dobu dokončení")
    @Basic
    @Temporal(TemporalType.DATE)
    @Column(name = "konec")
    private Date konec;

    @Column(name = "aktivni", columnDefinition = "boolean default true")
    private boolean aktivni;

    @OneToOne(mappedBy = "projekt", cascade = CascadeType.ALL)
    private SWOT swot;

    //odkaz na dotanik, ktery ma projekt prideleny
    @ManyToOne(optional = true)
    @JoinColumn(name = "fk_dotaznik")
    private Dotaznik dotaznikProjektu;



    //odkaz na spojeni mezi Projektem a Uzivatelem, reprezentuje kdo na danem projektu pracoval
    @OneToMany (mappedBy = "projekt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UzivProjekt> itemUzProj = new ArrayList<UzivProjekt>();

    //odkaz na spojenom meni Projektem, UZivatelem a Rizikem, urcuje jake riziko se k projektu prirazeno a kdo ho spravuje
    @OneToMany (mappedBy = "idProjektR", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UzivProjektRiziko> itemUzProjRiz = new ArrayList<UzivProjektRiziko>();

    //odkaz na prideleny dotaznik a jak se v dotaniku odpovidalo a kdo jak odpovidal - TODO bdue se urcite menit, nebude to dostanetene
    @OneToMany (mappedBy = "projektDOO", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DotazOtazOdpo> itemDOO = new ArrayList<DotazOtazOdpo>();


    public Projekt() {
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

    public Date getStart() {
        return start;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getKonec() {
        return konec;
    }

    public void setKonec(Date konec) {
        this.konec = konec;
    }

    public boolean isAktivni() {
        return aktivni;
    }

    public void setAktivni(boolean aktivni) {
        this.aktivni = aktivni;
    }

    public SWOT getSwot() {
        return swot;
    }

    public void setSwot(SWOT swot) {
        this.swot = swot;
    }

    public List<UzivProjekt> getItemUzProj() {
        return itemUzProj;
    }

    public void setItemUzProj(List<UzivProjekt> itemUzProj) {
        this.itemUzProj = itemUzProj;
    }

    public List<UzivProjektRiziko> getItemUzProjRiz() {
        return itemUzProjRiz;
    }

    public void setItemUzProjRiz(List<UzivProjektRiziko> itemUzProjRiz) {
        this.itemUzProjRiz = itemUzProjRiz;
    }

    public List<DotazOtazOdpo> getItemDOO() {
        return itemDOO;
    }

    public void setItemDOO(List<DotazOtazOdpo> itemDOO) {
        this.itemDOO = itemDOO;
    }

    public Dotaznik getDotaznikProjektu() {
        return dotaznikProjektu;
    }

    public void setDotaznikProjektu(Dotaznik dotaznikProjektu) {
        this.dotaznikProjektu = dotaznikProjektu;
    }


    ///////////////////TEST FUNKCI ZDA TO VYRESI PROBLEM/////////////
    public void addToDOO(DotazOtazOdpo dotazOtazOdpo) {
        itemDOO.add(dotazOtazOdpo);
    }

    public void removeFromDOO(DotazOtazOdpo dotazOtazOdpo) {
        itemDOO.remove(dotazOtazOdpo);
    }

    public void addtoRisk(UzivProjektRiziko uzivProjektRiziko) {
        itemUzProjRiz.add(uzivProjektRiziko);
    }

    public void removeRisk(UzivProjektRiziko uzivProjektRiziko) {
        itemUzProjRiz.remove(uzivProjektRiziko);
    }
}