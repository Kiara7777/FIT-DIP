package vut.fit.dp.spravarizik.domain.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import vut.fit.dp.spravarizik.domain.Dotaznik;
import vut.fit.dp.spravarizik.domain.DotaznikOtazka;
import vut.fit.dp.spravarizik.domain.Projekt;

import java.io.IOException;
import java.util.List;

/**
 * Serializer pro objekt Dotazniku. Defaultni serializer zpusoboval, ze se generovani JSON objektu zacyklilo.
 * JSON OBJEKT bude ve tvaru:
 *     {
 *         "id": 1,
 *         "nazev": "Test",
 *         "popis": "Dotaznik tykajici se neceho,
 *         "otazky": [viz. serializer otazek]
 *     }
 *
 * @author Sara Skutova
 * */
public class DotaznikSerializer extends StdSerializer<Dotaznik> {

    public DotaznikSerializer() {
        this(null);
    }
    public DotaznikSerializer(Class<Dotaznik> t) {
        super(t);
    }

    @Override
    public void serialize(Dotaznik dotaznik, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        jgen.writeStartObject();
        jgen.writeNumberField("id", dotaznik.getId());
        jgen.writeStringField("nazev", dotaznik.getNazev());
        jgen.writeStringField("popis", dotaznik.getPopis());
        jgen.writeArrayFieldStart("otazky");

        List<DotaznikOtazka> dotaznikOtazkaList = dotaznik.getOtazky();

        for (DotaznikOtazka dotaznikOtazka : dotaznikOtazkaList) {
            provider.defaultSerializeValue(dotaznikOtazka.getOtazkaDotazniku(), jgen);
        }

        jgen.writeEndArray();
        jgen.writeEndObject();


    }
}
