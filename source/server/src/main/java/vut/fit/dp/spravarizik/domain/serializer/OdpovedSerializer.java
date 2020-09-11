package vut.fit.dp.spravarizik.domain.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import vut.fit.dp.spravarizik.domain.Odpoved;
import vut.fit.dp.spravarizik.domain.Role;

import java.io.IOException;

/**
 * Serializer pro objekt Odpoved. Defaultni serializer zpusoboval, ze se generovani JSON objektu zacyklilo.
 * JSON OBJEKT bude ve tvaru:
 *     {
 *         "id": 1,
 *         "textOdpovedi": "OdpovedA"
 *     }
 * @author Sara Skutova
 * */
public class OdpovedSerializer extends StdSerializer<Odpoved> {


    public OdpovedSerializer() {
        this(null);
    }

    public OdpovedSerializer(Class<Odpoved> t) {
        super(t);
    }

    @Override
    public void serialize(Odpoved odpoved, JsonGenerator jgen, SerializerProvider provider) throws IOException {

        jgen.writeStartObject();
        jgen.writeNumberField("id", odpoved.getId());
        jgen.writeStringField("textOdpovedi", odpoved.getTextOdpovedi());
        jgen.writeEndObject();
    }
}
