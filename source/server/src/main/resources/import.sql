INSERT INTO Bezp_Role(nazev) VALUES
    ('USER'),
    ('MANAGER'),
    ('ADMIN');

INSERT INTO Role(nazev, fk_bezp_role) VALUES
    ('Nepřiřazeno', 1),
    ('Člen týmu', 1),
    ('Projektový manažer', 2),
    ('Projektový administrátor', 3);

INSERT INTO Uzivatel(login, passwd, nazev, email, fk_role) VALUES
    ('xlaris00', '123', 'Diana Laris', 'xlaris00@email.com', 2),
    ('xnovak00', '123', 'Casper Novak', 'xnovak00@email.com', 2),
    ('xriger00', 'abc', 'Alan Riger', 'xstast00@email.com', 3),
    ('xhodso00', 'abc', 'Bianca Hodson', 'xhodso00@email.com', 3),
    ('xlogin00', 'qwe', 'Login Login', 'xlogin00@email.com', 4);

INSERT INTO Dotaznik(nazev, popis) VALUES
    ('Dotazník 1','Obecný dotazník k projektu. Obsahuje základní obecné otázky.'),
    ('Dotazník 2','Dotazník k zjištění možných rizik týkajících se zainteresovaných stran a financí.');


INSERT INTO Projekt(nazev, popis, start, konec, aktivni, fk_dotaznik) VALUES
    ('Informační systém', 'Projekt obecného informačního systému. Má za cíl pomoct k vývoji tohoto nástroje a loužit jako výplň dat. Tento popis je toho příkladem. Pokud by se zde zkopírovalo Lorem ipsum na více než 11 řádků, tak by se další řádky schovaly a na posledním řádku by se zobrazily tyto tři tečky …, ale toto nemá 11 řádků. Možná když se obrazovka zmenší. ', '2019-05-01', '2020-05-01', false, 1),
    ('Podpůrný nástroj pro řízení rizik v projektu', 'Tento projekt zhruba představuje diplomovou práci, se kterou se svázán. Tento projekt, dle dohody se zákazníkem, má nejvyšší prioritu řešení.', '2019-11-01', '2020-06-03', true, null);

INSERT INTO SWOT (silne, slabe, prilezitosti, hrozby, projekt_id_proj) VALUES
    ('Dlouhodobé vztahy se zákazníky, Výborná technická vybavenost', 'Poškozená značka, Slabá reputace', 'Spolupráce s partnery na vývoji, Nové trhy – expanze do zahraničí', 'Posílení konkurence, Cenové války s konkurencí', 1);

INSERT INTO Uziv_Projekt(id_proj, id_uziv, vedouci, datum_zacatku, datum_ukonceni, aktivni) VALUES
    (1, 1, false, '2019-05-01', NULL, true),
    (1, 2, false, '2019-05-01', NULL, true),
    (1, 3, true, '2019-05-01', NULL, true),
    (2, 4, true, '2019-11-01', NULL, true);

INSERT INTO Kategorie(nazev, popis) VALUES
    ('Nezařazeno', 'Kategorie pro rizika, která nemají vyznačenou kategorii'),
    ('Obchod', 'Rizika vyplývající z ekonomických podmínek na trzích'),
    ('Finance', 'Rizika týkající se finanční stránky projektu, hlavně pak rozpočtu'),
    ('Technologie', 'Rizika týkající se použitých technologií při tvorbě projektu'),
    ('Kvalita', 'Rizika týkající se kvality výsledných pracovních aktivit na projektu'),
    ('Rozvrh', 'Rizika týkající se časového naplánování projektu'),
    ('Komuninace', 'Rizika týkající se komunikace mezi různými zainteresovanými stranami projektu'),
    ('Zaměstnanci', 'Rizika týkající se zaměstnanců společnosti');


INSERT INTO Registr_Rizik(nazev, popis, mozne_reseni, fk_kategorie) VALUES
    ('Překročení rozpočtu', 'Překročí se naplánovaný rozpočet', '', 3),
    ('Nepodržení termínu dodání', 'Projekt se nedokončí a neodevzdá v dohodnutém termínu', '', 6),
    ('Nízká výsledná kvalita', 'Zákazník nepřevzal projekt z důvodů nedostatečné kvality', 'Průběžná konzultace projektu se zákazníkem', 5),
    ('Špatná komunikace se zákazníkem', 'Komunikace se zákazníkem je nedostatečná, může vést k nepřesnostem na návrhu či snížené kvalitě', 'Vytvořit komunikační kanály nebo pověřit osobu k přímé komunikaci', 7),
    ('Nedostatečná pracovní aktivita zaměstnance', 'Zaměstnanec neodvádí dostatečnou pracovní aktivitu, může vést ke zpoždění projektu', 'Pravidelná komunikace se zaměstnanc', 8),
    ('Neznalost technologií', 'Vývojář plně nezná použité technologie, může se podepsat na zpoždění či kvalitě', '', 4),
    ('Pandemie infekční nemoci', 'Po světě se šíří nová nemoc, může mít vliv na všechny aspekty projektu', '', 1),
    ('Hlavní finanční akcionář zkrachoval', 'Hlavní poskytovatel financí zkrachoval, může ovlivnit všechny aktuálně běžící projekty', 'Mít zajištěné finanční rezervy či vytvořený finanční krizový plán', 3),
    ('Nefunkční program', 'Výsledný program je nefunkční na zákazníkových strojích', 'Při vývoji průběžně zjišťovat funkčnost na strojích zákazníka', 4),
    ('Změna vedení firmy', 'Ve společnosti se změní vedení, možné pozdržení projektu či jeho plné ukončení', '', 1);

INSERT INTO Uziv_Projekt_Riziko(id_proj, id_uziv, id_riziko, stav, pravdepodobnost, dopad, popis_dopadu, plan_reseni, priorita) VALUES
    (1, 3, 1, 1, 2, 5, 'Na projekt se musí vynaložit větší množství prostředků. Může negativně ovlivint vztahy se zadavetelem.', 'Vhodně odhadnout realné náklady. Průběžně komunikovat se zadavatelem', 3),
    (1, 2, 3, 3, 1, 5, 'Projekt nebude převzat. Může negativně ovlivni vztah se zákazníkem. Může zvýžit náklady. Může způsobit zpoždění dodání.', 'Průběžná konzultace projektu se zákazníkem', 2),
    (1, 1, 4, 2, 3, 3, 'Zpoždění projektu, nespokojenost zákazníka, napomenutí zaměstnance', 'Napomenou zaměstnance, domluvit přesčasy na nadrobení zameškané práce', 1);


INSERT INTO Odpoved(text_odpovedi) VALUES
    ('Ano'),
    ('Ne'),
    ('Možná'),
    ('Nevím');

INSERT INTO Oblast_Otazky(nazev) VALUES
    ('Finance'),
    ('Zaměstnanci'),
    ('Zainteresované strany'),
    ('Rozvrh'),
    ('Technologie');


INSERT INTO Otazka(text_otazky, fk_oblasti) VALUES
    ('Je cílový uživatel dostatečně zapojen do vývoje projektu?', 3),
    ('Zpracovávají rizika zkušení zaměstnanci?', 2),
    ('Používají se na projektu nové technologie?', 5),
    ('Je zadavatel obeznámen s riziky na projektu?', 3),
    ('Bylo na identifikaci a analýzu rizik dostatečně času?', 4),
    ('Zdá se Vám, že někteří zaměstnanci neodvádějí svou práci?', 2),
    ('Byla alespoň nějaká část vyvíjeného programu představena zákazníkovi?', 3),
    ('Rozumíte plně používaným technologiím?', 5),
    ('Myslíte si, že projekt je dostatečně financován?', 1),
    ('Existuje krizový plán v případku výskytu finančních problémů?', 1);

INSERT INTO Otazka_Odpovedi(id_otazky, id_odpovedi, poradi) VALUES
    (1, 1, 1),
    (1, 2, 2),
    (2, 1, 1),
    (2, 2, 2),
    (3, 1, 1),
    (3, 2, 2),
    (4, 1, 1),
    (4, 2, 2),
    (5, 1, 1),
    (5, 2, 2),
    (6, 1, 1),
    (6, 2, 2),
    (6, 4, 3),
    (7, 1, 1),
    (7, 2, 2),
    (7, 4, 3),
    (8, 1, 1),
    (8, 2, 2),
    (8, 3, 3),
    (8, 4, 4),
    (9, 1, 1),
    (9, 2, 2),
    (9, 4, 3),
    (10, 1, 1),
    (10, 2, 2);


INSERT INTO Dotaznik_Otazka(id_otazky, id_dotazniku, poradi) VALUES
    (1, 1, 1),
    (5, 1, 2),
    (3, 1, 3),
    (2, 1, 4),
    (8, 1, 5),
    (1, 2, 1),
    (4, 2, 2),
    (7, 2, 3),
    (9, 2, 4),
    (10, 2, 5);

INSERT INTO Dotaz_Otaz_Odpo(id_proj, id_uziv, id_dotaz, id_otazka, id_odpoved) VALUES
    (1, 1, 1, 1, 1),
    (1, 1, 1, 5, 2),
    (1, 1, 1, 3, 1),
    (1, 1, 1, 2, 2),
    (1, 1, 1, 8, 3),
    (1, 2, 1, 1, 1),
    (1, 2, 1, 5, 1),
    (1, 2, 1, 3, 2),
    (1, 2, 1, 2, 2),
    (1, 2, 1, 8, 1),
    (1, 3, 1, 1, 1),
    (1, 3, 1, 5, 1),
    (1, 3, 1, 3, 1),
    (1, 3, 1, 2, 2),
    (1, 3, 1, 8, 2);
