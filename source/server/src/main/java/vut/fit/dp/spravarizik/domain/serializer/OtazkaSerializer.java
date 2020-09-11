package vut.fit.dp.spravarizik.domain.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import vut.fit.dp.spravarizik.domain.Otazka;
import vut.fit.dp.spravarizik.domain.OtazkaOdpovedi;

import java.io.IOException;
import java.util.List;
/**
 * Serializer pro objekt Otazka. Defaultni serializer zpusoboval, ze se generovani JSON objektu zacyklilo.
 * JSON OBJEKT bude ve tvaru:
         {
             "id": 1,
             "textOtazky": "Je cílový uživatel dostatečně zapojen do rozvoje projektu",
             "oblastOtazky": {
                 "id": 3,
                 "nazev": "Zainteresované strany"
             },
             "odpovedi": [
                 {
                     "id": 1,
                     "textOdpovedi": "Ano",
                     "poradi": 1
                 },
                 {
                     "id": 2,
                     "textOdpovedi": "Ne",
                     "poradi": 2
                 }
             ]
         }
 * @author Sara Skutova
 * */
public class OtazkaSerializer extends StdSerializer<Otazka> {

    public OtazkaSerializer() {
        this(null);
    }

    public OtazkaSerializer(Class<Otazka> t) {
        super(t);
    }

    @Override
    public void serialize(Otazka otazka, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        jgen.writeStartObject();
        jgen.writeNumberField("id", otazka.getId());
        jgen.writeStringField("textOtazky", otazka.getTextOtazky());
        provider.defaultSerializeField("oblastOtazky", otazka.getOblastOtazky(), jgen);

        jgen.writeArrayFieldStart("odpovedi");

        List<OtazkaOdpovedi> odpovedi = otazka.getOdpovedi();
        for (OtazkaOdpovedi odpoved : odpovedi) {
            jgen.writeStartObject();
            jgen.writeNumberField("id", odpoved.getOdpoved().getId());
            jgen.writeStringField("textOdpovedi", odpoved.getOdpoved().getTextOdpovedi());
            jgen.writeNumberField("poradi", odpoved.getPoradi());
            jgen.writeEndObject();
        }

        jgen.writeEndArray();
        jgen.writeEndObject();
    }
}
