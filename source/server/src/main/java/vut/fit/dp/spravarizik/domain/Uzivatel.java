package vut.fit.dp.spravarizik.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.serializer.UzivatelSerializer;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

import static javax.persistence.GenerationType.IDENTITY;

/**
 * Datova trida pro uzivatele, predstavuje tabulku uzivatel
 * @author Sara Skutova
 */
@JsonSerialize(using = UzivatelSerializer.class)
@Entity(name = "uzivatel")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Uzivatel")
public class Uzivatel {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_uziv", unique = true, nullable = false)
    private long id;

    @NotBlank(message = "Uživatel musí mít zadaný login")
    @Column(name = "login")
    private String login;

    @NotBlank(message = "Uživatel musí mít zadáne heslo")
    @Column(name = "passwd")
    private String passwd;

    @NotBlank(message = "Uživatel musí mít zadán email")
    @Email(message = "Neplatý formát emailu")
    @Column(name = "email")
    private String email;

    @NotBlank(message = "Uživatel musí mít zadáne jméno")
    @Column(name = "nazev")
    private String nazev;

    //odkaz na roli, kterou dany uzivatel ma
    @ManyToOne
    @JoinColumn(name = "fk_role", nullable = false)
    private Role role;

    //seznam, spojuje uzivatele a projekt, urcuje kdo na projektu pracuje/pracoval
    @OneToMany (mappedBy = "uzivatel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UzivProjekt> uzivProj = new ArrayList<UzivProjekt>();

    //seznam, spojuje uzivatele, projekt a riziko, prideleni rizika k projektu a take kdo ma dane riziko na starosti
    @OneToMany (mappedBy = "idUzivatelR", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UzivProjektRiziko> itemUzProjRiz = new ArrayList<UzivProjektRiziko>();

    //TODO predelat
    @OneToMany (mappedBy = "uzivatelDOO", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DotazOtazOdpo> itemDOO = new ArrayList<DotazOtazOdpo>();

    public Uzivatel() {
    }

    //////////////// GETTERS a SETTERS pro vsechny atributy ////////////////
    public long getId() {
        return id;
    }

    public String getIdString() {
        return Long.toString(id);
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNazev() {
        return nazev;
    }

    public void setNazev(String nazev) {
        this.nazev = nazev;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }


    public List<UzivProjekt> getUzivProj() {
        return uzivProj;
    }

    public void setUzivProj(List<UzivProjekt> item) {
        this.uzivProj = item;
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
}
