package vut.fit.dp.spravarizik.domain.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import vut.fit.dp.spravarizik.domain.Role;
import vut.fit.dp.spravarizik.domain.Uzivatel;

import java.io.IOException;
import java.util.List;

/**
 * Serializer pro objekt role.
 * JSON OBJEKT bude ve tvaru:
 * {
 *     "id": 3,
 *     "nazev": "Projektový manažer",
 *     securityRole: 2,
 *     "uzivatele": [
 *         3
 *     ]
 * }
 * uzivatele je pole, ktere opsahuje id uzivatelu s danou roli
 *
 * @author Sara Skutova
 * */
public class RoleSerializer extends StdSerializer<Role> {

    public RoleSerializer() {
        this(null);
    }

    public RoleSerializer(Class<Role> t) {
        super(t);
    }

    @Override
    public void serialize(
            Role role, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        jgen.writeStartObject();
        jgen.writeNumberField("id", role.getId());
        jgen.writeStringField("nazev", role.getNazev());
        jgen.writeNumberField("securityRole", role.getSecurityRole().getId());
        jgen.writeArrayFieldStart("uzivatele");

        List<Uzivatel> uzivatelList = role.getUzivatele();
        for (Uzivatel uzivatel : uzivatelList) {
            jgen.writeNumber(uzivatel.getId());
        }

        jgen.writeEndArray();
        jgen.writeEndObject();
    }
}
