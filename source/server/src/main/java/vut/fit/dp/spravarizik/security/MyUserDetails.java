package vut.fit.dp.spravarizik.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import vut.fit.dp.spravarizik.domain.Uzivatel;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

/**
 * Vlastni implementace objektu pomoci ktereho Spring provadi autentizaci uzivatele.
 * Zaroven si toto Spring uschovava jako udaje o aktualne prihlasenem uzivateli.
 *
 * @author Sara Skutova
 * */
public class MyUserDetails implements UserDetails {

    private long id;
    private String password;
    private String userName;
    private boolean active;
    private String secRole;
    private List<GrantedAuthority> authorityList;


    MyUserDetails(Uzivatel uzivatel) {
        this.id = uzivatel.getId();
        this.userName = uzivatel.getLogin();
        this.password = uzivatel.getPasswd();
        this.active = true;
        this.secRole = uzivatel.getRole().getSecurityRole().getNazev();
        //this.authorityList = Arrays.asList(new SimpleGrantedAuthority("TEST"));
    }

/*    private List<String> createProjectAuthority(Uzivatel uzivatel) {
        List<String> auth = new ArrayList<>();

        if (uzivatel.getRole().getSecurityRole().getNazev() == "ADMIN" || uzivatel.getRole().getSecurityRole().getNazev() == "MANAGER")
            auth.add("Any");
        else {
            auth.add("Any1");
        }

        return auth;
    }*/

    public long getId() {return id;}

    public String getSecRole() {
        return secRole;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorityList;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
