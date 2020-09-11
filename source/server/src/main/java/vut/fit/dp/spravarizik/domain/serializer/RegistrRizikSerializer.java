package vut.fit.dp.spravarizik.domain.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import vut.fit.dp.spravarizik.domain.RegistrRizik;

import java.io.IOException;

/**
 * Serializer pro objekt rizika v registru rizik.
 * JSON OBJEKT bude ve tvaru:
 * {
 *     "id": 2,
 *     "nazev": "Nepodržení termínu dodání",
 *     "popis": "Projekt se nedokončí a neodevzdá v dohodnutém termínu",
 *     "mozneReseni": "",
 *     "projekty": 0,
 *     "kategorie": 6
 * }
 *
 * projekty urcuji v kolika projektech je dane riziko prideleno - jde o pocet zaznamu v tabulce UzivProjektRiziko k danemu riziku
 * kategorie je id kategorie ke ktere je dane riziko prideleno
 *
 * @author Sara Skutova
 * */
public class RegistrRizikSerializer extends StdSerializer<RegistrRizik> {

    public RegistrRizikSerializer() {
        this(null);
    }

    public RegistrRizikSerializer(Class<RegistrRizik> t) {
        super(t);
    }

    @Override
    public void serialize(
            RegistrRizik registrRizik, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        jgen.writeStartObject();
        jgen.writeNumberField("id", registrRizik.getId());
        jgen.writeStringField("nazev", registrRizik.getNazev());
        jgen.writeStringField("popis", registrRizik.getPopis());
        jgen.writeStringField("mozneReseni", registrRizik.getMozneReseni());
        jgen.writeNumberField("projekty", registrRizik.getItemUzProjRiz().size());
        jgen.writeNumberField("kategorie", registrRizik.getKategorie().getId());
        jgen.writeEndObject();
    }
}
