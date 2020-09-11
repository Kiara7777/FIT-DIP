package vut.fit.dp.spravarizik.domain.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import vut.fit.dp.spravarizik.domain.DotazOtazOdpo;
import vut.fit.dp.spravarizik.domain.Dotaznik;
import vut.fit.dp.spravarizik.domain.DotaznikOtazka;

import java.io.IOException;
import java.util.List;

/**
 * Serializer pro objekt DotazOtazOdpo. Defaultni serializer zpusoboval, ze se generovani JSON objektu zacyklilo.
 * JSON OBJEKT bude ve tvaru:
 *     {
 *         "uzivatel": 1,
 *         "otazka": 2,
 *         "odpoved": 1,
 *     }
 *
 * @author Sara Skutova
 * */
public class DotazOtazOdpoSerializer extends StdSerializer<DotazOtazOdpo> {

    public DotazOtazOdpoSerializer() {
        this(null);
    }
    public DotazOtazOdpoSerializer(Class<DotazOtazOdpo> t) {
        super(t);
    }

    @Override
    public void serialize(DotazOtazOdpo dotazOtazOdpo, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        jgen.writeStartObject();
        jgen.writeNumberField("uzivatel", dotazOtazOdpo.getUzivatelDOO().getId());
        jgen.writeNumberField("otazka", dotazOtazOdpo.getOtazkaDOO().getId());
        jgen.writeNumberField("odpoved", dotazOtazOdpo.getOdpovedDOO().getId());
        jgen.writeEndObject();


    }
    
}
