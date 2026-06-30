/* The core prayer library — English + Ecclesiastical Latin. */
export interface Prayer {
  key: string;
  title: string;
  latinTitle: string;
  en: string;
  la: string;
}

export const PRAYERS: Record<string, Prayer> = {
  paterNoster: {
    key: 'paterNoster', title: 'Our Father', latinTitle: 'Pater Noster',
    en: 'Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.',
    la: 'Pater noster, qui es in caelis: sanctificétur nomen tuum; advéniat regnum tuum; fiat volúntas tua, sicut in caelo, et in terra. Panem nostrum cotidiánum da nobis hódie; et dimítte nobis débita nostra, sicut et nos dimíttimus debitóribus nostris; et ne nos indúcas in tentatiónem; sed líbera nos a malo. Amen.',
  },
  aveMaria: {
    key: 'aveMaria', title: 'Hail Mary', latinTitle: 'Ave Maria',
    en: 'Hail Mary, full of grace, the Lord is with thee. Blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
    la: 'Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc et in hora mortis nostrae. Amen.',
  },
  gloriaPatri: {
    key: 'gloriaPatri', title: 'Glory Be', latinTitle: 'Gloria Patri',
    en: 'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.',
    la: 'Glória Patri, et Fílio, et Spirítui Sancto. Sicut erat in princípio, et nunc, et semper, et in saecula saeculórum. Amen.',
  },
  salveRegina: {
    key: 'salveRegina', title: 'Hail Holy Queen', latinTitle: 'Salve Regina',
    en: 'Hail, Holy Queen, Mother of Mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us. And after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.',
    la: 'Salve, Regína, Mater misericórdiae, vita, dulcédo et spes nostra, salve. Ad te clamámus éxsules fílii Hevae. Ad te suspirámus geméntes et flentes in hac lacrimárum valle. Eia ergo, advocáta nostra, illos tuos misericórdes óculos ad nos convérte. Et Iesum, benedíctum fructum ventris tui, nobis post hoc exsílium osténde. O clemens, O pia, O dulcis Virgo María.',
  },
  angelus: {
    key: 'angelus', title: 'The Angelus', latinTitle: 'Angelus',
    en: 'The Angel of the Lord declared unto Mary, and she conceived of the Holy Spirit. Hail Mary… Behold the handmaid of the Lord; be it done unto me according to thy word. Hail Mary… And the Word was made flesh and dwelt among us. Hail Mary… Pray for us, O Holy Mother of God, that we may be made worthy of the promises of Christ.',
    la: 'Angelus Dómini nuntiávit Maríae, et concépit de Spíritu Sancto. Ave María… Ecce ancílla Dómini; fiat mihi secúndum verbum tuum. Ave María… Et Verbum caro factum est et habitávit in nobis. Ave María… Ora pro nobis, sancta Dei Génitrix, ut digni efficiámur promissiónibus Christi.',
  },
  apostlesCreed: {
    key: 'apostlesCreed', title: "Apostles' Creed", latinTitle: 'Symbolum Apostolorum',
    en: 'I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.',
    la: 'Credo in Deum Patrem omnipoténtem, Creatórem caeli et terrae, et in Iesum Christum, Fílium eius únicum, Dóminum nostrum, qui concéptus est de Spíritu Sancto, natus ex María Vírgine, passus sub Póntio Piláto, crucifíxus, mórtuus, et sepúltus, descéndit ad ínferos, tértia die resurréxit a mórtuis, ascéndit ad caelos, sedet ad déxteram Dei Patris omnipoténtis, inde ventúrus est iudicáre vivos et mórtuos. Credo in Spíritum Sanctum, sanctam Ecclésiam cathólicam, sanctórum communiónem, remissiónem peccatórum, carnis resurrectiónem, vitam aetérnam. Amen.',
  },
  fatima: {
    key: 'fatima', title: 'Fátima Prayer', latinTitle: 'Oratio Fatimae',
    en: 'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those in most need of thy mercy.',
    la: 'O mi Iesu, dimítte nobis débita nostra, líbera nos ab igne inférni, perduc in caelum omnes ánimas, praésertim eas quae máxime indigent misericórdia tua.',
  },
  actOfContrition: {
    key: 'actOfContrition', title: 'Act of Contrition', latinTitle: 'Actus Contritionis',
    en: 'O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen.',
    la: 'Deus meus, ex toto corde paénitet me ómnium meórum peccatórum, éaque detéstor, quia peccándo, non solum poenas a te iuste statútas proméritus sum, sed praésertim quia offéndi te, summum bonum, ac dignum qui super ómnia diligáris. Ídeo fírmiter propóno, adiuvánte grátia tua, de cétero me non peccatúrum peccandíque occasiónes próximas fugitúrum. Amen.',
  },
};

/** The order shown in the Prayer Library list on the Pray screen. */
export const PRAYER_LIBRARY: string[] = ['paterNoster', 'aveMaria', 'gloriaPatri', 'salveRegina', 'angelus'];
