package vut.fit.dp.spravarizik.domain.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import vut.fit.dp.spravarizik.domain.Projekt;

import java.io.IOException;

/**
 * Serializer pro objekt projektu. Vyuziva defaultni serializer pro objekt SWOT. Ten nezpusobuje zacykleni protoze ma v
 * definici entity aby se dane pole s id projektu pri serializaci ignorovalo
 * JSON OBJEKT bude ve tvaru:
 *     {
 *         "id": 1,
 *         "nazev": "Informační systém",
 *         "popis": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
 *         "start": "2019-05-01",
 *         "konec": "2020-05-01",
 *         "aktivni": false,
 *         "swot": {
 *             "id": 1,
 *             "silne": "Dlouhodobé vztahy se zákazníky, Výborná technická vybavenost",
 *             "slabe": "Poškozená značka, Slabá reputace",
 *             "prilezitosti": "Spolupráce s partnery na vývoji, Nové trhy – expanze do zahraničí",
 *             "hrozby": "Posílení konkurence, Cenové války s konkurencí"
 *         }
 *     },
 *
 *  @author Sara Skutova
 * */
public class ProjektSerializer extends StdSerializer<Projekt> {

    public ProjektSerializer() {
        this(null);
    }
    public ProjektSerializer(Class<Projekt> t) {
        super(t);
    }

    @Override
    public void serialize(Projekt projekt, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        jgen.writeStartObject();
        jgen.writeNumberField("id", projekt.getId());
        jgen.writeStringField("nazev", projekt.getNazev());
        jgen.writeStringField("popis", projekt.getPopis());
        jgen.writeStringField("start", projekt.getStart().toString());
        //jgen.writeStringField("predpoklKonec", projekt.getPredpoklKonec().toString());
        jgen.writeStringField("konec", projekt.getKonec().toString());
        jgen.writeBooleanField("aktivni", projekt.isAktivni());
        provider.defaultSerializeField("swot", projekt.getSwot(), jgen);
        provider.defaultSerializeField("dotaznikProjektu", projekt.getDotaznikProjektu(), jgen);
/*
        if(projekt.getKonec() == null)
            jgen.writeStringField("konec", "");
        else
            jgen.writeStringField("konec", projekt.getKonec().toString());
        jgen.writeArrayFieldStart("swots");

        List<SWOT> swots = projekt.getSwots();
        for(SWOT swot : swots){
            jgen.writeNumber(swot.getId());
        }

        jgen.writeEndArray();

 */
        jgen.writeEndObject();


    }
}
