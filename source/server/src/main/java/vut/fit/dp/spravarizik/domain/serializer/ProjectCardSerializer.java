package vut.fit.dp.spravarizik.domain.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import vut.fit.dp.spravarizik.uniteClass.ProjectCard;

import java.io.IOException;

/**
 * Serializer pro specialni objekt karty projektu. Toto neni trida/entita, ktera se uklada do databaze. Jedna se spojovaci
 * tridu mezi projektem a prirazenym vedoucim (ten se ziska ze tridy UzivProjekt). Pouziva se pro zobrazeni karet projektu,
 * at se nemusi zasilat nekolik dotazu na API, ale staci pouze jeden.
 * JSON OBJEKT bude ve tvaru:
 *    {
 *         "id": 1,
 *         "nazev": "Informační systém",
 *         "popis": "Lorem ipsum dolor sit amet...
 *         "aktivni": false,
 *         "vedouci": "VEdouci MAna"
 *     },
 *  @author Sara Skutova
 * */
public class ProjectCardSerializer extends StdSerializer<ProjectCard> {

    public ProjectCardSerializer() {
        this(null);
    }
    public ProjectCardSerializer(Class<ProjectCard> t) {
        super(t);
    }

    @Override
    public void serialize(ProjectCard projectCard, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        jgen.writeStartObject();
        jgen.writeNumberField("id", projectCard.getProjectId());
        jgen.writeStringField("nazev", projectCard.getProjectName());
        jgen.writeStringField("popis", projectCard.getProjectDescript());
        jgen.writeBooleanField("aktivni", projectCard.isActive());
        jgen.writeStringField("vedouci", projectCard.getManagerName());
        jgen.writeEndObject();
    }
}
