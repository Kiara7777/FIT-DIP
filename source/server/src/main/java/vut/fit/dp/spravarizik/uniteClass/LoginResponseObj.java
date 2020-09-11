package vut.fit.dp.spravarizik.uniteClass;

/**
 * Objekt s daty o aktulane prihlasenem uzivateli, posila se zpet pri uspesnem loginu
 *
 * @author Sara Skutova
 * */
public class LoginResponseObj {
    private long id;
    private String secRole;

    public LoginResponseObj(long id, String secRole) {
        this.id = id;
        this.secRole = secRole;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getSecRole() {
        return secRole;
    }

    public void setSecRole(String secRole) {
        this.secRole = secRole;
    }
}
