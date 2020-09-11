package vut.fit.dp.spravarizik.domain;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import vut.fit.dp.spravarizik.domain.serializer.RoleSerializer;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

/**
 * Datova trida pro roli uzivatele, predstavuje tabulku role
 * @author Sara Skutova
 */
@JsonSerialize(using = RoleSerializer.class)
@Entity(name = "role")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Role")
public class Role {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_role", unique = true)
    private long id;

    @NotBlank(message = "Název role musí být zadán")
    @Column(name = "nazev")
    private String nazev;

/*    @Column(name = "sec_role")
    private String secRole;*/

    //seznam uzivatelu co maji danou roli
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Uzivatel> uzivatele = new ArrayList<Uzivatel>();

    //odkaz na bezpecnostni roli
    @ManyToOne
    @JoinColumn(name = "fk_bezp_role", nullable = false)
    private BezpRole securityRole;


    /**
     * Zakladni konstruktor
     */
    public Role() {
    }



    /**
     * Getter pro id
     * @return Identifikator, primarni klic, PK
     */
    public long getId() {
        return id;
    }

    @JsonIgnore
    public String getIdString() {
        return Long.toString(id);
    }

    /**
     * Setter pro id
     * @param id Identifikator, primarni klic, PK, ktery se ma nastavit
     */
    public void setId(long id) {
        this.id = id;
    }

    /**
     * Getter pro nazev role
     * @return Nazev role
     */
    public String getNazev() {
        return nazev;
    }

    /**
     * Setter pro nazev role
     * @param nazev Nazev role, ktera se ma nastavit
     */
    public void setNazev(String nazev) {
        this.nazev = nazev;
    }


/*
    public String getSecRole() {
        return secRole;
    }

    public void setSecRole(String secRole) {
        this.secRole = secRole;
    }
*/

    public List<Uzivatel> getUzivatele() {
        return uzivatele;
    }

    public void setUzivatele(List<Uzivatel> items) {
        this.uzivatele = items;
    }

    public BezpRole getSecurityRole() {
        return securityRole;
    }

    public void setSecurityRole(BezpRole securityRole) {
        this.securityRole = securityRole;
    }
}
