package vut.fit.dp.spravarizik.domain.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import vut.fit.dp.spravarizik.domain.Uzivatel;

import java.io.IOException;

/**
 * Serializer pro objekt uzivatele
 * JSON OBJEKT bude ve tvaru:
 * {
 *     "id": 2,
 *     "login": "xblast03",
 *     "passwd": "123",
 *     "email": "xblast00@email.com",
 *     "nazev": "Blast Brother",
 *     "role": 2
 * }
 * role obsahuje id role, kterou ma dany uzivatele pridelenou
 *
 * @author Sara Skutova
 * */
public class UzivatelSerializer extends StdSerializer<Uzivatel> {

    public UzivatelSerializer() {
        this(null);
    }

    public UzivatelSerializer(Class<Uzivatel> t) {
        super(t);
    }

    @Override
    public void serialize(
            Uzivatel uzivatel, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        jgen.writeStartObject();
        jgen.writeNumberField("id", uzivatel.getId());
        jgen.writeStringField("login", uzivatel.getLogin());
        jgen.writeStringField("passwd", uzivatel.getPasswd());
        jgen.writeStringField("email", uzivatel.getEmail());
        jgen.writeStringField("nazev", uzivatel.getNazev());
        jgen.writeNumberField("role", uzivatel.getRole().getId());
        jgen.writeStringField("bezpRole", uzivatel.getRole().getSecurityRole().getNazev());
        jgen.writeEndObject();
    }
}
