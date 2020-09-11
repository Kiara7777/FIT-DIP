package vut.fit.dp.spravarizik.domain.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import vut.fit.dp.spravarizik.domain.Kategorie;
import vut.fit.dp.spravarizik.domain.OblastOtazky;

import java.io.IOException;

/**
 * Serializer pro objekt OblastOtazky. Defaultni serializer zpusoboval, ze se generovani JSON objektu zacyklilo.
 * JSON OBJEKT bude ve tvaru:
 *     {
 *         "id": 1,
 *         "nazev": "Nezařazeno"
 *     }
 * @author Sara Skutova
 * */
public class OblastOtazkySerializer extends StdSerializer<OblastOtazky> {

    public OblastOtazkySerializer() {
        this(null);
    }

    public OblastOtazkySerializer(Class<OblastOtazky> t) {
        super(t);
    }

    @Override
    public void serialize(
            OblastOtazky oblastOtazky, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        jgen.writeStartObject();
        jgen.writeNumberField("id", oblastOtazky.getId());
        jgen.writeStringField("nazev", oblastOtazky.getNazev());
        jgen.writeEndObject();
    }

}
