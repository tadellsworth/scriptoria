/**
 * Daily devotional content for the "Little Missal" children's daily-devotional app.
 *
 * Extracted verbatim from the source app
 * (source_apps/little-missal.html, `const DAILY_ENTRIES = { ... }`).
 *
 * ── Field mapping notes ─────────────────────────────────────────────────────
 * The source entries only carry five fields:
 *   liturgicalDay, gospelReference, theme, question, prayer
 *
 * The target `Devotion` shape asks for a few fields the source does not provide:
 *   - `gospelText`        → the source has NO gospel quote text, only a reference.
 *                           We set this to an empty string so it is always present
 *                           and `strict`-safe; consumers should treat "" as "no
 *                           quote available" (the original app showed only the
 *                           reference, never a quote).
 *   - `thought`           → mapped from the source's `theme` (the "Today's
 *                           Message" reflection shown to the reader).
 *   - `prayerLatin` /
 *     `prayerLatinGloss`  → not present in the source; omitted (optional).
 *
 * `liturgicalDay`, `gospelReference`, `question`, and `prayer` map across 1:1.
 * All text is preserved exactly as in the source (Unicode escapes resolved to
 * their literal characters, e.g. `·`, `—`, `’`, `“`, `”`, `–`).
 */

export interface Devotion {
  /** Key as found in source, e.g. "06-15" or "2026-06-15" — keep the source's key format */
  liturgicalDay: string;      // e.g. "Monday, 11th Week in Ordinary Time"
  gospelReference: string;    // e.g. "Matthew 5:38–42"
  gospelText: string;         // the gospel quote shown to a reader
  thought: string;            // the reflection / "thought to carry"
  question: string;           // the reflection question
  prayer: string;             // the prayer text (English)
  prayerLatin?: string;       // Latin line if present
  prayerLatinGloss?: string;  // English gloss of the Latin if present
}

/**
 * Keyed by the source's date key, which is an ISO calendar date in the
 * format `YYYY-MM-DD` (e.g. "2026-06-15"). Entries run from 2026-05-27
 * through 2026-07-17.
 */
export const DEVOTIONS: Record<string, Devotion> = {
  "2026-05-27": {
    liturgicalDay: "Wednesday · 8th Week in Ordinary Time",
    gospelReference: "Mark 10:32–45",
    gospelText: "",
    thought: "Jesus tells us that the greatest people in his Kingdom are not the bossiest — they are the ones who help and serve others.",
    question: "What is one way you could serve someone in your family today, like Jesus served us?",
    prayer: "Jesus, you came to serve and not to be served. Teach me to look for ways to help others. Make my heart kind like yours.",
  },
  "2026-05-28": {
    liturgicalDay: "Thursday · 8th Week in Ordinary Time",
    gospelReference: "Mark 10:46–52",
    gospelText: "",
    thought: "A blind man named Bartimaeus called out to Jesus for help, and Jesus stopped, listened, and healed him. Jesus always hears us when we call.",
    question: "When you need Jesus’s help, what is one thing you can say to him?",
    prayer: "Jesus, thank you for hearing me when I pray. When I need help, give me courage to ask. Open the eyes of my heart to see you.",
  },
  "2026-05-29": {
    liturgicalDay: "Friday · 8th Week in Ordinary Time",
    gospelReference: "Mark 11:11–26",
    gospelText: "",
    thought: "Jesus teaches us that if we have even a little faith and we pray, big things can happen — even big mountains can be moved.",
    question: "What is something big you can talk to Jesus about today in prayer?",
    prayer: "Jesus, I believe in you, even when my faith is small. Help me trust that you hear my prayers. Make my faith grow stronger every day.",
  },
  "2026-05-30": {
    liturgicalDay: "Saturday · 8th Week in Ordinary Time",
    gospelReference: "Mark 11:27–33",
    gospelText: "",
    thought: "People asked Jesus where his power came from. We know the answer: everything Jesus does comes from his Father in heaven, who loves us.",
    question: "What is one good thing Jesus does that you are thankful for?",
    prayer: "Jesus, you do everything in your Father’s love. Thank you for using your power to help us. Help me always trust you.",
  },
  "2026-05-31": {
    liturgicalDay: "The Most Holy Trinity · Sunday",
    gospelReference: "John 16:12–15",
    gospelText: "",
    thought: "God is three Persons in one God: the Father, the Son, and the Holy Spirit. They love each other perfectly — and they invite us into that same love.",
    question: "When you make the Sign of the Cross, what does each part mean to you?",
    prayer: "Holy Trinity — Father, Son, and Holy Spirit — I love you. Thank you for letting me share in your love. Help me grow in faith every day.",
  },
  "2026-06-01": {
    liturgicalDay: "St. Justin · Martyr",
    gospelReference: "Mark 12:1–12",
    gospelText: "",
    thought: "Jesus is the special stone that holds everything together, even though some people did not believe in him. He is the strong center of our faith.",
    question: "How do you think Jesus holds your family together?",
    prayer: "Jesus, you are the strong stone our faith is built on. Help me trust you with all my heart. St. Justin, pray for me.",
  },
  "2026-06-02": {
    liturgicalDay: "Tuesday · 9th Week in Ordinary Time",
    gospelReference: "Mark 12:13–17",
    gospelText: "",
    thought: "Jesus tells us to give to God what belongs to God — our hearts, our love, and our whole selves.",
    question: "What is one part of you that you can give to God today?",
    prayer: "God, everything I have comes from you. I give you my heart, my time, and my love. Help me belong fully to you.",
  },
  "2026-06-03": {
    liturgicalDay: "Sts. Charles Lwanga & Companions · Martyrs",
    gospelReference: "Mark 12:18–27",
    gospelText: "",
    thought: "Jesus reminds us that God is the God of the living. When we love God, our lives never really end — they go on forever with him.",
    question: "What does it feel like to know your life will last forever with Jesus?",
    prayer: "Father, thank you for the gift of life that lasts forever. Help me live each day with joy because I belong to you. St. Charles Lwanga, pray for us.",
  },
  "2026-06-04": {
    liturgicalDay: "Thursday · 9th Week in Ordinary Time",
    gospelReference: "Mark 12:28–34",
    gospelText: "",
    thought: "Jesus tells us the two most important things: love God with all our heart, and love our neighbor as ourselves. That is the whole Christian life.",
    question: "Who is one neighbor — someone close to you — that you can love today?",
    prayer: "Jesus, help me love God with all my heart, soul, mind, and strength. And help me love the people around me, just like you love me.",
  },
  "2026-06-05": {
    liturgicalDay: "St. Boniface · Bishop and Martyr",
    gospelReference: "Mark 12:35–37",
    gospelText: "",
    thought: "Jesus is more than just a great teacher — he is the King and Lord whom David himself called Lord. He is God, come to be with us.",
    question: "What is one name you like to call Jesus when you talk to him?",
    prayer: "Jesus, you are my King and my Lord. I love you and I want to follow you. St. Boniface, pray that I am brave for Jesus.",
  },
  "2026-06-06": {
    liturgicalDay: "Saturday · 9th Week in Ordinary Time",
    gospelReference: "Mark 12:38–44",
    gospelText: "",
    thought: "A poor widow gave just two tiny coins, but Jesus said she gave more than anyone else, because she gave everything she had with love.",
    question: "What is one small thing you could give with great love today?",
    prayer: "Jesus, I want to give you my whole heart, even when it feels small. Help me love big, like the widow with her two coins.",
  },
  "2026-06-07": {
    liturgicalDay: "The Most Holy Body and Blood of Christ · Corpus Christi",
    gospelReference: "Luke 9:11b–17",
    gospelText: "",
    thought: "Jesus took a few loaves and fishes and fed thousands of people. Today in Holy Communion, he still feeds us — with his very own self.",
    question: "What do you think Jesus wants to give you when you receive him in Holy Communion?",
    prayer: "Jesus, thank you for feeding us with your Body and Blood. Help me come to you hungry for your love. Make me strong with your life inside me.",
  },
  "2026-06-08": {
    liturgicalDay: "Monday · 10th Week in Ordinary Time",
    gospelReference: "Matthew 5:1–12",
    gospelText: "",
    thought: "Jesus teaches the Beatitudes — the secret of being truly happy. The gentle, the pure of heart, and the peacemakers are blessed by God.",
    question: "Which of the Beatitudes do you want to grow in today?",
    prayer: "Jesus, you said the gentle and pure of heart are blessed. Make my heart like that. Help me find true happiness in following you.",
  },
  "2026-06-09": {
    liturgicalDay: "Tuesday · 10th Week in Ordinary Time",
    gospelReference: "Matthew 5:13–16",
    gospelText: "",
    thought: "Jesus says we are the salt of the earth and the light of the world. When we live with love, others see God shining through us.",
    question: "How can your light shine for Jesus today?",
    prayer: "Jesus, you are the true light. Let your light shine through me so others can see your goodness. Help me bring a little of you to everyone I meet.",
  },
  "2026-06-10": {
    liturgicalDay: "Wednesday · 10th Week in Ordinary Time",
    gospelReference: "Matthew 5:17–19",
    gospelText: "",
    thought: "Jesus did not come to throw away God’s good rules — he came to fulfill them. He shows us how to live every commandment with love.",
    question: "What is one good rule that helps you love God or others better?",
    prayer: "Jesus, thank you for showing me how to love. Help me follow God’s good rules from my heart, not just because I have to. Let my obedience be love.",
  },
  "2026-06-11": {
    liturgicalDay: "St. Barnabas · Apostle",
    gospelReference: "Matthew 10:7–13",
    gospelText: "",
    thought: "Jesus sent his friends out two-by-two to share the good news that God’s Kingdom is near. He sends us, too — into our families and friendships.",
    question: "Who is one person you could share Jesus’s love with this week?",
    prayer: "Jesus, like St. Barnabas, help me share your good news. Let my words and actions show others how much you love them. St. Barnabas, pray for me.",
  },
  "2026-06-12": {
    liturgicalDay: "The Most Sacred Heart of Jesus · Solemnity",
    gospelReference: "Luke 15:3–7",
    gospelText: "",
    thought: "Jesus’s heart is so full of love that if even one little sheep gets lost, he runs out to find it. His Sacred Heart is always looking for us.",
    question: "When you feel far from Jesus, how do you think he comes to find you?",
    prayer: "Sacred Heart of Jesus, thank you for loving me so much that you would search for me. Keep me always close to your loving heart.",
  },
  "2026-06-13": {
    liturgicalDay: "St. Anthony of Padua · Priest and Doctor",
    gospelReference: "Matthew 5:33–37",
    gospelText: "",
    thought: "Jesus tells us to always tell the truth. When we say yes, we mean yes. When we say no, we mean no. Honest hearts please God.",
    question: "Why do you think Jesus loves it so much when we tell the truth?",
    prayer: "Jesus, you are the Truth. Help me be honest in all I say. St. Anthony, pray that I always speak with a true heart.",
  },
  "2026-06-14": {
    liturgicalDay: "11th Sunday in Ordinary Time",
    gospelReference: "Luke 7:36–8:3",
    gospelText: "",
    thought: "A woman who had done many wrong things came to Jesus full of love. He forgave her completely, because she loved him so much.",
    question: "What does it feel like when someone forgives you? How does Jesus forgive even more?",
    prayer: "Jesus, thank you for forgiving me when I do wrong. Help me come to you with love. Wash my heart clean.",
  },
  "2026-06-15": {
    liturgicalDay: "Monday · 11th Week in Ordinary Time",
    gospelReference: "Matthew 5:38–42",
    gospelText: "",
    thought: "Jesus tells us to be different from the world. When someone is mean to us, we don’t fight back the same way — we choose love and patience.",
    question: "When someone hurts your feelings, what could you do that would make Jesus smile?",
    prayer: "Jesus, when others are unkind, help me not to be unkind back. Give me your patience and your peace. Teach me to love like you.",
  },
  "2026-06-16": {
    liturgicalDay: "Tuesday · 11th Week in Ordinary Time",
    gospelReference: "Matthew 5:43–48",
    gospelText: "",
    thought: "Jesus tells us to love even the people who are mean to us, and to pray for them. That is what makes us children of the Father in heaven.",
    question: "Is there someone you find hard to love? How could you pray for them today?",
    prayer: "Father, you love everyone, even people who hurt you. Help me love and pray for the people I find hard. Make my heart big like yours.",
  },
  "2026-06-17": {
    liturgicalDay: "Wednesday · 11th Week in Ordinary Time",
    gospelReference: "Matthew 6:1–6, 16–18",
    gospelText: "",
    thought: "When we do good things, we don’t need everyone to see — just God. The Father sees in secret, and quiet good deeds make him smile.",
    question: "What is a good thing you could do today that nobody else has to know about?",
    prayer: "Father, help me do good things just for you, not to show off. You see everything I do. I want my heart to please you.",
  },
  "2026-06-18": {
    liturgicalDay: "Thursday · 11th Week in Ordinary Time",
    gospelReference: "Matthew 6:7–15",
    gospelText: "",
    thought: "Jesus teaches us the Our Father — the perfect prayer. In it, we ask for what we need and learn to forgive others, just like God forgives us.",
    question: "Which line of the Our Father is your favorite? Why?",
    prayer: "Our Father, who art in heaven, hallowed be thy name. Thy kingdom come, thy will be done, on earth as it is in heaven. Help me pray this prayer with my whole heart.",
  },
  "2026-06-19": {
    liturgicalDay: "Friday · 11th Week in Ordinary Time",
    gospelReference: "Matthew 6:19–23",
    gospelText: "",
    thought: "Jesus says, “Where your treasure is, there your heart will be.” Things will break and wear out — but love for God lasts forever.",
    question: "What kind of treasure are you saving up in heaven by your good deeds?",
    prayer: "Jesus, you are my real treasure. Help me love you more than any toy or thing. Where you are, that is where my heart wants to be.",
  },
  "2026-06-20": {
    liturgicalDay: "Saturday · 11th Week in Ordinary Time",
    gospelReference: "Matthew 6:24–34",
    gospelText: "",
    thought: "Jesus tells us not to worry. Just look at the birds and the flowers — God takes care of them. He cares for us so much more.",
    question: "What is something you sometimes worry about? How does Jesus help you trust?",
    prayer: "Father, you take care of the birds and the flowers. I know you take care of me even more. Help me not to worry. I trust you.",
  },
  "2026-06-21": {
    liturgicalDay: "12th Sunday in Ordinary Time",
    gospelReference: "Luke 9:18–24",
    gospelText: "",
    thought: "Jesus asks his friends, “Who do you say that I am?” Peter answers, “You are the Christ.” Jesus wants each of us to answer that question too.",
    question: "Who is Jesus to you?",
    prayer: "Jesus, you are the Christ — the Son of the living God. You are my Lord, my Friend, and my Savior. Help me know you better every day.",
  },
  "2026-06-22": {
    liturgicalDay: "Monday · 12th Week in Ordinary Time",
    gospelReference: "Matthew 7:1–5",
    gospelText: "",
    thought: "Jesus says we should not judge others harshly. Before noticing the little speck in someone else’s eye, we should clean our own eye first.",
    question: "How can you be patient with someone else’s mistakes today?",
    prayer: "Jesus, help me see other people the kind way you see them. Show me my own faults first before I judge anyone else. Make me humble and kind.",
  },
  "2026-06-23": {
    liturgicalDay: "Tuesday · 12th Week in Ordinary Time",
    gospelReference: "Matthew 7:6, 12–14",
    gospelText: "",
    thought: "Jesus gives us the Golden Rule: “Do to others what you want them to do to you.” Treating others the way you want to be treated is how we follow him.",
    question: "How do you want to be treated by others? How can you treat someone that way today?",
    prayer: "Jesus, teach me to treat everyone the way I want to be treated. Help me be kind, fair, and gentle. Lead me through the narrow gate to your Kingdom.",
  },
  "2026-06-24": {
    liturgicalDay: "The Nativity of St. John the Baptist · Solemnity",
    gospelReference: "Luke 1:57–66, 80",
    gospelText: "",
    thought: "John the Baptist was born to prepare the way for Jesus. From the very beginning, God had a special job for him — just like he has a special plan for you.",
    question: "What special thing do you think God might have for you to do in your life?",
    prayer: "God, thank you for John the Baptist, who pointed the way to Jesus. Help me point to Jesus too, in everything I say and do. Show me your plan for me.",
  },
  "2026-06-25": {
    liturgicalDay: "Thursday · 12th Week in Ordinary Time",
    gospelReference: "Matthew 7:21–29",
    gospelText: "",
    thought: "Jesus says we should build our lives on his words, like a strong house on solid rock. When storms come, that house stands firm.",
    question: "What is one of Jesus’s teachings you want to build your life on?",
    prayer: "Jesus, you are the rock. Help me build my life on your words. When hard things happen, keep me strong because I trust in you.",
  },
  "2026-06-26": {
    liturgicalDay: "Friday · 12th Week in Ordinary Time",
    gospelReference: "Matthew 8:1–4",
    gospelText: "",
    thought: "A man with a terrible sickness came to Jesus. Jesus reached out and touched him, and he was healed. Jesus is never afraid to come close to us.",
    question: "When have you needed Jesus to come close to you? What was it like?",
    prayer: "Jesus, you came close to a man no one would touch. Come close to me too. Heal whatever needs healing in my heart.",
  },
  "2026-06-27": {
    liturgicalDay: "Saturday · 12th Week in Ordinary Time",
    gospelReference: "Matthew 8:5–17",
    gospelText: "",
    thought: "A Roman officer came to Jesus with such great trust that Jesus said, “I have not seen faith like this!” His simple trust made Jesus’s heart glad.",
    question: "At Mass we say, “Lord, I am not worthy that you should enter under my roof.” How is that like the officer’s prayer?",
    prayer: "Jesus, like the centurion, I trust that you can do anything. Lord, I am not worthy, but only say the word and my soul shall be healed.",
  },
  "2026-06-28": {
    liturgicalDay: "13th Sunday in Ordinary Time",
    gospelReference: "Luke 9:51–62",
    gospelText: "",
    thought: "Jesus calls people to follow him with all their hearts — no looking back. Following Jesus means going forward with him, every day.",
    question: "What does it mean to follow Jesus today, in your home and at school?",
    prayer: "Jesus, I want to follow you with my whole heart. Don’t let me look back when you call. Lead me, and I will go where you go.",
  },
  "2026-06-29": {
    liturgicalDay: "Sts. Peter and Paul · Apostles",
    gospelReference: "Matthew 16:13–19",
    gospelText: "",
    thought: "Jesus made Peter the rock his Church is built on, and gave him the keys of the Kingdom. Today we thank God for Sts. Peter and Paul, our first great teachers.",
    question: "What do you think it means that Jesus built his Church on a person — on Peter?",
    prayer: "Lord Jesus, thank you for St. Peter, the first pope, and St. Paul, who brought your good news to many. Keep our Church strong and faithful. Sts. Peter and Paul, pray for us.",
  },
  "2026-06-30": {
    liturgicalDay: "Tuesday · 13th Week in Ordinary Time",
    gospelReference: "Matthew 8:23–27",
    gospelText: "",
    thought: "Jesus’s friends were scared in a big storm, but Jesus was sleeping in the boat. When they woke him, he calmed the wind and waves with just a word.",
    question: "When your heart feels stormy, what could you ask Jesus to do?",
    prayer: "Jesus, when life feels scary or wild, calm my heart. Remind me you are in the boat with me. Even the wind and the sea obey you.",
  },
  "2026-07-01": {
    liturgicalDay: "Wednesday · 13th Week in Ordinary Time",
    gospelReference: "Matthew 8:28–34",
    gospelText: "",
    thought: "Jesus is stronger than anything that scares us. Even the bad spirits had to obey his word. He has all the power, and he uses it to help us.",
    question: "When you feel scared, what is one thing you can remember about Jesus?",
    prayer: "Jesus, you are stronger than anything that could ever scare me. Keep me safe in your love. I am never alone — you are with me.",
  },
  "2026-07-02": {
    liturgicalDay: "Thursday · 13th Week in Ordinary Time",
    gospelReference: "Matthew 9:1–8",
    gospelText: "",
    thought: "Jesus did something even greater than healing a man who could not walk — he forgave his sins. Jesus has the power to forgive, because he is God.",
    question: "How do you feel when you know your sins are forgiven by Jesus?",
    prayer: "Jesus, thank you for forgiving me when I am sorry. Help me know how much you love me. Heal my heart, just like you healed the man.",
  },
  "2026-07-03": {
    liturgicalDay: "St. Thomas · Apostle",
    gospelReference: "John 20:24–29",
    gospelText: "",
    thought: "Thomas wanted to see Jesus to believe. When he did, he said, “My Lord and my God!” Jesus blesses us when we believe without seeing.",
    question: "Jesus is here even when we can’t see him. Where do you feel him most?",
    prayer: "My Lord and my God! Help me believe in you even when I can’t see you. St. Thomas, pray for me when my faith feels small.",
  },
  "2026-07-04": {
    liturgicalDay: "Saturday · 13th Week in Ordinary Time · Independence Day (USA)",
    gospelReference: "Matthew 9:14–17",
    gospelText: "",
    thought: "Jesus came to make something new — new hearts, new joy, a new way of living. Today, on Independence Day, we thank God for the freedom to know and love him.",
    question: "What does it mean to be truly free in Jesus?",
    prayer: "Father, thank you for the freedom we have in our country, and for the deeper freedom Jesus gives us. Help me use my freedom to love you and serve others. Bless our country.",
  },
  "2026-07-05": {
    liturgicalDay: "14th Sunday in Ordinary Time",
    gospelReference: "Luke 10:1–12, 17–20",
    gospelText: "",
    thought: "Jesus sent 72 helpers out two-by-two to share his peace. He sends us out, too — to our families, our friends, and everyone we meet.",
    question: "How could you bring Jesus’s peace to someone today?",
    prayer: "Jesus, you sent your friends out to bring peace. Send me too — into my home, into my world. Let your peace start with me.",
  },
  "2026-07-06": {
    liturgicalDay: "Monday · 14th Week in Ordinary Time",
    gospelReference: "Matthew 9:18–26",
    gospelText: "",
    thought: "A little girl had died, but Jesus took her hand and said, “Get up.” She rose right away. Jesus has power even over death.",
    question: "How do you think the little girl’s family felt when Jesus brought her back?",
    prayer: "Jesus, you have power over everything — even death. Thank you for taking us by the hand and giving us new life. Hold me always.",
  },
  "2026-07-07": {
    liturgicalDay: "Tuesday · 14th Week in Ordinary Time",
    gospelReference: "Matthew 9:32–38",
    gospelText: "",
    thought: "Jesus said, “The harvest is great, but the workers are few.” He needs people who will share his love. He is looking for helpers.",
    question: "How could you be one of Jesus’s helpers today?",
    prayer: "Jesus, I want to be your helper. Show me how I can share your love today. Send more good people into your Church to help others know you.",
  },
  "2026-07-08": {
    liturgicalDay: "Wednesday · 14th Week in Ordinary Time",
    gospelReference: "Matthew 10:1–7",
    gospelText: "",
    thought: "Jesus picked twelve regular people — fishermen, a tax collector, friends — and made them his apostles. He calls regular people, like you and me, too.",
    question: "How do you think Jesus is calling you to follow him today?",
    prayer: "Jesus, you call regular people like me. Help me listen for your call today. I want to be your friend and your helper.",
  },
  "2026-07-09": {
    liturgicalDay: "Thursday · 14th Week in Ordinary Time",
    gospelReference: "Matthew 10:7–15",
    gospelText: "",
    thought: "Jesus tells his friends, “Wherever you go, bring peace.” We can bring Jesus’s peace into our own homes — by being kind, helpful, and forgiving.",
    question: "How can you bring peace to your home today?",
    prayer: "Jesus, fill our home with your peace. Help me be the kind of person who brings peace, not arguments. Make me a peacemaker like you.",
  },
  "2026-07-10": {
    liturgicalDay: "Friday · 14th Week in Ordinary Time",
    gospelReference: "Matthew 10:16–23",
    gospelText: "",
    thought: "Jesus tells us to be smart and gentle in this world — wise as snakes and gentle as doves. We do not have to be afraid; the Holy Spirit will help us.",
    question: "When is a time you need to be brave for Jesus?",
    prayer: "Holy Spirit, give me courage when it’s hard. Make me wise and gentle. Help me speak up for what is good, with a kind heart.",
  },
  "2026-07-11": {
    liturgicalDay: "St. Benedict · Abbot",
    gospelReference: "Matthew 10:24–33",
    gospelText: "",
    thought: "Jesus tells us not to be afraid — God knows even how many hairs are on our heads. We are so precious to him.",
    question: "What does it feel like to know God knows every little thing about you?",
    prayer: "Father, you know me better than I know myself. Thank you for caring about every part of me. St. Benedict, pray that I work and pray with love.",
  },
  "2026-07-12": {
    liturgicalDay: "15th Sunday in Ordinary Time",
    gospelReference: "Luke 10:25–37",
    gospelText: "",
    thought: "Jesus tells the story of the Good Samaritan — a man who stopped to help a stranger when others walked past. That is what it means to love our neighbor.",
    question: "Who in your life right now might need you to be a good Samaritan?",
    prayer: "Jesus, give me eyes to see who needs help today. Make me kind like the Good Samaritan. Help me stop and love the people you put in my path.",
  },
  "2026-07-13": {
    liturgicalDay: "Monday · 15th Week in Ordinary Time",
    gospelReference: "Matthew 10:34–11:1",
    gospelText: "",
    thought: "Jesus says that following him sometimes means choosing him even when it is hard. He is worth more than anything or anyone else.",
    question: "When is it hard to choose Jesus? How can he help you?",
    prayer: "Jesus, I choose you. When following you is hard, give me strength. You are more important than anything else in my life.",
  },
  "2026-07-14": {
    liturgicalDay: "St. Kateri Tekakwitha · Virgin",
    gospelReference: "Matthew 11:20–24",
    gospelText: "",
    thought: "Jesus is sad when people see his wonderful works but don’t change their hearts. He wants our hearts to be open to him and willing to grow.",
    question: "How is Jesus inviting your heart to grow today?",
    prayer: "Jesus, keep my heart open to you. Help me see your goodness all around me, and let it change me. St. Kateri, pray for me — help me love Jesus like you did.",
  },
  "2026-07-15": {
    liturgicalDay: "St. Bonaventure · Bishop and Doctor",
    gospelReference: "Matthew 11:25–27",
    gospelText: "",
    thought: "Jesus thanks the Father for showing the secrets of his Kingdom to little ones — to children, and to anyone with a simple, trusting heart.",
    question: "Why do you think God loves little, trusting hearts so much?",
    prayer: "Father, thank you for loving little hearts like mine. Keep me simple and trusting. St. Bonaventure, pray that I grow in wisdom and love.",
  },
  "2026-07-16": {
    liturgicalDay: "Thursday · 15th Week in Ordinary Time",
    gospelReference: "Matthew 11:28–30",
    gospelText: "",
    thought: "Jesus says, “Come to me, all who are tired, and I will give you rest.” When we feel worn out or sad, Jesus is the One we can run to.",
    question: "When you feel tired or sad, what does it look like to “come to Jesus”?",
    prayer: "Jesus, when I am tired, I come to you. When I am sad, I come to you. Give me your rest. Be my best friend, always.",
  },
  "2026-07-17": {
    liturgicalDay: "Friday · 15th Week in Ordinary Time",
    gospelReference: "Matthew 12:1–8",
    gospelText: "",
    thought: "Jesus said, “The Sabbath was made for people, not people for the Sabbath.” Sundays are God’s gift to us — a day to rest, pray, and be with family.",
    question: "What is something you love to do on Sundays with your family?",
    prayer: "Jesus, thank you for Sundays — a special day to be with you and my family. Help us make every Sunday a day of love and rest.",
  },
};

/** Default fall-back key used when a date has no matching entry. */
const DEFAULT_KEY = "2026-06-15";

/**
 * Format a JS Date as the source's `YYYY-MM-DD` key, using the date's
 * local calendar components (matching the original app's `dateKey` helper).
 */
function toDateKey(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Look up the devotion for a JS Date.
 *
 * Returns the entry keyed by the date's `YYYY-MM-DD` value. If there is no
 * exact match, falls back to the June 15 entry (`DEFAULT_KEY`), and if that
 * is somehow missing, to the first entry in `DEVOTIONS` — so the app always
 * has content to render.
 */
export function getDevotion(date: Date): Devotion {
  const exact = DEVOTIONS[toDateKey(date)];
  if (exact) return exact;

  const fallback = DEVOTIONS[DEFAULT_KEY];
  if (fallback) return fallback;

  // Last resort: first entry by insertion order. DEVOTIONS is always
  // non-empty, so this assertion is safe.
  const firstKey = Object.keys(DEVOTIONS)[0];
  return DEVOTIONS[firstKey] as Devotion;
}
