/**
 * Ecclesiastical-Latin vocabulary data.
 *
 * Extracted verbatim from the source flashcard app `latin-learner.html`
 * (the `VOCABULARY` array). The source stores each word as
 * `{ c: category, l: latin, e: english, p: pronunciation }`. Categories are
 * surfaced here as learning units. Latin spelling, English meanings and the
 * (Italian/Ecclesiastical) pronunciation hints are preserved exactly.
 *
 * No external imports; `strict`-compatible.
 */

export interface VocabCard {
  id: string;
  latin: string;           // Latin word or phrase, exact source spelling
  english: string;         // English meaning / gloss
  grammar?: string;        // part of speech / thematic class
  example?: string;        // example phrase (present for the Phrases unit)
  exampleEn?: string;      // English gloss of the example
  pronunciation?: string;  // Ecclesiastical pronunciation hint from the source
  unitId: string;
}

export interface VocabUnit {
  id: string;
  title: string;           // e.g. "Unit III · People & Roles"
  cards: VocabCard[];
}

export const VOCAB_UNITS: VocabUnit[] = [
  {
    id: "liturgical",
    title: "Unit I · Liturgical & Mass Words",
    cards: [
    { id: "liturgical-01", latin: "Dominus", english: "Lord", grammar: "Noun · Liturgical", pronunciation: "DOH-mee-noos", unitId: "liturgical" },
    { id: "liturgical-02", latin: "Deus", english: "God", grammar: "Noun · Liturgical", pronunciation: "DEH-oos", unitId: "liturgical" },
    { id: "liturgical-03", latin: "Sanctus", english: "Holy", grammar: "Noun · Liturgical", pronunciation: "SAHNK-toos", unitId: "liturgical" },
    { id: "liturgical-04", latin: "Gloria", english: "Glory", grammar: "Noun · Liturgical", pronunciation: "GLOH-ree-ah", unitId: "liturgical" },
    { id: "liturgical-05", latin: "Pax", english: "Peace", grammar: "Noun · Liturgical", pronunciation: "PAHKS", unitId: "liturgical" },
    { id: "liturgical-06", latin: "Agnus", english: "Lamb", grammar: "Noun · Liturgical", pronunciation: "AHG-noos", unitId: "liturgical" },
    { id: "liturgical-07", latin: "Credo", english: "I believe", grammar: "Noun · Liturgical", pronunciation: "KREH-doh", unitId: "liturgical" },
    { id: "liturgical-08", latin: "Misericordia", english: "Mercy", grammar: "Noun · Liturgical", pronunciation: "mee-seh-ree-KOR-dee-ah", unitId: "liturgical" },
    { id: "liturgical-09", latin: "Resurrectio", english: "Resurrection", grammar: "Noun · Liturgical", pronunciation: "reh-soo-REK-tsee-oh", unitId: "liturgical" },
    { id: "liturgical-10", latin: "Eucharistia", english: "Eucharist / Thanksgiving", grammar: "Noun · Liturgical", pronunciation: "eh-oo-kah-REES-tee-ah", unitId: "liturgical" },
    { id: "liturgical-11", latin: "Missa", english: "Mass", grammar: "Noun · Liturgical", pronunciation: "MEES-sah", unitId: "liturgical" },
    { id: "liturgical-12", latin: "Evangelium", english: "Gospel", grammar: "Noun · Liturgical", pronunciation: "eh-vahn-JEH-lee-oom", unitId: "liturgical" },
    { id: "liturgical-13", latin: "Alleluia", english: "Praise the Lord", grammar: "Noun · Liturgical", pronunciation: "ah-leh-LOO-yah", unitId: "liturgical" },
    { id: "liturgical-14", latin: "Amen", english: "So be it / Truly", grammar: "Noun · Liturgical", pronunciation: "AH-mehn", unitId: "liturgical" },
    { id: "liturgical-15", latin: "Hosanna", english: "Save us / Praise", grammar: "Noun · Liturgical", pronunciation: "oh-ZAHN-nah", unitId: "liturgical" },
    { id: "liturgical-16", latin: "Communio", english: "Communion", grammar: "Noun · Liturgical", pronunciation: "kohm-MOO-nee-oh", unitId: "liturgical" },
    { id: "liturgical-17", latin: "Offertorium", english: "Offertory", grammar: "Noun · Liturgical", pronunciation: "ohf-fehr-TOH-ree-oom", unitId: "liturgical" },
    { id: "liturgical-18", latin: "Introitus", english: "Introit / Entrance", grammar: "Noun · Liturgical", pronunciation: "een-TROH-ee-toos", unitId: "liturgical" },
    { id: "liturgical-19", latin: "Benedictio", english: "Blessing", grammar: "Noun · Liturgical", pronunciation: "beh-neh-DEEK-tsee-oh", unitId: "liturgical" },
    { id: "liturgical-20", latin: "Lectio", english: "Reading / Lesson", grammar: "Noun · Liturgical", pronunciation: "LEK-tsee-oh", unitId: "liturgical" },
    { id: "liturgical-21", latin: "Homilia", english: "Homily", grammar: "Noun · Liturgical", pronunciation: "hoh-MEE-lee-ah", unitId: "liturgical" },
    { id: "liturgical-22", latin: "Psalmus", english: "Psalm", grammar: "Noun · Liturgical", pronunciation: "PSAHL-moos", unitId: "liturgical" },
    { id: "liturgical-23", latin: "Hymnus", english: "Hymn", grammar: "Noun · Liturgical", pronunciation: "HEEM-noos", unitId: "liturgical" }
    ],
  },
  {
    id: "sacraments",
    title: "Unit II · The Seven Sacraments",
    cards: [
    { id: "sacraments-01", latin: "Baptisma", english: "Baptism", grammar: "Noun · Sacrament", pronunciation: "bahp-TEES-mah", unitId: "sacraments" },
    { id: "sacraments-02", latin: "Confirmatio", english: "Confirmation", grammar: "Noun · Sacrament", pronunciation: "kohn-feer-MAH-tsee-oh", unitId: "sacraments" },
    { id: "sacraments-03", latin: "Paenitentia", english: "Penance / Confession", grammar: "Noun · Sacrament", pronunciation: "peh-nee-TEHN-tsee-ah", unitId: "sacraments" },
    { id: "sacraments-04", latin: "Matrimonium", english: "Marriage", grammar: "Noun · Sacrament", pronunciation: "mah-tree-MOH-nee-oom", unitId: "sacraments" },
    { id: "sacraments-05", latin: "Ordo", english: "Holy Orders", grammar: "Noun · Sacrament", pronunciation: "OR-doh", unitId: "sacraments" },
    { id: "sacraments-06", latin: "Unctio", english: "Anointing", grammar: "Noun · Sacrament", pronunciation: "OOHNK-tsee-oh", unitId: "sacraments" },
    { id: "sacraments-07", latin: "Absolutio", english: "Absolution", grammar: "Noun · Sacrament", pronunciation: "ahb-soh-LOO-tsee-oh", unitId: "sacraments" },
    { id: "sacraments-08", latin: "Gratia", english: "Grace", grammar: "Noun · Sacrament", pronunciation: "GRAH-tsee-ah", unitId: "sacraments" },
    { id: "sacraments-09", latin: "Peccatum", english: "Sin", grammar: "Noun · Sacrament", pronunciation: "pehk-KAH-toom", unitId: "sacraments" },
    { id: "sacraments-10", latin: "Indulgentia", english: "Indulgence", grammar: "Noun · Sacrament", pronunciation: "een-dool-JEHN-tsee-ah", unitId: "sacraments" }
    ],
  },
  {
    id: "people",
    title: "Unit III · People & Roles",
    cards: [
    { id: "people-01", latin: "Pater", english: "Father", grammar: "Noun", pronunciation: "PAH-tehr", unitId: "people" },
    { id: "people-02", latin: "Filius", english: "Son", grammar: "Noun", pronunciation: "FEE-lee-oos", unitId: "people" },
    { id: "people-03", latin: "Spiritus", english: "Spirit", grammar: "Noun", pronunciation: "SPEE-ree-toos", unitId: "people" },
    { id: "people-04", latin: "Maria", english: "Mary", grammar: "Noun", pronunciation: "mah-REE-ah", unitId: "people" },
    { id: "people-05", latin: "Mater", english: "Mother", grammar: "Noun", pronunciation: "MAH-tehr", unitId: "people" },
    { id: "people-06", latin: "Rex", english: "King", grammar: "Noun", pronunciation: "REHKS", unitId: "people" },
    { id: "people-07", latin: "Regina", english: "Queen", grammar: "Noun", pronunciation: "reh-JEE-nah", unitId: "people" },
    { id: "people-08", latin: "Populus", english: "People", grammar: "Noun", pronunciation: "POH-poo-loos", unitId: "people" },
    { id: "people-09", latin: "Sacerdos", english: "Priest", grammar: "Noun", pronunciation: "sah-CHEHR-dohs", unitId: "people" },
    { id: "people-10", latin: "Episcopus", english: "Bishop", grammar: "Noun", pronunciation: "eh-PEES-koh-poos", unitId: "people" },
    { id: "people-11", latin: "Papa", english: "Pope", grammar: "Noun", pronunciation: "PAH-pah", unitId: "people" },
    { id: "people-12", latin: "Diaconus", english: "Deacon", grammar: "Noun", pronunciation: "dee-AH-koh-noos", unitId: "people" },
    { id: "people-13", latin: "Apostolus", english: "Apostle", grammar: "Noun", pronunciation: "ah-POHS-toh-loos", unitId: "people" },
    { id: "people-14", latin: "Propheta", english: "Prophet", grammar: "Noun", pronunciation: "proh-FEH-tah", unitId: "people" },
    { id: "people-15", latin: "Martyr", english: "Martyr / Witness", grammar: "Noun", pronunciation: "MAHR-teer", unitId: "people" },
    { id: "people-16", latin: "Virgo", english: "Virgin", grammar: "Noun", pronunciation: "VEER-goh", unitId: "people" },
    { id: "people-17", latin: "Angelus", english: "Angel", grammar: "Noun", pronunciation: "AHN-jeh-loos", unitId: "people" },
    { id: "people-18", latin: "Frater", english: "Brother", grammar: "Noun", pronunciation: "FRAH-tehr", unitId: "people" },
    { id: "people-19", latin: "Soror", english: "Sister", grammar: "Noun", pronunciation: "SOH-rohr", unitId: "people" },
    { id: "people-20", latin: "Servus", english: "Servant", grammar: "Noun", pronunciation: "SEHR-voos", unitId: "people" },
    { id: "people-21", latin: "Pastor", english: "Shepherd / Pastor", grammar: "Noun", pronunciation: "PAHS-tohr", unitId: "people" },
    { id: "people-22", latin: "Homo", english: "Man / Human", grammar: "Noun", pronunciation: "OH-moh", unitId: "people" }
    ],
  },
  {
    id: "verbs",
    title: "Unit IV · Verbs",
    cards: [
    { id: "verbs-01", latin: "Oremus", english: "Let us pray", grammar: "Verb", pronunciation: "oh-REH-moos", unitId: "verbs" },
    { id: "verbs-02", latin: "Laudate", english: "Praise (ye)", grammar: "Verb", pronunciation: "lau-DAH-teh", unitId: "verbs" },
    { id: "verbs-03", latin: "Benedicite", english: "Bless (ye)", grammar: "Verb", pronunciation: "beh-neh-DEE-chee-teh", unitId: "verbs" },
    { id: "verbs-04", latin: "Venite", english: "Come (ye)", grammar: "Verb", pronunciation: "veh-NEE-teh", unitId: "verbs" },
    { id: "verbs-05", latin: "Confiteor", english: "I confess", grammar: "Verb", pronunciation: "kohn-FEE-teh-or", unitId: "verbs" },
    { id: "verbs-06", latin: "Adoremus", english: "Let us adore", grammar: "Verb", pronunciation: "ah-doh-REH-moos", unitId: "verbs" },
    { id: "verbs-07", latin: "Amare", english: "To love", grammar: "Verb", pronunciation: "ah-MAH-reh", unitId: "verbs" },
    { id: "verbs-08", latin: "Credere", english: "To believe", grammar: "Verb", pronunciation: "KREH-deh-reh", unitId: "verbs" },
    { id: "verbs-09", latin: "Orare", english: "To pray", grammar: "Verb", pronunciation: "oh-RAH-reh", unitId: "verbs" },
    { id: "verbs-10", latin: "Cantare", english: "To sing", grammar: "Verb", pronunciation: "kahn-TAH-reh", unitId: "verbs" },
    { id: "verbs-11", latin: "Dare", english: "To give", grammar: "Verb", pronunciation: "DAH-reh", unitId: "verbs" },
    { id: "verbs-12", latin: "Videre", english: "To see", grammar: "Verb", pronunciation: "vee-DEH-reh", unitId: "verbs" },
    { id: "verbs-13", latin: "Audire", english: "To hear", grammar: "Verb", pronunciation: "au-DEE-reh", unitId: "verbs" },
    { id: "verbs-14", latin: "Scire", english: "To know", grammar: "Verb", pronunciation: "SHEE-reh", unitId: "verbs" },
    { id: "verbs-15", latin: "Facere", english: "To do / To make", grammar: "Verb", pronunciation: "FAH-cheh-reh", unitId: "verbs" },
    { id: "verbs-16", latin: "Dicere", english: "To say / To speak", grammar: "Verb", pronunciation: "DEE-cheh-reh", unitId: "verbs" },
    { id: "verbs-17", latin: "Venire", english: "To come", grammar: "Verb", pronunciation: "veh-NEE-reh", unitId: "verbs" },
    { id: "verbs-18", latin: "Ire", english: "To go", grammar: "Verb", pronunciation: "EE-reh", unitId: "verbs" },
    { id: "verbs-19", latin: "Esse", english: "To be", grammar: "Verb", pronunciation: "EHS-seh", unitId: "verbs" },
    { id: "verbs-20", latin: "Habere", english: "To have", grammar: "Verb", pronunciation: "ah-BEH-reh", unitId: "verbs" },
    { id: "verbs-21", latin: "Mittere", english: "To send", grammar: "Verb", pronunciation: "MEET-teh-reh", unitId: "verbs" },
    { id: "verbs-22", latin: "Docere", english: "To teach", grammar: "Verb", pronunciation: "doh-CHEH-reh", unitId: "verbs" },
    { id: "verbs-23", latin: "Legere", english: "To read", grammar: "Verb", pronunciation: "LEH-jeh-reh", unitId: "verbs" },
    { id: "verbs-24", latin: "Scribere", english: "To write", grammar: "Verb", pronunciation: "SKREE-beh-reh", unitId: "verbs" },
    { id: "verbs-25", latin: "Vivere", english: "To live", grammar: "Verb", pronunciation: "VEE-veh-reh", unitId: "verbs" },
    { id: "verbs-26", latin: "Mori", english: "To die", grammar: "Verb", pronunciation: "MOH-ree", unitId: "verbs" },
    { id: "verbs-27", latin: "Servire", english: "To serve", grammar: "Verb", pronunciation: "sehr-VEE-reh", unitId: "verbs" },
    { id: "verbs-28", latin: "Salvare", english: "To save", grammar: "Verb", pronunciation: "sahl-VAH-reh", unitId: "verbs" }
    ],
  },
  {
    id: "common",
    title: "Unit V · Common & Function Words",
    cards: [
    { id: "common-01", latin: "Et", english: "And", grammar: "Particle / Pronoun", pronunciation: "EHT", unitId: "common" },
    { id: "common-02", latin: "In", english: "In / Into", grammar: "Particle / Pronoun", pronunciation: "EEN", unitId: "common" },
    { id: "common-03", latin: "Non", english: "Not", grammar: "Particle / Pronoun", pronunciation: "NOHN", unitId: "common" },
    { id: "common-04", latin: "Est", english: "Is", grammar: "Particle / Pronoun", pronunciation: "EHST", unitId: "common" },
    { id: "common-05", latin: "Cum", english: "With", grammar: "Particle / Pronoun", pronunciation: "KOOM", unitId: "common" },
    { id: "common-06", latin: "Qui", english: "Who / Which", grammar: "Particle / Pronoun", pronunciation: "KWEE", unitId: "common" },
    { id: "common-07", latin: "Ad", english: "To / Toward", grammar: "Particle / Pronoun", pronunciation: "AHD", unitId: "common" },
    { id: "common-08", latin: "Per", english: "Through", grammar: "Particle / Pronoun", pronunciation: "PEHR", unitId: "common" },
    { id: "common-09", latin: "Sicut", english: "Just as", grammar: "Particle / Pronoun", pronunciation: "SEE-koot", unitId: "common" },
    { id: "common-10", latin: "Semper", english: "Always", grammar: "Particle / Pronoun", pronunciation: "SEHM-pehr", unitId: "common" },
    { id: "common-11", latin: "De", english: "About / From", grammar: "Particle / Pronoun", pronunciation: "DEH", unitId: "common" },
    { id: "common-12", latin: "Ex", english: "Out of / From", grammar: "Particle / Pronoun", pronunciation: "EHKS", unitId: "common" },
    { id: "common-13", latin: "Pro", english: "For / On behalf of", grammar: "Particle / Pronoun", pronunciation: "PROH", unitId: "common" },
    { id: "common-14", latin: "Sine", english: "Without", grammar: "Particle / Pronoun", pronunciation: "SEE-neh", unitId: "common" },
    { id: "common-15", latin: "Super", english: "Above / Over", grammar: "Particle / Pronoun", pronunciation: "SOO-pehr", unitId: "common" },
    { id: "common-16", latin: "Sub", english: "Under / Below", grammar: "Particle / Pronoun", pronunciation: "SOOB", unitId: "common" },
    { id: "common-17", latin: "Inter", english: "Between / Among", grammar: "Particle / Pronoun", pronunciation: "EEN-tehr", unitId: "common" },
    { id: "common-18", latin: "Post", english: "After", grammar: "Particle / Pronoun", pronunciation: "POHST", unitId: "common" },
    { id: "common-19", latin: "Ante", english: "Before", grammar: "Particle / Pronoun", pronunciation: "AHN-teh", unitId: "common" },
    { id: "common-20", latin: "Quia", english: "Because", grammar: "Particle / Pronoun", pronunciation: "KWEE-ah", unitId: "common" },
    { id: "common-21", latin: "Sed", english: "But", grammar: "Particle / Pronoun", pronunciation: "SEHD", unitId: "common" },
    { id: "common-22", latin: "Aut", english: "Or", grammar: "Particle / Pronoun", pronunciation: "AUT", unitId: "common" },
    { id: "common-23", latin: "Si", english: "If", grammar: "Particle / Pronoun", pronunciation: "SEE", unitId: "common" },
    { id: "common-24", latin: "Nunc", english: "Now", grammar: "Particle / Pronoun", pronunciation: "NOONK", unitId: "common" },
    { id: "common-25", latin: "Omnis", english: "All / Every", grammar: "Particle / Pronoun", pronunciation: "OHM-nees", unitId: "common" },
    { id: "common-26", latin: "Unus", english: "One", grammar: "Particle / Pronoun", pronunciation: "OO-noos", unitId: "common" },
    { id: "common-27", latin: "Magnus", english: "Great / Large", grammar: "Particle / Pronoun", pronunciation: "MAHG-noos", unitId: "common" },
    { id: "common-28", latin: "Hic", english: "This / Here", grammar: "Particle / Pronoun", pronunciation: "HEEK", unitId: "common" },
    { id: "common-29", latin: "Ille", english: "That / He", grammar: "Particle / Pronoun", pronunciation: "EEL-leh", unitId: "common" },
    { id: "common-30", latin: "Ecce", english: "Behold", grammar: "Particle / Pronoun", pronunciation: "EH-cheh", unitId: "common" }
    ],
  },
  {
    id: "adjectives",
    title: "Unit VI · Adjectives",
    cards: [
    { id: "adjectives-01", latin: "Bonus", english: "Good", grammar: "Adjective", pronunciation: "BOH-noos", unitId: "adjectives" },
    { id: "adjectives-02", latin: "Malus", english: "Bad / Evil", grammar: "Adjective", pronunciation: "MAH-loos", unitId: "adjectives" },
    { id: "adjectives-03", latin: "Verus", english: "True", grammar: "Adjective", pronunciation: "VEH-roos", unitId: "adjectives" },
    { id: "adjectives-04", latin: "Novus", english: "New", grammar: "Adjective", pronunciation: "NOH-voos", unitId: "adjectives" },
    { id: "adjectives-05", latin: "Aeternus", english: "Eternal", grammar: "Adjective", pronunciation: "eh-TEHR-noos", unitId: "adjectives" },
    { id: "adjectives-06", latin: "Beatus", english: "Blessed / Happy", grammar: "Adjective", pronunciation: "beh-AH-toos", unitId: "adjectives" },
    { id: "adjectives-07", latin: "Caelestis", english: "Heavenly", grammar: "Adjective", pronunciation: "cheh-LEHS-tees", unitId: "adjectives" },
    { id: "adjectives-08", latin: "Divinus", english: "Divine", grammar: "Adjective", pronunciation: "dee-VEE-noos", unitId: "adjectives" },
    { id: "adjectives-09", latin: "Fidelis", english: "Faithful", grammar: "Adjective", pronunciation: "fee-DEH-lees", unitId: "adjectives" },
    { id: "adjectives-10", latin: "Humilis", english: "Humble", grammar: "Adjective", pronunciation: "HOO-mee-lees", unitId: "adjectives" },
    { id: "adjectives-11", latin: "Iustus", english: "Just / Righteous", grammar: "Adjective", pronunciation: "YOOS-toos", unitId: "adjectives" },
    { id: "adjectives-12", latin: "Misericors", english: "Merciful", grammar: "Adjective", pronunciation: "mee-seh-REE-kohrs", unitId: "adjectives" },
    { id: "adjectives-13", latin: "Omnipotens", english: "Almighty", grammar: "Adjective", pronunciation: "ohm-NEE-poh-tehns", unitId: "adjectives" },
    { id: "adjectives-14", latin: "Pius", english: "Pious / Devout", grammar: "Adjective", pronunciation: "PEE-oos", unitId: "adjectives" },
    { id: "adjectives-15", latin: "Vivus", english: "Living / Alive", grammar: "Adjective", pronunciation: "VEE-voos", unitId: "adjectives" },
    { id: "adjectives-16", latin: "Mortuus", english: "Dead", grammar: "Adjective", pronunciation: "MOHR-too-oos", unitId: "adjectives" },
    { id: "adjectives-17", latin: "Altus", english: "High / Deep", grammar: "Adjective", pronunciation: "AHL-toos", unitId: "adjectives" },
    { id: "adjectives-18", latin: "Dulcis", english: "Sweet", grammar: "Adjective", pronunciation: "DOOL-chees", unitId: "adjectives" },
    { id: "adjectives-19", latin: "Plenus", english: "Full", grammar: "Adjective", pronunciation: "PLEH-noos", unitId: "adjectives" },
    { id: "adjectives-20", latin: "Dignus", english: "Worthy", grammar: "Adjective", pronunciation: "DEEG-noos", unitId: "adjectives" }
    ],
  },
  {
    id: "places",
    title: "Unit VII · Places & Things",
    cards: [
    { id: "places-01", latin: "Ecclesia", english: "Church", grammar: "Noun", pronunciation: "ehk-KLEH-see-ah", unitId: "places" },
    { id: "places-02", latin: "Altare", english: "Altar", grammar: "Noun", pronunciation: "ahl-TAH-reh", unitId: "places" },
    { id: "places-03", latin: "Caelum", english: "Heaven / Sky", grammar: "Noun", pronunciation: "CHEH-loom", unitId: "places" },
    { id: "places-04", latin: "Terra", english: "Earth / Land", grammar: "Noun", pronunciation: "TEHR-rah", unitId: "places" },
    { id: "places-05", latin: "Mundus", english: "World", grammar: "Noun", pronunciation: "MOON-doos", unitId: "places" },
    { id: "places-06", latin: "Regnum", english: "Kingdom", grammar: "Noun", pronunciation: "REHG-noom", unitId: "places" },
    { id: "places-07", latin: "Templum", english: "Temple", grammar: "Noun", pronunciation: "TEHM-ploom", unitId: "places" },
    { id: "places-08", latin: "Crux", english: "Cross", grammar: "Noun", pronunciation: "KROOKS", unitId: "places" },
    { id: "places-09", latin: "Aqua", english: "Water", grammar: "Noun", pronunciation: "AH-kwah", unitId: "places" },
    { id: "places-10", latin: "Ignis", english: "Fire", grammar: "Noun", pronunciation: "EEG-nees", unitId: "places" },
    { id: "places-11", latin: "Lux", english: "Light", grammar: "Noun", pronunciation: "LOOKS", unitId: "places" },
    { id: "places-12", latin: "Tenebrae", english: "Darkness", grammar: "Noun", pronunciation: "TEH-neh-breh", unitId: "places" },
    { id: "places-13", latin: "Panis", english: "Bread", grammar: "Noun", pronunciation: "PAH-nees", unitId: "places" },
    { id: "places-14", latin: "Vinum", english: "Wine", grammar: "Noun", pronunciation: "VEE-noom", unitId: "places" },
    { id: "places-15", latin: "Calix", english: "Chalice / Cup", grammar: "Noun", pronunciation: "KAH-leeks", unitId: "places" },
    { id: "places-16", latin: "Liber", english: "Book", grammar: "Noun", pronunciation: "LEE-behr", unitId: "places" },
    { id: "places-17", latin: "Domus", english: "House / Home", grammar: "Noun", pronunciation: "DOH-moos", unitId: "places" },
    { id: "places-18", latin: "Via", english: "Way / Road", grammar: "Noun", pronunciation: "VEE-ah", unitId: "places" },
    { id: "places-19", latin: "Porta", english: "Gate / Door", grammar: "Noun", pronunciation: "POHR-tah", unitId: "places" },
    { id: "places-20", latin: "Cathedra", english: "Chair (of bishop)", grammar: "Noun", pronunciation: "KAH-teh-drah", unitId: "places" }
    ],
  },
  {
    id: "virtues",
    title: "Unit VIII · Virtues & Abstract Nouns",
    cards: [
    { id: "virtues-01", latin: "Fides", english: "Faith", grammar: "Noun · Abstract", pronunciation: "FEE-dehs", unitId: "virtues" },
    { id: "virtues-02", latin: "Spes", english: "Hope", grammar: "Noun · Abstract", pronunciation: "SPEHS", unitId: "virtues" },
    { id: "virtues-03", latin: "Caritas", english: "Charity / Love", grammar: "Noun · Abstract", pronunciation: "KAH-ree-tahs", unitId: "virtues" },
    { id: "virtues-04", latin: "Prudentia", english: "Prudence", grammar: "Noun · Abstract", pronunciation: "proo-DEHN-tsee-ah", unitId: "virtues" },
    { id: "virtues-05", latin: "Iustitia", english: "Justice", grammar: "Noun · Abstract", pronunciation: "yoos-TEE-tsee-ah", unitId: "virtues" },
    { id: "virtues-06", latin: "Temperantia", english: "Temperance", grammar: "Noun · Abstract", pronunciation: "tehm-peh-RAHN-tsee-ah", unitId: "virtues" },
    { id: "virtues-07", latin: "Fortitudo", english: "Fortitude / Courage", grammar: "Noun · Abstract", pronunciation: "fohr-tee-TOO-doh", unitId: "virtues" },
    { id: "virtues-08", latin: "Patientia", english: "Patience", grammar: "Noun · Abstract", pronunciation: "pah-tsee-EHN-tsee-ah", unitId: "virtues" },
    { id: "virtues-09", latin: "Humilitas", english: "Humility", grammar: "Noun · Abstract", pronunciation: "hoo-MEE-lee-tahs", unitId: "virtues" },
    { id: "virtues-10", latin: "Veritas", english: "Truth", grammar: "Noun · Abstract", pronunciation: "VEH-ree-tahs", unitId: "virtues" },
    { id: "virtues-11", latin: "Sapientia", english: "Wisdom", grammar: "Noun · Abstract", pronunciation: "sah-pee-EHN-tsee-ah", unitId: "virtues" },
    { id: "virtues-12", latin: "Gaudium", english: "Joy", grammar: "Noun · Abstract", pronunciation: "GAU-dee-oom", unitId: "virtues" },
    { id: "virtues-13", latin: "Vita", english: "Life", grammar: "Noun · Abstract", pronunciation: "VEE-tah", unitId: "virtues" },
    { id: "virtues-14", latin: "Mors", english: "Death", grammar: "Noun · Abstract", pronunciation: "MOHRS", unitId: "virtues" },
    { id: "virtues-15", latin: "Anima", english: "Soul", grammar: "Noun · Abstract", pronunciation: "AH-nee-mah", unitId: "virtues" },
    { id: "virtues-16", latin: "Corpus", english: "Body", grammar: "Noun · Abstract", pronunciation: "KOHR-poos", unitId: "virtues" },
    { id: "virtues-17", latin: "Verbum", english: "Word", grammar: "Noun · Abstract", pronunciation: "VEHR-boom", unitId: "virtues" },
    { id: "virtues-18", latin: "Nomen", english: "Name", grammar: "Noun · Abstract", pronunciation: "NOH-mehn", unitId: "virtues" },
    { id: "virtues-19", latin: "Voluntas", english: "Will", grammar: "Noun · Abstract", pronunciation: "voh-LOON-tahs", unitId: "virtues" },
    { id: "virtues-20", latin: "Salus", english: "Salvation / Health", grammar: "Noun · Abstract", pronunciation: "SAH-loos", unitId: "virtues" },
    { id: "virtues-21", latin: "Redemptio", english: "Redemption", grammar: "Noun · Abstract", pronunciation: "reh-DEHMP-tsee-oh", unitId: "virtues" }
    ],
  },
  {
    id: "numbers",
    title: "Unit IX · Numbers",
    cards: [
    { id: "numbers-01", latin: "Unus", english: "One (1)", grammar: "Numeral", pronunciation: "OO-noos", unitId: "numbers" },
    { id: "numbers-02", latin: "Duo", english: "Two (2)", grammar: "Numeral", pronunciation: "DOO-oh", unitId: "numbers" },
    { id: "numbers-03", latin: "Tres", english: "Three (3)", grammar: "Numeral", pronunciation: "TREHS", unitId: "numbers" },
    { id: "numbers-04", latin: "Quattuor", english: "Four (4)", grammar: "Numeral", pronunciation: "KWAHT-too-ohr", unitId: "numbers" },
    { id: "numbers-05", latin: "Quinque", english: "Five (5)", grammar: "Numeral", pronunciation: "KWEEN-kweh", unitId: "numbers" },
    { id: "numbers-06", latin: "Sex", english: "Six (6)", grammar: "Numeral", pronunciation: "SEHKS", unitId: "numbers" },
    { id: "numbers-07", latin: "Septem", english: "Seven (7)", grammar: "Numeral", pronunciation: "SEHP-tehm", unitId: "numbers" },
    { id: "numbers-08", latin: "Octo", english: "Eight (8)", grammar: "Numeral", pronunciation: "OHK-toh", unitId: "numbers" },
    { id: "numbers-09", latin: "Novem", english: "Nine (9)", grammar: "Numeral", pronunciation: "NOH-vehm", unitId: "numbers" },
    { id: "numbers-10", latin: "Decem", english: "Ten (10)", grammar: "Numeral", pronunciation: "DEH-chehm", unitId: "numbers" },
    { id: "numbers-11", latin: "Centum", english: "Hundred (100)", grammar: "Numeral", pronunciation: "CHEHN-toom", unitId: "numbers" },
    { id: "numbers-12", latin: "Mille", english: "Thousand (1000)", grammar: "Numeral", pronunciation: "MEEL-leh", unitId: "numbers" },
    { id: "numbers-13", latin: "Primus", english: "First", grammar: "Numeral", pronunciation: "PREE-moos", unitId: "numbers" },
    { id: "numbers-14", latin: "Secundus", english: "Second", grammar: "Numeral", pronunciation: "seh-KOON-doos", unitId: "numbers" },
    { id: "numbers-15", latin: "Tertius", english: "Third", grammar: "Numeral", pronunciation: "TEHR-tsee-oos", unitId: "numbers" }
    ],
  },
  {
    id: "time",
    title: "Unit X · Time & Seasons",
    cards: [
    { id: "time-01", latin: "Dies", english: "Day", grammar: "Noun · Time", pronunciation: "DEE-ehs", unitId: "time" },
    { id: "time-02", latin: "Nox", english: "Night", grammar: "Noun · Time", pronunciation: "NOHKS", unitId: "time" },
    { id: "time-03", latin: "Hora", english: "Hour", grammar: "Noun · Time", pronunciation: "OH-rah", unitId: "time" },
    { id: "time-04", latin: "Tempus", english: "Time / Season", grammar: "Noun · Time", pronunciation: "TEHM-poos", unitId: "time" },
    { id: "time-05", latin: "Annus", english: "Year", grammar: "Noun · Time", pronunciation: "AHN-noos", unitId: "time" },
    { id: "time-06", latin: "Saeculum", english: "Age / Century", grammar: "Noun · Time", pronunciation: "SEH-koo-loom", unitId: "time" },
    { id: "time-07", latin: "Adventus", english: "Advent / Coming", grammar: "Noun · Time", pronunciation: "ahd-VEHN-toos", unitId: "time" },
    { id: "time-08", latin: "Nativitas", english: "Nativity / Birth", grammar: "Noun · Time", pronunciation: "nah-TEE-vee-tahs", unitId: "time" },
    { id: "time-09", latin: "Quadragesima", english: "Lent (40 days)", grammar: "Noun · Time", pronunciation: "kwah-drah-JEH-see-mah", unitId: "time" },
    { id: "time-10", latin: "Pascha", english: "Easter / Passover", grammar: "Noun · Time", pronunciation: "PAHS-kah", unitId: "time" },
    { id: "time-11", latin: "Pentecostes", english: "Pentecost", grammar: "Noun · Time", pronunciation: "pehn-teh-KOHS-tehs", unitId: "time" },
    { id: "time-12", latin: "Dominica", english: "Sunday / Lord's Day", grammar: "Noun · Time", pronunciation: "doh-MEE-nee-kah", unitId: "time" },
    { id: "time-13", latin: "Sabbatum", english: "Sabbath / Saturday", grammar: "Noun · Time", pronunciation: "SAHB-bah-toom", unitId: "time" },
    { id: "time-14", latin: "Festum", english: "Feast / Festival", grammar: "Noun · Time", pronunciation: "FEHS-toom", unitId: "time" },
    { id: "time-15", latin: "Vigilia", english: "Vigil / Eve", grammar: "Noun · Time", pronunciation: "vee-JEE-lee-ah", unitId: "time" },
    { id: "time-16", latin: "Initium", english: "Beginning", grammar: "Noun · Time", pronunciation: "ee-NEE-tsee-oom", unitId: "time" },
    { id: "time-17", latin: "Finis", english: "End", grammar: "Noun · Time", pronunciation: "FEE-nees", unitId: "time" }
    ],
  },
  {
    id: "phrases",
    title: "Unit XI · Liturgical Phrases",
    cards: [
    { id: "phrases-01", latin: "Dominus vobiscum", english: "The Lord be with you", grammar: "Phrase", pronunciation: "DOH-mee-noos voh-BEES-koom", example: "Dominus vobiscum", exampleEn: "The Lord be with you", unitId: "phrases" },
    { id: "phrases-02", latin: "Et cum spiritu tuo", english: "And with your spirit", grammar: "Phrase", pronunciation: "eht koom SPEE-ree-too TOO-oh", example: "Et cum spiritu tuo", exampleEn: "And with your spirit", unitId: "phrases" },
    { id: "phrases-03", latin: "Kyrie eleison", english: "Lord, have mercy", grammar: "Phrase", pronunciation: "KEE-ree-eh eh-LEH-ee-sohn", example: "Kyrie eleison", exampleEn: "Lord, have mercy", unitId: "phrases" },
    { id: "phrases-04", latin: "Christe eleison", english: "Christ, have mercy", grammar: "Phrase", pronunciation: "KREES-teh eh-LEH-ee-sohn", example: "Christe eleison", exampleEn: "Christ, have mercy", unitId: "phrases" },
    { id: "phrases-05", latin: "Ite, missa est", english: "Go, the Mass is ended", grammar: "Phrase", pronunciation: "EE-teh MEES-sah ehst", example: "Ite, missa est", exampleEn: "Go, the Mass is ended", unitId: "phrases" },
    { id: "phrases-06", latin: "Deo gratias", english: "Thanks be to God", grammar: "Phrase", pronunciation: "DEH-oh GRAH-tsee-ahs", example: "Deo gratias", exampleEn: "Thanks be to God", unitId: "phrases" },
    { id: "phrases-07", latin: "Verbum Domini", english: "The Word of the Lord", grammar: "Phrase", pronunciation: "VEHR-boom DOH-mee-nee", example: "Verbum Domini", exampleEn: "The Word of the Lord", unitId: "phrases" },
    { id: "phrases-08", latin: "Laus tibi, Christe", english: "Praise to you, Christ", grammar: "Phrase", pronunciation: "LAUS TEE-bee KREES-teh", example: "Laus tibi, Christe", exampleEn: "Praise to you, Christ", unitId: "phrases" },
    { id: "phrases-09", latin: "Mea culpa", english: "My fault", grammar: "Phrase", pronunciation: "MEH-ah KOOL-pah", example: "Mea culpa", exampleEn: "My fault", unitId: "phrases" },
    { id: "phrases-10", latin: "Ora pro nobis", english: "Pray for us", grammar: "Phrase", pronunciation: "OH-rah proh NOH-bees", example: "Ora pro nobis", exampleEn: "Pray for us", unitId: "phrases" },
    { id: "phrases-11", latin: "Requiem aeternam", english: "Eternal rest", grammar: "Phrase", pronunciation: "REH-kwee-ehm eh-TEHR-nahm", example: "Requiem aeternam", exampleEn: "Eternal rest", unitId: "phrases" },
    { id: "phrases-12", latin: "In nomine Patris", english: "In the name of the Father", grammar: "Phrase", pronunciation: "een NOH-mee-neh PAH-trees", example: "In nomine Patris", exampleEn: "In the name of the Father", unitId: "phrases" },
    { id: "phrases-13", latin: "Saecula saeculorum", english: "World without end", grammar: "Phrase", pronunciation: "SEH-koo-lah seh-koo-LOH-room", example: "Saecula saeculorum", exampleEn: "World without end", unitId: "phrases" },
    { id: "phrases-14", latin: "Dona nobis pacem", english: "Grant us peace", grammar: "Phrase", pronunciation: "DOH-nah NOH-bees PAH-chehm", example: "Dona nobis pacem", exampleEn: "Grant us peace", unitId: "phrases" },
    { id: "phrases-15", latin: "Ecce Agnus Dei", english: "Behold the Lamb of God", grammar: "Phrase", pronunciation: "EH-cheh AHG-noos DEH-ee", example: "Ecce Agnus Dei", exampleEn: "Behold the Lamb of God", unitId: "phrases" },
    { id: "phrases-16", latin: "Sursum corda", english: "Lift up your hearts", grammar: "Phrase", pronunciation: "SOOR-soom KOHR-dah", example: "Sursum corda", exampleEn: "Lift up your hearts", unitId: "phrases" },
    { id: "phrases-17", latin: "Habemus ad Dominum", english: "We lift them up to the Lord", grammar: "Phrase", pronunciation: "ah-BEH-moos ahd DOH-mee-noom", example: "Habemus ad Dominum", exampleEn: "We lift them up to the Lord", unitId: "phrases" },
    { id: "phrases-18", latin: "Per omnia saecula", english: "Through all ages", grammar: "Phrase", pronunciation: "pehr OHM-nee-ah SEH-koo-lah", example: "Per omnia saecula", exampleEn: "Through all ages", unitId: "phrases" }
    ],
  }
];

/** Flat list of all cards across every unit. */
export const ALL_CARDS: VocabCard[] = VOCAB_UNITS.flatMap((u) => u.cards);

/**
 * Spaced repetition, mirroring the source app.
 *
 * The source uses a 5-level Leitner-style system stored as `S.sr[word]`:
 *   0 = new, 1 = learning, 2 = familiar, 3 = known, 4 = mastered
 * On a correct recall the level is incremented (`srUp`, capped at 4); on a
 * miss it is decremented (`srDown`, floored at 0). The source schedules purely
 * by level and has no explicit day intervals, so the `dueInDays` returned here
 * is a conventional Leitner day schedule keyed to the resulting box/level.
 *
 * @param box     prior box/level (0-4); values are clamped into range.
 * @param knewIt  whether the learner recalled the card correctly.
 */
export function nextSrs(
  box: number,
  knewIt: boolean
): { box: number; dueInDays: number } {
  const current = Math.max(0, Math.min(4, Math.floor(box)));
  // Source behaviour: srUp (knew) promotes by 1 capped at 4; srDown (missed)
  // demotes by 1 floored at 0.
  const next = knewIt
    ? Math.min(current + 1, 4)
    : Math.max(current - 1, 0);
  // Day offsets per Leitner box (0..4). The source has no intervals; this is a
  // standard doubling schedule so callers that want due dates have one.
  const DUE_BY_BOX = [0, 1, 3, 7, 21];
  return { box: next, dueInDays: DUE_BY_BOX[next] };
}
