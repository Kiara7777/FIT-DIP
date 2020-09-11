package vut.fit.dp.spravarizik.domain;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

import static javax.persistence.GenerationType.IDENTITY;

/**
 * Datova trida pro bezpecnostni roli uzivatele, predstavuje tabulku SecRole
 *  V systemu budou zatim pouze tri bezpecnostni role - user, manager, admin
 *
 *  @author Sara Skutova
 */
@Entity(name = "bezprole")         // Jméno entity se používá při dotazovaní do DB
@Table(name = "Bezp_Role")
public class BezpRole {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_bezpRole", unique = true)
    private long id;

    @NotBlank(message = "Název bezpecnostni role musí být zadán")
    @Column(name = "nazev")
    private String nazev;

    //seznam roli co maji prirazenou danou bezpecnostni roli
    @OneToMany(mappedBy = "securityRole", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Role> roles = new ArrayList<Role>();

    public BezpRole() {
    }

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

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }
}
