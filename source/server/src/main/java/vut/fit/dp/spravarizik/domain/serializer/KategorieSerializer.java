package vut.fit.dp.spravarizik.domain.serializer;


import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import vut.fit.dp.spravarizik.domain.Kategorie;
import vut.fit.dp.spravarizik.domain.RegistrRizik;
import vut.fit.dp.spravarizik.domain.Uzivatel;

import java.io.IOException;
import java.util.List;

/**
 * Serializer pro objekt Kategorie. Defaultni serializer zpusoboval, ze se generovani JSON objektu zacyklilo.
 * JSON OBJEKT bude ve tvaru:
 *     {
 *         "id": 1,
 *         "nazev": "Nezařazeno",
 *         "popis": "Kategorie pro rizika, která nemají vyznačenou kategoriit",
 *         "rizika": [
 *             1
 *         ]
 *     }
 *     rizika je pole id rizik, ktere maji danou kategorii
 *
 * @author Sara Skutova
 * */
public class KategorieSerializer extends StdSerializer<Kategorie> {


    public KategorieSerializer() {
        this(null);
    }

    public KategorieSerializer(Class<Kategorie> t) {
        super(t);
    }

    @Override
    public void serialize(
            Kategorie kategorie, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        jgen.writeStartObject();
        jgen.writeNumberField("id", kategorie.getId());
        jgen.writeStringField("nazev", kategorie.getNazev());
        jgen.writeStringField("popis", kategorie.getPopis());
        jgen.writeArrayFieldStart("rizika");

        List<RegistrRizik> registrRiziks = kategorie.getRizika();
        for (RegistrRizik riziko : registrRiziks) {
            jgen.writeNumber(riziko.getId());
        }

        jgen.writeEndArray();
        jgen.writeEndObject();
    }


}
