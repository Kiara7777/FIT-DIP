package vut.fit.dp.spravarizik.uniteClass;

import java.util.Date;

/**
 * Predstavuje kartu s informacemi o projektu na pkerem pracuje/pracoval dany uzivatel.
 *
 * @author Sara Skutova
 * */
public class ProjectOfUser {
    private long id;
    private String name;
    private Date date;
    private boolean active;

    public ProjectOfUser(long id, String name, Date date, boolean active) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.active = active;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
