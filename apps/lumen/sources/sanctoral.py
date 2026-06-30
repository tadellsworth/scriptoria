#!/usr/bin/env python3
"""Build the sanctoral (saint of the day) -> sources/sanctoral.json.

Original, public-domain-safe entries: a saint's identity and feast date are
facts, freely usable; the descriptions are written fresh (not reproduced from
any copyrighted edition). Dates follow the modern General Roman Calendar. This
is a curated starter set covering the principal feasts and best-known saints
across the year; a public-domain Butler can later enrich the biographies.

Card shape: type 'saint', title = name, body = blurb, feast 'MM-DD'.
"""
import json, os

MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'December']

# (MM-DD, Name, blurb)
ENTRIES = [
    # ---- January ----
    ("01-01", "Mary, the Holy Mother of God",
     "The Church opens the year honoring Mary under her most ancient title, Theotokos, God-bearer, defined at the Council of Ephesus in 431."),
    ("01-02", "Saints Basil the Great and Gregory Nazianzen",
     "Two fourth-century friends and bishops, giants of the Greek Church and Doctors, who defended the divinity of Christ and the Holy Spirit against the Arians."),
    ("01-03", "The Holy Name of Jesus",
     "A feast of devotion to the name above every name, at which, St. Paul writes, every knee shall bend in heaven and on earth."),
    ("01-17", "Saint Anthony of Egypt",
     "The father of monasticism, who around the year 270 sold all he had and withdrew to the Egyptian desert, drawing thousands after him into the monastic life."),
    ("01-21", "Saint Agnes",
     "A Roman girl of about thirteen, martyred around 304 for refusing marriage to keep her consecration to Christ; one of the most venerated of the early virgin-martyrs."),
    ("01-24", "Saint Francis de Sales",
     "Bishop of Geneva and Doctor of the Church (1567-1622), gentle apostle of the devout life for ordinary people, whose Introduction to the Devout Life you will meet in these pages."),
    ("01-25", "The Conversion of Saint Paul",
     "The risen Christ halts Saul on the Damascus road, turning the Church's fiercest persecutor into its greatest missionary."),
    ("01-26", "Saints Timothy and Titus",
     "Companions and converts of St. Paul, to whom he addressed the pastoral letters, and among the first bishops of the Church."),
    ("01-28", "Saint Thomas Aquinas",
     "The Angelic Doctor (1225-1274), Dominican friar whose Summa Theologiae remains the Church's most influential synthesis of faith and reason."),
    ("01-31", "Saint John Bosco",
     "A nineteenth-century Turin priest who gave his life to poor and abandoned boys, founding the Salesians on a method of reason, religion, and loving-kindness."),
    # ---- February ----
    ("02-02", "The Presentation of the Lord",
     "Forty days after Christmas the infant Jesus is presented in the Temple, where Simeon hails him as a light to the nations; candles are blessed, and the day is called Candlemas."),
    ("02-03", "Saint Blaise",
     "A fourth-century bishop and martyr of Armenia, invoked against ailments of the throat; his feast is kept with the blessing of throats."),
    ("02-05", "Saint Agatha",
     "A Sicilian virgin-martyr of the third century who endured terrible torture rather than renounce her faith in Christ."),
    ("02-10", "Saint Scholastica",
     "Sister of St. Benedict and the first Benedictine nun, remembered for the night she won, by prayer, one last conversation with her brother."),
    ("02-11", "Our Lady of Lourdes",
     "In 1858 Mary appeared to St. Bernadette at Lourdes, calling herself the Immaculate Conception; the spring there has drawn the sick ever since."),
    ("02-14", "Saints Cyril and Methodius",
     "Ninth-century brothers and apostles to the Slavs, who fashioned an alphabet to bring them the Scriptures and the liturgy in their own tongue."),
    ("02-22", "The Chair of Saint Peter",
     "A feast not of a relic but of an office, the teaching authority Christ entrusted to Peter and his successors."),
    # ---- March ----
    ("03-07", "Saints Perpetua and Felicity",
     "Two young mothers martyred at Carthage in 203, whose prison diary is among the most moving documents of the early Church."),
    ("03-17", "Saint Patrick",
     "The fifth-century bishop who, returning to the land of his captivity, won Ireland for Christ and is honored as its patron."),
    ("03-18", "Saint Cyril of Jerusalem",
     "A fourth-century bishop and Doctor whose catechetical lectures still instruct the newly baptized in the mysteries of the faith."),
    ("03-19", "Saint Joseph",
     "The just man chosen as husband of Mary and guardian of the Child Jesus, patron of the universal Church and of a happy death."),
    ("03-25", "The Annunciation of the Lord",
     "The angel Gabriel announces to Mary that she will bear the Son of God, and at her fiat the Word is made flesh."),
    # ---- April ----
    ("04-25", "Saint Mark",
     "The evangelist whose Gospel, the briefest and most vivid, preserves the preaching of St. Peter at Rome."),
    ("04-29", "Saint Catherine of Siena",
     "Doctor of the Church (1347-1380) whose letters and counsel helped return the popes to Rome; a mystic of fierce love for the Church."),
    # ---- May ----
    ("05-01", "Saint Joseph the Worker",
     "A feast honoring the dignity of human labor, hallowed in the carpenter of Nazareth who taught his trade to the Son of God."),
    ("05-03", "Saints Philip and James",
     "Two of the Twelve Apostles: Philip, who asked to be shown the Father, and James, a leader of the church at Jerusalem."),
    ("05-13", "Our Lady of Fatima",
     "In 1917 Mary appeared to three shepherd children at Fatima, calling the world to prayer, penance, and the rosary."),
    ("05-26", "Saint Philip Neri",
     "The joyful Apostle of Rome (1515-1595), who renewed the city through prayer, confession, and holy mirth, founding the Oratory."),
    ("05-31", "The Visitation of Mary",
     "Mary, newly carrying Christ, hastens to her cousin Elizabeth, who greets her in the words the Church still prays in the Hail Mary."),
    # ---- June ----
    ("06-01", "Saint Justin Martyr",
     "A second-century philosopher who found in Christ the truth he had long sought, and sealed his testimony with his blood."),
    ("06-13", "Saint Anthony of Padua",
     "Franciscan preacher and Doctor (1195-1231), renowned for learning and for miracles, invoked by many for what is lost."),
    ("06-21", "Saint Aloysius Gonzaga",
     "A young Jesuit who renounced a princely inheritance and died at twenty-three nursing the plague-stricken in Rome."),
    ("06-24", "The Nativity of Saint John the Baptist",
     "Six months before Christmas the Church keeps the birth of the forerunner who would prepare the way of the Lord."),
    ("06-28", "Saint Irenaeus",
     "A second-century bishop of Lyons and Doctor, whose Against Heresies is the great early defense of the apostolic faith."),
    ("06-29", "Saints Peter and Paul",
     "The two pillars of the Roman Church, the fisherman made shepherd and the persecutor made apostle, both martyred in Rome."),
    # ---- July ----
    ("07-03", "Saint Thomas the Apostle",
     "The apostle whose doubt, answered by the risen Christ, became the Church's clearest confession: My Lord and my God."),
    ("07-11", "Saint Benedict",
     "Father of Western monasticism (c. 480-547), whose Rule, ordering life by prayer and work, shaped Europe; he is its patron."),
    ("07-22", "Saint Mary Magdalene",
     "The first witness of the Resurrection, sent by the risen Lord to announce it to the apostles, the apostle to the apostles."),
    ("07-25", "Saint James the Greater",
     "One of the Twelve and the first apostle to be martyred; his shrine at Compostela has drawn pilgrims for a thousand years."),
    ("07-26", "Saints Joachim and Anne",
     "The parents of the Blessed Virgin Mary, honored as the grandparents of the Lord."),
    ("07-29", "Saint Martha",
     "The friend of Jesus at Bethany who served him and, at her brother's tomb, confessed him as the Christ, the Son of God."),
    ("07-31", "Saint Ignatius of Loyola",
     "Soldier turned saint (1491-1556), founder of the Society of Jesus and author of the Spiritual Exercises."),
    # ---- August ----
    ("08-01", "Saint Alphonsus Liguori",
     "Moral theologian and Doctor (1696-1787), founder of the Redemptorists and a tender guide of troubled souls."),
    ("08-04", "Saint John Vianney",
     "The Cure of Ars (1786-1859), a simple parish priest who spent himself in the confessional; patron of parish priests."),
    ("08-06", "The Transfiguration of the Lord",
     "On the mountain Christ shines before Peter, James, and John, and the Father's voice declares him the beloved Son."),
    ("08-08", "Saint Dominic",
     "Founder of the Order of Preachers (c. 1170-1221), who answered error with learning, poverty, and the preaching of the truth."),
    ("08-10", "Saint Lawrence",
     "A deacon of Rome martyred in 258, who gave the Church's treasure to the poor and met death with startling courage."),
    ("08-11", "Saint Clare of Assisi",
     "The first woman to follow St. Francis (1194-1253), foundress of the Poor Clares, a steady flame of contemplative poverty."),
    ("08-14", "Saint Maximilian Kolbe",
     "A Franciscan priest who at Auschwitz in 1941 offered his own life in place of a condemned fellow prisoner."),
    ("08-15", "The Assumption of Mary",
     "Mary, at the end of her earthly life, is taken body and soul into the glory of heaven."),
    ("08-20", "Saint Bernard of Clairvaux",
     "Cistercian abbot and Doctor (1090-1153), the mellifluous doctor, preacher of the love of God and of Our Lady."),
    ("08-22", "The Queenship of Mary",
     "An octave-day of the Assumption, honoring Mary crowned as Queen of heaven and earth."),
    ("08-24", "Saint Bartholomew",
     "One of the Twelve Apostles, traditionally identified with Nathanael, in whom Christ found no guile."),
    ("08-27", "Saint Monica",
     "The patient mother whose tears and prayers over many years won the conversion of her son Augustine."),
    ("08-28", "Saint Augustine",
     "Bishop of Hippo and Doctor (354-430), whose Confessions and City of God shaped the West; he was restless until he rested in God."),
    # ---- September ----
    ("09-03", "Saint Gregory the Great",
     "Pope and Doctor (c. 540-604), reformer of the liturgy and chant, who called himself the servant of the servants of God."),
    ("09-08", "The Nativity of Mary",
     "The Church keeps the birthday of the Virgin in whom the dawn of salvation would rise."),
    ("09-13", "Saint John Chrysostom",
     "Bishop of Constantinople and Doctor, the golden-mouthed, perhaps the Church's greatest preacher of the Scriptures."),
    ("09-14", "The Exaltation of the Holy Cross",
     "A feast of the Cross by which death was undone, recalling its finding at Jerusalem and its recovery from Persia."),
    ("09-21", "Saint Matthew",
     "The tax-collector called from his table to follow Christ, apostle and evangelist of the kingdom."),
    ("09-27", "Saint Vincent de Paul",
     "Apostle of charity (1581-1660), who organized the Church's care for the poor, the sick, and the abandoned."),
    ("09-29", "Saints Michael, Gabriel, and Raphael",
     "The holy archangels: Michael the protector, Gabriel the messenger, and Raphael the healer."),
    ("09-30", "Saint Jerome",
     "Doctor of the Church (c. 347-420) who translated the Scriptures into the Latin Vulgate and gave his life to the sacred page."),
    # ---- October ----
    ("10-01", "Saint Therese of Lisieux",
     "The Little Flower (1873-1897), Carmelite and Doctor, whose little way of trust and small acts of love has drawn countless souls."),
    ("10-02", "The Holy Guardian Angels",
     "A feast honoring the angels God appoints to guard each soul and to guide it along the way home."),
    ("10-04", "Saint Francis of Assisi",
     "The Poverello (1182-1226), who wedded Lady Poverty, bore the wounds of Christ, and called all creation to praise its Maker."),
    ("10-07", "Our Lady of the Rosary",
     "A feast of the rosary, the gospel told on beads, kept in thanksgiving for deliverance at Lepanto in 1571."),
    ("10-15", "Saint Teresa of Avila",
     "Carmelite reformer and Doctor (1515-1582), a great mistress of prayer, whose Interior Castle you will meet in these pages."),
    ("10-18", "Saint Luke",
     "The beloved physician, companion of St. Paul, evangelist of mercy and author of the Acts of the Apostles."),
    ("10-28", "Saints Simon and Jude",
     "Two of the Twelve Apostles; Jude is invoked by many in desperate and forgotten causes."),
    # ---- November ----
    ("11-01", "All Saints",
     "The Church on earth keeps festival with the whole company of heaven, the known and the countless unknown blessed."),
    ("11-02", "All Souls",
     "The Church prays for all the faithful departed still being purified, that they may come swiftly to the vision of God."),
    ("11-04", "Saint Charles Borromeo",
     "Reforming archbishop of Milan (1538-1584), a tireless shepherd of the Catholic Reformation."),
    ("11-09", "The Dedication of the Lateran Basilica",
     "A feast of the cathedral of Rome, mother and head of all churches, a sign of the Church's unity around Peter."),
    ("11-11", "Saint Martin of Tours",
     "The soldier who shared his cloak with a beggar and saw Christ in him; bishop and father of monks in Gaul."),
    ("11-21", "The Presentation of Mary",
     "An ancient feast recalling the Virgin's dedication to God from her youth."),
    ("11-22", "Saint Cecilia",
     "A Roman virgin-martyr and patroness of music, who is remembered as singing to God in her heart amid her sufferings."),
    ("11-30", "Saint Andrew",
     "Brother of Simon Peter and the first-called of the apostles, who brought others to Christ and died upon his slanting cross."),
    # ---- December ----
    ("12-03", "Saint Francis Xavier",
     "Jesuit missionary (1506-1552) who carried the gospel to India and Japan, baptizing many thousands; patron of missions."),
    ("12-06", "Saint Nicholas",
     "A fourth-century bishop of Myra, famed for secret generosity to the poor, whose memory became Father Christmas."),
    ("12-07", "Saint Ambrose",
     "Bishop of Milan and Doctor (c. 340-397), who baptized Augustine and taught the West to sing the praises of God."),
    ("12-08", "The Immaculate Conception",
     "Mary, from the first instant of her conception, was preserved free from original sin in view of the merits of Christ."),
    ("12-12", "Our Lady of Guadalupe",
     "In 1531 Mary appeared to St. Juan Diego near Mexico City, leaving her image on his cloak; patroness of the Americas."),
    ("12-13", "Saint Lucy",
     "A Sicilian virgin-martyr of the early fourth century whose name means light, kept as the days turn toward Christmas."),
    ("12-14", "Saint John of the Cross",
     "Carmelite mystic and Doctor (1542-1591), poet of the dark night and of the soul's ascent to union with God."),
    ("12-25", "The Nativity of the Lord",
     "The Word is made flesh and dwells among us; the eternal Son is born of the Virgin at Bethlehem."),
    ("12-26", "Saint Stephen",
     "The first martyr, a deacon stoned for his witness, who died as his Lord did, praying for his persecutors."),
    ("12-27", "Saint John the Evangelist",
     "The beloved disciple, apostle and evangelist, who leaned on the Lord's breast and proclaimed the Word made flesh."),
    ("12-28", "The Holy Innocents",
     "The children of Bethlehem slain by Herod, the Church's infant martyrs, who died for Christ before they could know him."),
]


def slug(name):
    s = name.lower()
    for ch in "',.()":
        s = s.replace(ch, "")
    return "-".join(s.split())[:48]


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    cards = []
    seen = set()
    for mmdd, name, blurb in ENTRIES:
        assert mmdd not in seen, "duplicate feast date " + mmdd
        seen.add(mmdd)
        mm, dd = mmdd.split("-")
        ref = MONTHS[int(mm)] + " " + str(int(dd))
        cards.append({
            "id": "sanct-" + mmdd,
            "type": "saint",
            "title": name,
            "body": blurb,
            "ref": ref,
            "source": "Sanctoral",
            "feast": mmdd,
            "tags": ["saint", "sanctoral", slug(name)],
            "verified": True,
        })
    out = os.path.join(here, "sanctoral.json")
    json.dump(cards, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("sanctoral: %d saint-of-the-day cards across %d dates -> %s"
          % (len(cards), len(seen), out))
    lens = [len(c["body"]) for c in cards]
    print("blurb length: min %d max %d avg %d" % (min(lens), max(lens), sum(lens) // len(lens)))


if __name__ == "__main__":
    main()
