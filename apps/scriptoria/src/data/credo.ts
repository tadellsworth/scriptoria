/**
 * Credo — Catholic Catechism curriculum data.
 *
 * Extracted faithfully from the original gamified source app. All XP / hearts /
 * streak / scoring configuration has been intentionally dropped — only the
 * question *content* is preserved here.
 *
 * Answer encoding per question type (see `correct` field):
 *   - multipleChoice : `correct` is the 0-based index into `options`.
 *   - trueFalse      : `correct` is a boolean.
 *   - match          : `pairs` lists the correct [left, right] pairings in
 *                      order; `correct` is the identity index array
 *                      [0, 1, ...] (pair i's left matches pair i's right).
 *   - fillBlank      : `correct` is the answer text; `sentenceParts` carries
 *                      the prompt with "___" as the blank, and `options` holds
 *                      the word bank to choose from.
 *   - tapOrder       : `options` holds the tokens to arrange; `correct` is the
 *                      array of indices into `options` giving the correct order.
 *                      (In the source the tokens were already supplied in the
 *                      correct order, so this is the identity index array.)
 */

export type QuestionType =
  | 'multipleChoice'
  | 'trueFalse'
  | 'match'
  | 'fillBlank'
  | 'tapOrder';

export interface CredoQuestion {
  type: QuestionType;
  prompt: string;
  cccRef?: string; // e.g. "CCC 253"
  options?: string[]; // for multipleChoice / fillBlank (word bank) / tapOrder (tokens)
  pairs?: [string, string][]; // for match
  /** For fillBlank: the sentence split around the blank, with "___" as the blank marker. */
  sentenceParts?: string[];
  /** index, indices, text, or boolean — see encoding note in the file header. */
  correct: number | number[] | string | boolean;
  explanation?: string; // the gentle explanation shown after answering
}

export interface CredoLesson {
  id: string;
  title: string; // e.g. "The Holy Trinity"
  subtitle?: string;
  cccRef?: string; // CCC range covered by the lesson, e.g. "CCC 232–267"
  questions: CredoQuestion[];
}

export interface CredoUnit {
  id: string;
  title: string; // e.g. "The Creed"
  subtitle?: string;
  /** The "Pillar I · Part Two" style label from the source. */
  label?: string;
  lessons: CredoLesson[];
}

export const CURRICULUM: CredoUnit[] = [
  {
    id: 'foundations',
    label: 'Pillar I · Prologue',
    title: 'Foundations',
    subtitle: 'Beginning the Journey',
    lessons: [
      {
        id: 'f1',
        title: 'The Catechism',
        subtitle: 'What is it?',
        cccRef: 'CCC 1–25',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 1',
            prompt: 'What is the Catechism of the Catholic Church?',
            options: [
              'A history of the Vatican',
              'An official summary of Catholic teaching',
              'A book of Mass readings',
              'A list of all the saints',
            ],
            correct: 1,
            explanation:
              'The Catechism is a "sure norm for teaching the faith" — a complete, authoritative summary of what the Catholic Church believes and teaches, promulgated by Pope St. John Paul II in 1992.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 4',
            prompt: 'The word "catechism" comes from a Greek root meaning:',
            options: [
              'To pray silently',
              'To echo down, or to instruct',
              'To gather together',
              'To copy by hand',
            ],
            correct: 1,
            explanation:
              'From the Greek κατηχέω (katecheō), "to resound, to instruct orally." Catechesis was, from the very beginning, the way the faith was passed on.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 13',
            prompt:
              'The Catechism is divided into four major parts (or "pillars").',
            correct: true,
            explanation:
              'The Four Pillars: the Creed (what we believe), the Sacraments (how we worship), the Commandments (how we live), and Prayer (how we converse with God).',
          },
          {
            type: 'match',
            cccRef: 'CCC 13–17',
            prompt: 'Match each Pillar of the Catechism to what it teaches:',
            pairs: [
              ['The Creed', 'What we believe'],
              ['The Sacraments', 'How we worship'],
              ['The Commandments', 'How we live'],
              ['Prayer', 'How we converse with God'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              'These four pillars cover every area of the Christian life — belief, worship, action, and prayer.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 11',
            prompt:
              'Who promulgated the current Catechism of the Catholic Church?',
            options: [
              'Pope Pius XII',
              'Pope John XXIII',
              'Pope St. John Paul II',
              'Pope Benedict XVI',
            ],
            correct: 2,
            explanation:
              'Pope St. John Paul II promulgated it on October 11, 1992 — the 30th anniversary of the opening of the Second Vatican Council.',
          },
          {
            type: 'fillBlank',
            cccRef: 'CCC 11',
            prompt: 'Complete this description of the Catechism:',
            sentenceParts: ['A sure norm for teaching the ', '___', '.'],
            options: ['faith', 'priests', 'children', 'scripture', 'liturgy'],
            correct: 'faith',
            explanation:
              'St. John Paul II called it "a sure norm for teaching the faith" — meaning anyone can trust it as an authentic expression of Catholic belief.',
          },
          {
            type: 'tapOrder',
            cccRef: 'CCC 13',
            prompt: 'Arrange the Four Pillars in their order in the Catechism:',
            options: ['Creed', 'Sacraments', 'Commandments', 'Prayer'],
            correct: [0, 1, 2, 3],
            explanation:
              'Belief → Worship → Life → Prayer. The order is intentional: what we believe shapes how we worship, how we live, and how we pray.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 11',
            prompt:
              'The Catechism draws on Scripture, the Church Fathers, the saints, and the Magisterium.',
            correct: true,
            explanation:
              'The Catechism quotes the Bible, the Fathers of the Church, the liturgy, the saints, and council documents — the whole of Sacred Tradition.',
          },
        ],
      },
      {
        id: 'f2',
        title: 'Who is God?',
        subtitle: 'The One Who Is',
        cccRef: 'CCC 198–231',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 200',
            prompt:
              'What is the most fundamental truth God revealed about himself?',
            options: [
              'That he is all-powerful',
              'That there is only one God',
              'That he is kind',
              'That he created the world',
            ],
            correct: 1,
            explanation:
              "Monotheism — there is only one God — is the bedrock of Israel's faith, and ours. Everything else flows from this.",
          },
          {
            type: 'fillBlank',
            cccRef: 'CCC 201',
            prompt: "Complete the Shema (Deut 6:4) — Israel's great confession:",
            sentenceParts: [
              'Hear, O Israel: The LORD our God, the LORD is ',
              '___',
              '.',
            ],
            options: ['one', 'love', 'great', 'holy', 'good'],
            correct: 'one',
            explanation:
              'The Shema is prayed twice daily by observant Jews and was prayed by Jesus himself. It declares the oneness of God.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 203–213',
            prompt:
              "God's holy name revealed to Moses at the burning bush was:",
            options: ['Elohim', 'Adonai', 'I AM WHO I AM', 'The Almighty'],
            correct: 2,
            explanation:
              'In Exodus 3:14 God reveals his name as "I AM WHO I AM" (YHWH). It means God simply IS — pure being, the source of all that exists.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 296–298',
            prompt: 'God created the world out of pre-existing matter.',
            correct: false,
            explanation:
              'God created "ex nihilo" — out of nothing. He needs no raw material. Creation is entirely his free, gratuitous act.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 214',
            prompt: 'God is the God of:',
            options: [
              'Power and wrath',
              'Truth and love',
              'Justice only',
              'Mystery, beyond knowing',
            ],
            correct: 1,
            explanation:
              'CCC 214: God is "the God of truth and of love." Truth and love are inseparable in God — and they should be in us as well.',
          },
          {
            type: 'match',
            cccRef: 'CCC 218–221',
            prompt: 'Match each attribute to its meaning:',
            pairs: [
              ['Eternal', 'Without beginning or end'],
              ['Almighty', 'Nothing is impossible for him'],
              ['Merciful', 'Slow to anger, abounding in love'],
              ['Truth itself', 'He cannot deceive or be deceived'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              'These are not separate "parts" of God — God is simple. He IS eternity, IS power, IS mercy, IS truth.',
          },
          {
            type: 'tapOrder',
            cccRef: '1 John 4:8',
            prompt: 'Arrange this revelation from St. John:',
            options: ['God', 'is', 'love'],
            correct: [0, 1, 2],
            explanation:
              '1 John 4:8 — "God is love." Not "God loves" but "God IS love." Love is his very being. This is why the Trinity makes sense: love requires another.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 1',
            prompt: 'Why did God create us?',
            options: [
              'Because he was lonely',
              'To share in his blessed life',
              'To do work for him',
              'To worship him out of fear',
            ],
            correct: 1,
            explanation:
              'CCC 1 — God created us "in a plan of sheer goodness" to share in his own blessed life. Not because he needed anything. Pure gift.',
          },
        ],
      },
      {
        id: 'f3',
        title: 'The Holy Trinity',
        subtitle: 'One God, Three Persons',
        cccRef: 'CCC 232–267',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 234',
            prompt: 'The mystery of the Trinity is:',
            options: [
              'A puzzle we will eventually solve',
              'The central mystery of Christian faith and life',
              'A Catholic invention',
              'Not really important to salvation',
            ],
            correct: 1,
            explanation:
              'CCC 234: "The mystery of the Most Holy Trinity is the central mystery of Christian faith and life. It is the mystery of God in himself."',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 253',
            prompt:
              'The Father, the Son, and the Holy Spirit are three different Gods.',
            correct: false,
            explanation:
              'There is ONE God in THREE Persons. Three distinct Persons sharing one divine nature — not three Gods, and not one Person wearing three masks.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 253',
            prompt: 'Each Person of the Trinity is:',
            options: [
              'A part of God',
              'Fully and equally God',
              'A mode or form of God',
              'Subordinate to the Father',
            ],
            correct: 1,
            explanation:
              'The Father is God, the Son is God, the Holy Spirit is God — and yet there is only one God. Each Person is fully and equally divine.',
          },
          {
            type: 'match',
            cccRef: 'CCC 257–260',
            prompt:
              'Match each Person to their work in the economy of salvation:',
            pairs: [
              ['Father', 'Creator'],
              ['Son', 'Redeemer'],
              ['Holy Spirit', 'Sanctifier'],
            ],
            correct: [0, 1, 2],
            explanation:
              'Though all three work together inseparably ("the whole Trinity acts as one"), each Person is associated especially with creation, redemption, and sanctification.',
          },
          {
            type: 'fillBlank',
            cccRef: 'Matt 28:19',
            prompt: "Complete Christ's baptismal command:",
            sentenceParts: [
              'In the name of the Father, and of the Son, and of the ',
              '___',
              '.',
            ],
            options: ['Holy Spirit', 'Angels', 'Saints', 'Church', 'Apostles'],
            correct: 'Holy Spirit',
            explanation:
              'Matthew 28:19. Every Catholic prayer, blessing, and sacrament begins with these words. The Sign of the Cross confesses the Trinity.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 535',
            prompt:
              'When did the Trinity first appear together publicly in the Gospels?',
            options: [
              "At Christ's birth in Bethlehem",
              "At Christ's baptism in the Jordan",
              'At the Last Supper',
              'At Pentecost',
            ],
            correct: 1,
            explanation:
              'At the baptism in the Jordan, the Father spoke from heaven, the Son was anointed, and the Spirit descended like a dove. The whole Trinity, revealed.',
          },
          {
            type: 'tapOrder',
            cccRef: 'Doxology',
            prompt: 'Arrange the words of the Glory Be:',
            options: ['Glory', 'be', 'to', 'the', 'Father'],
            correct: [0, 1, 2, 3, 4],
            explanation:
              '"Glory be to the Father, and to the Son, and to the Holy Spirit..." — one of the oldest Trinitarian prayers in the Church.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 237',
            prompt:
              'The Trinity can be fully grasped by human reason alone, without revelation.',
            correct: false,
            explanation:
              'The Trinity is a mystery in the strict sense — it could never be known unless God revealed it. We can know God exists by reason, but the inner life of God required revelation.',
          },
        ],
      },
      {
        id: 'f4',
        title: 'Why We Exist',
        subtitle: 'Made for God',
        cccRef: 'CCC 27–49',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 1',
            prompt:
              'According to the Catechism, why did God create us?',
            options: [
              'We were an accident of evolution',
              'To know him, love him, and share in his life',
              'To populate the earth',
              'To prove his power',
            ],
            correct: 1,
            explanation:
              'The Baltimore Catechism\'s famous answer rings true: "God made me to know him, to love him, and to serve him in this world, and to be happy with him forever in the next."',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 27',
            prompt: 'The desire for God is written in every human heart.',
            correct: true,
            explanation:
              'CCC 27: "The desire for God is written in the human heart, because man is created by God and for God." Every person is born with this longing.',
          },
          {
            type: 'fillBlank',
            cccRef: 'St. Augustine, Confessions 1.1',
            prompt: "Complete St. Augustine's prayer:",
            sentenceParts: [
              'Our hearts are restless until they rest in ',
              '___',
              '.',
            ],
            options: ['you', 'peace', 'heaven', 'love', 'truth'],
            correct: 'you',
            explanation:
              'Augustine\'s Confessions, Book 1: "You have made us for yourself, O Lord, and our hearts are restless until they rest in you." Every restless craving points to God.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 31–35',
            prompt: 'How can we come to know God by our own reason?',
            options: [
              'Only through Scripture',
              'Through the natural world and the human person',
              'Only through mystical experience',
              'We cannot — we need direct revelation',
            ],
            correct: 1,
            explanation:
              'The order, beauty, and intelligibility of creation, and the moral law within us, point to God. This is called "natural theology" — Romans 1:20.',
          },
          {
            type: 'match',
            cccRef: 'CCC 1700–1729',
            prompt: 'Match each gift God gave us:',
            pairs: [
              ['Reason', 'To know truth'],
              ['Free will', 'To choose the good'],
              ['Conscience', 'To recognize right and wrong'],
            ],
            correct: [0, 1, 2],
            explanation:
              "We are made in God's image — meaning we share, in a small way, in his attributes: knowing, willing, and loving.",
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 1849–1850',
            prompt: 'What is the chief obstacle to friendship with God?',
            options: [
              'Lack of education',
              'Material poverty',
              'Sin',
              'Suffering',
            ],
            correct: 2,
            explanation:
              'Sin is what separates us from God. Suffering and poverty can actually draw us closer to him; sin is what pulls us away. The good news: Christ came to undo sin.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 1730',
            prompt:
              'God created us free, capable of choosing good or evil.',
            correct: true,
            explanation:
              'True freedom is the power to do what is good — but God gave us real freedom, which means we can misuse it. He could have made robots; he chose to make persons.',
          },
          {
            type: 'tapOrder',
            cccRef: 'CCC 27',
            prompt: 'Arrange this truth from the Catechism:',
            options: ['Man', 'is', 'made', 'for', 'God'],
            correct: [0, 1, 2, 3, 4],
            explanation:
              'You were made FOR God. Not by accident, not for your work, not for other people. For God. Everything else in life only makes sense in light of this.',
          },
        ],
      },
    ],
  },
  {
    id: 'creed',
    label: 'Pillar I · Part Two',
    title: 'The Creed',
    subtitle: 'What We Believe',
    lessons: [
      {
        id: 'c1',
        title: 'I Believe',
        subtitle: 'The Act of Faith',
        cccRef: 'CCC 142–184',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 150',
            prompt: 'What is faith, according to the Catechism?',
            options: [
              'A vague feeling of comfort',
              'Personal trust in God and assent to the truths He reveals',
              'Blind acceptance without thinking',
              'An emotion that comes and goes',
            ],
            correct: 1,
            explanation:
              'Faith is both personal (I trust God) AND intellectual (I believe what He reveals). It is not pure feeling, not pure reasoning — it is the whole person responding to God.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 156–159',
            prompt: 'Faith and reason are opposed to each other.',
            correct: false,
            explanation:
              'Pope St. John Paul II called faith and reason "the two wings on which the human spirit rises to the contemplation of truth." The Catholic Church has always held that faith and reason work together — never against each other.',
          },
          {
            type: 'fillBlank',
            cccRef: 'CCC 158',
            prompt: "Complete St. Anselm's famous phrase:",
            sentenceParts: ['Faith seeks ', '___', '.'],
            options: [
              'understanding',
              'peace',
              'miracles',
              'holiness',
              'comfort',
            ],
            correct: 'understanding',
            explanation:
              'St. Anselm\'s "fides quaerens intellectum" — faith seeks understanding. We do not believe in order to stop thinking; we believe in order to think rightly about God.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 153',
            prompt: 'Faith is fundamentally...',
            options: [
              'Something we earn through good works',
              'A gift from God',
              'A natural ability all humans share',
              'Inherited automatically from parents',
            ],
            correct: 1,
            explanation:
              'Faith is a supernatural gift, freely given by God. We can prepare for it, ask for it, and cooperate with it — but ultimately it is His gift, not our achievement.',
          },
          {
            type: 'match',
            cccRef: 'CCC 142–166',
            prompt: 'Match each aspect of faith to its meaning:',
            pairs: [
              ['Credo (I believe)', 'The personal act of faith'],
              ['Credimus (We believe)', 'The faith of the Church'],
              ['Obedience of faith', 'Submitting freedom to God'],
              ['Faith handed on', 'Received through the Apostles'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              'Faith is both deeply personal AND inseparable from the Church. We never believe alone — we believe with the Church, in a faith handed down from the Apostles.',
          },
          {
            type: 'tapOrder',
            cccRef: 'Nicene Creed',
            prompt: 'Arrange the opening of the Nicene Creed:',
            options: ['I', 'believe', 'in', 'one', 'God'],
            correct: [0, 1, 2, 3, 4],
            explanation:
              'The first words of the Nicene Creed. Every act of Christian faith begins here — with the assertion that there is one God.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 166',
            prompt: 'Through whom did we ultimately receive the faith?',
            options: [
              'Modern theologians',
              'Our own intuition',
              'Our family, the Church, and the Apostles',
              'Only the Pope',
            ],
            correct: 2,
            explanation:
              'Faith is handed on (tradition). We received it through our parents, godparents, and the Church — and through the Church, from the Apostles, and through them, from Christ Himself.',
          },
          {
            type: 'trueFalse',
            cccRef: 'James 2:26 · CCC 1814–1816',
            prompt: 'True faith inevitably shows itself in how we live.',
            correct: true,
            explanation:
              '"Faith without works is dead" (James 2:26). Genuine faith always overflows into action. If we truly believe God is who He says He is, our lives will show it.',
          },
        ],
      },
      {
        id: 'c2',
        title: 'The Symbol',
        subtitle: 'Of Faith',
        cccRef: 'CCC 185–197',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 187',
            prompt: 'The word "Creed" (Latin: Credo) means...',
            options: ['"I doubt"', '"I believe"', '"I pray"', '"I obey"'],
            correct: 1,
            explanation:
              'Creed comes from the Latin "credo" — "I believe." Each Creed is a confession of faith, beginning with this personal verb.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 191',
            prompt:
              "How many articles is the Apostles' Creed traditionally divided into?",
            options: ['Seven', 'Ten', 'Twelve', 'Fourteen'],
            correct: 2,
            explanation:
              "The Apostles' Creed has twelve articles — traditionally one for each Apostle. The actual development was gradual, growing out of ancient baptismal creeds, but the twelvefold structure stuck.",
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 195',
            prompt:
              'The Nicene Creed has its origins at the First Council of Nicaea (AD 325).',
            correct: true,
            explanation:
              'The Council of Nicaea responded to the Arian heresy by defining that Christ is "of one substance" with the Father. The Creed was later expanded at Constantinople (381), giving us the full Niceno-Constantinopolitan Creed we pray at Mass.',
          },
          {
            type: 'fillBlank',
            cccRef: 'CCC 750',
            prompt: 'Complete the four marks of the Church from the Creed:',
            sentenceParts: [
              'I believe in one, holy, ',
              '___',
              ', and apostolic Church.',
            ],
            options: ['catholic', 'faithful', 'ancient', 'perfect', 'universal'],
            correct: 'catholic',
            explanation:
              "The four marks of the Church: One, Holy, Catholic (universal), and Apostolic. Together, these four characteristics identify Christ's true Church.",
          },
          {
            type: 'match',
            cccRef: 'CCC 190',
            prompt: 'The Creed has three parts. Match each to its subject:',
            pairs: [
              ['First part', 'God the Father and creation'],
              ['Second part', 'Jesus Christ and redemption'],
              ['Third part', 'Holy Spirit and the Church'],
            ],
            correct: [0, 1, 2],
            explanation:
              'The Creed is Trinitarian in structure — three parts mirroring the three Persons of God. This is not accidental; it reflects how Baptism is administered: "In the name of the Father, and of the Son, and of the Holy Spirit."',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 188',
            prompt:
              'The Greek word "symbolon" (root of "Symbol of Faith") originally meant...',
            options: [
              'A secret password',
              'A token of recognition broken in two',
              'A mystical sign',
              'A drawing',
            ],
            correct: 1,
            explanation:
              'A "symbolon" was a token broken in two, with each party keeping half. Reassembled, it identified its bearers as friends. A creed was your half — your "symbol" — that identified you as a fellow Christian.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 196–197',
            prompt:
              "The Apostles' Creed and the Nicene Creed contradict each other on key points.",
            correct: false,
            explanation:
              "They agree completely. The Nicene Creed is longer and more precise (especially about Christ's divinity), but it is an expansion of the same apostolic faith, not a different one.",
          },
          {
            type: 'tapOrder',
            cccRef: "Apostles' Creed",
            prompt: "Arrange the opening words of the Apostles' Creed:",
            options: ['I', 'believe', 'in', 'God', 'the', 'Father'],
            correct: [0, 1, 2, 3, 4, 5],
            explanation:
              'The opening of the Apostles\' Creed. "Patrem Omnipotentem" — almighty Father. The Church\'s prayer always begins with this confession of the First Person of the Trinity.',
          },
        ],
      },
      {
        id: 'c3',
        title: 'Maker of All',
        subtitle: 'Heaven and Earth',
        cccRef: 'CCC 279–421',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 325–327',
            prompt: 'In the Creed, "heaven and earth" means...',
            options: [
              'Just the sky above and the ground below',
              'All visible AND invisible creation',
              'Only the physical universe',
              'Only spiritual realities',
            ],
            correct: 1,
            explanation:
              '"Heaven" refers to the invisible spiritual realm (angels, paradise); "earth" refers to the visible material realm. Together, they mean ALL of creation — every existing thing apart from God.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 328–336',
            prompt:
              'Angels are real, personal, spiritual beings created by God.',
            correct: true,
            explanation:
              'Angels are not metaphors or pious imagination. They are personal, intelligent, spiritual creatures who serve God and minister to His people. Each of us has a guardian angel from baptism (CCC 336).',
          },
          {
            type: 'fillBlank',
            cccRef: 'Genesis 1:31',
            prompt: "Complete God's verdict on creation:",
            sentenceParts: [
              'And God saw everything that he had made, and behold, it was very ',
              '___',
              '.',
            ],
            options: ['good', 'holy', 'perfect', 'beautiful', 'wondrous'],
            correct: 'good',
            explanation:
              'Six times in Genesis 1, God calls creation "good." On the seventh — once humanity is included — He calls it "very good." Creation is fundamentally good. Evil is a corruption of it, not part of its design.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 355–358',
            prompt: 'What makes humans unique among all earthly creatures?',
            options: [
              'Our intelligence',
              'Our ability to communicate',
              'We are made in the image and likeness of God',
              'Our opposable thumbs',
            ],
            correct: 2,
            explanation:
              '"Of all visible creatures only man is able to know and love his Creator." We are the only earthly creature God willed for its own sake — capable of knowing Him, loving Him, and sharing in His own divine life.',
          },
          {
            type: 'match',
            cccRef: 'CCC 362–368',
            prompt: 'Match each aspect of the human person:',
            pairs: [
              ['Body', 'Material principle, animated by the soul'],
              ['Soul', 'Spiritual principle, immortal'],
              ['Heart', 'Inmost center of the person'],
              ['Image of God', 'Capacity to know and love'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              "The human person is body AND soul united — not a soul trapped in a body, but a single being. The body matters; the soul matters; together they make the human person made in God's image.",
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 396–401',
            prompt: 'What was the effect of original sin on human nature?',
            options: [
              'Human nature became completely evil',
              'Human nature was wounded but not destroyed',
              'Nothing changed at all',
              'God abandoned humanity entirely',
            ],
            correct: 1,
            explanation:
              'Original sin wounded human nature — we still have reason, free will, and the capacity for good, but they are weakened. We need grace to do consistent good. We are not totally depraved; we are injured and need the Divine Physician.',
          },
          {
            type: 'tapOrder',
            cccRef: 'Genesis 1:1',
            prompt: 'Arrange the opening of the Bible:',
            options: ['In', 'the', 'beginning', 'God', 'created'],
            correct: [0, 1, 2, 3, 4],
            explanation:
              'Genesis 1:1 — "In the beginning, God created the heavens and the earth." The very first claim of Scripture: God is the source of all that exists. Before the universe, there was God.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 295',
            prompt:
              'God created the universe because He needed something outside Himself.',
            correct: false,
            explanation:
              'God created in total freedom, out of pure goodness. He needed nothing. He created us as sheer gift — to share His own blessed life with creatures who could freely respond in love.',
          },
        ],
      },
      {
        id: 'c4',
        title: 'Jesus Christ',
        subtitle: 'His Names',
        cccRef: 'CCC 422–455',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 430–435',
            prompt: 'The name "Jesus" means...',
            options: [
              '"Holy One"',
              '"God saves"',
              '"King of kings"',
              '"Son of David"',
            ],
            correct: 1,
            explanation:
              '"Jesus" is the Greek form of the Hebrew "Yeshua" — meaning "YHWH saves," or simply "God saves." The angel gave Mary this name BEFORE His birth (Luke 1:31). The name itself contains the gospel.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 436–440',
            prompt: 'The title "Christ" means...',
            options: [
              '"Son of God"',
              '"The Anointed One" (Messiah)',
              '"The Holy One"',
              '"Lord"',
            ],
            correct: 1,
            explanation:
              '"Christ" is the Greek "Christos," meaning "Anointed One" — the same as the Hebrew "Mashiach" (Messiah). Jesus is the long-promised Anointed One who fulfills the three offices of Priest, Prophet, and King.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 436',
            prompt: '"Christ" is Jesus\'s last name, like a family surname.',
            correct: false,
            explanation:
              '"Christ" is a TITLE, not a surname. To say "Jesus Christ" is to make a creedal statement: this Jesus IS the Messiah. The early Christians risked their lives to proclaim this.',
          },
          {
            type: 'fillBlank',
            cccRef: 'Nicene Creed',
            prompt: 'Complete this phrase from the Nicene Creed:',
            sentenceParts: ['', '___', ' from Light, true God from true God.'],
            options: ['Light', 'Heaven', 'Power', 'Eternity', 'Glory'],
            correct: 'Light',
            explanation:
              '"Light from Light" — a beautiful image from the Nicene Creed. As light comes from a source without diminishing it, so the Son is begotten of the Father without dividing or diminishing the divine nature.',
          },
          {
            type: 'match',
            cccRef: 'CCC 436, 783–786',
            prompt: "Christ's threefold office — match each role to its work:",
            pairs: [
              ['Priest', 'Offers sacrifice and intercedes'],
              ['Prophet', 'Proclaims the truth of God'],
              ['King', 'Reigns over all creation'],
            ],
            correct: [0, 1, 2],
            explanation:
              'At baptism, every Christian shares in these three offices of Christ. We are all called to be priest, prophet, and king in our own state of life.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'Matthew 3:17 · CCC 535',
            prompt:
              "At Jesus's baptism in the Jordan, the Father's voice from heaven declared:",
            options: [
              '"I am the Lord your God"',
              '"This is my beloved Son"',
              '"Blessed is he who comes in the name of the Lord"',
              '"Repent and believe"',
            ],
            correct: 1,
            explanation:
              '"This is my beloved Son, with whom I am well pleased." The Father testifies publicly to the divinity of Jesus at His baptism. The same voice will speak again at the Transfiguration: "Listen to him."',
          },
          {
            type: 'tapOrder',
            cccRef: 'Matthew 16:16 · CCC 442',
            prompt: "Arrange Peter's confession at Caesarea Philippi:",
            options: ['You', 'are', 'the', 'Christ'],
            correct: [0, 1, 2, 3],
            explanation:
              "Peter's confession — the first apostolic profession of faith. Jesus called it the rock on which He would build His Church (Matthew 16:18). Every Christian creed is an echo of this moment.",
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 446–451',
            prompt:
              'When early Christians called Jesus "Lord," they meant He is God.',
            correct: true,
            explanation:
              '"Lord" (Kyrios) was the Greek translation of "YHWH" — God\'s covenant name in the Old Testament. Calling Jesus "Lord" was a declaration that He is God Himself. It was treason in Rome (Caesar was "Lord") and scandalous in Judaism — but it was the truth.',
          },
        ],
      },
      {
        id: 'c5',
        title: 'God and Man',
        subtitle: 'The Incarnation',
        cccRef: 'CCC 456–486',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 457',
            prompt: 'Why did the Son of God become man?',
            options: [
              'To teach us moral lessons',
              'To save us by reconciling us with God',
              'Because He wanted to experience humanity',
              'To start a new religion',
            ],
            correct: 1,
            explanation:
              'The first and primary reason: salvation. The Word became flesh to save us. He did not come merely to teach — He came to RESCUE us from sin and death and reunite us with God.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 464',
            prompt: 'Jesus is 50% God and 50% man.',
            correct: false,
            explanation:
              'A common mistake. Jesus is FULLY God AND FULLY man — 100% both, without division, confusion, or mixing. He did not trade some divinity for humanity; He took on a complete human nature while remaining fully divine.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 464–469',
            prompt: 'The Incarnation means Jesus is...',
            options: [
              'One Person with one nature',
              'Two Persons with one nature',
              'One Person with two natures (divine and human)',
              'Two Persons with two natures',
            ],
            correct: 2,
            explanation:
              'Jesus is ONE Divine Person who possesses TWO complete natures — a divine nature (always) and a human nature (taken on at the Incarnation). One "who," two "whats."',
          },
          {
            type: 'fillBlank',
            cccRef: 'John 1:14',
            prompt: "Complete St. John's statement of the Incarnation:",
            sentenceParts: [
              'And the Word became ',
              '___',
              ' and dwelt among us.',
            ],
            options: ['flesh', 'man', 'human', 'real', 'near'],
            correct: 'flesh',
            explanation:
              'The most concise statement of the Incarnation in Scripture. "The Word became FLESH" — not just appeared in flesh, not put on a human costume. He really, truly took on full human nature, body and soul.',
          },
          {
            type: 'match',
            cccRef: 'CCC 464–469',
            prompt: 'Match each early heresy to its error about Christ:',
            pairs: [
              ['Arianism', 'Denied Jesus is fully God'],
              ['Docetism', 'Denied Jesus is fully man'],
              ['Nestorianism', 'Split Christ into two persons'],
              ['Monophysitism', 'Said Christ has only one nature'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              'The early Church fought to express the truth clearly: Jesus is fully God, fully man, one Person, two natures. Each heresy denied one piece of this truth — and the Councils responded with greater clarity.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 467',
            prompt: 'The Council of Chalcedon (AD 451) declared that Christ is...',
            options: [
              'Mostly God, partly man',
              'Like God in some ways',
              '"Truly God and truly man" — one Person in two natures',
              'A new kind of being, neither God nor man',
            ],
            correct: 2,
            explanation:
              'Chalcedon\'s definition is THE definitive statement of Christology: "One and the same Christ... in two natures, without confusion, without change, without division, without separation."',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 475',
            prompt: 'Jesus had both a divine will AND a human will.',
            correct: true,
            explanation:
              'Yes. In Gethsemane, His human will recoiled from suffering, but freely submitted: "not my will, but yours be done." Against the Monothelite heresy (one will), the Church defined that Christ has two complete wills, in perfect harmony.',
          },
          {
            type: 'tapOrder',
            cccRef: 'Nicene Creed',
            prompt: 'Arrange this phrase from the Nicene Creed about Christ:',
            options: ['true', 'God', 'from', 'true', 'God'],
            correct: [0, 1, 2, 3, 4],
            explanation:
              '"True God from true God, begotten not made, consubstantial with the Father." The Nicene Creed\'s response to Arius. Jesus is not a created being or a demigod — He is genuinely, fully God.',
          },
        ],
      },
      {
        id: 'c6',
        title: 'Born of Mary',
        subtitle: 'The Virgin',
        cccRef: 'CCC 484–511',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 484–486',
            prompt: 'The Annunciation is the event when...',
            options: [
              'Mary visited her cousin Elizabeth',
              'The angel Gabriel told Mary she would bear the Son of God',
              'Jesus was born in Bethlehem',
              'Mary was assumed into heaven',
            ],
            correct: 1,
            explanation:
              'Luke 1:26–38. The angel Gabriel was sent to Mary in Nazareth to announce she would conceive by the Holy Spirit and bear the Son of God. The Church celebrates this on March 25 — nine months before Christmas.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 490–493',
            prompt: 'The Immaculate Conception refers to...',
            options: [
              'Mary conceiving Jesus without a human father',
              'Mary herself being conceived without original sin',
              "Jesus's miraculous conception",
              'Mary remaining a virgin forever',
            ],
            correct: 1,
            explanation:
              "A common confusion. The Immaculate Conception is about MARY's conception (in St. Anne's womb), NOT Jesus's. By a singular grace, God preserved Mary from original sin from the first moment of her existence.",
          },
          {
            type: 'trueFalse',
            cccRef: 'Luke 1:38 · CCC 494',
            prompt:
              'Mary was forced to say yes at the Annunciation — she had no real choice.',
            correct: false,
            explanation:
              '"Let it be done unto me according to your word" (Luke 1:38). Mary freely consented. God respected her freedom. The Incarnation depended on the free "yes" of a young Jewish woman. Heaven held its breath.',
          },
          {
            type: 'fillBlank',
            cccRef: 'Luke 1:28',
            prompt:
              "Complete Gabriel's greeting to Mary (the opening of the Hail Mary):",
            sentenceParts: ['Hail Mary, full of ', '___', '.'],
            options: ['grace', 'glory', 'love', 'joy', 'faith'],
            correct: 'grace',
            explanation:
              '"Kecharitomene" in Greek — Gabriel\'s greeting to Mary. It is a perfect passive participle meaning "having been completely filled with grace." This unique title points to her Immaculate Conception.',
          },
          {
            type: 'match',
            cccRef: 'CCC 495, 499, 502–507',
            prompt: 'Match each Marian title to its meaning:',
            pairs: [
              ['Theotokos', '"God-bearer" — Mother of God'],
              ['Ever-Virgin', 'Virgin before, during, and after birth'],
              ['New Eve', "Undoes Eve's disobedience through her yes"],
              ['Mother of the Church', 'Given to all disciples at the Cross'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              'Each Marian title is doctrinally precise. Each tells us something true about Mary — and through her, something true about Jesus and His Church.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 495',
            prompt:
              'Why is Mary rightly called "Mother of God" (Theotokos)?',
            options: [
              'Because she is divine herself',
              'Because her Son is truly God, so she is the mother of God-made-man',
              'Because she rules over angels',
              'Because she existed before Jesus',
            ],
            correct: 1,
            explanation:
              "Defined at the Council of Ephesus (431) against Nestorius. Mary is not mother of Jesus's divine nature — He is eternally begotten of the Father. But she is the mother of the PERSON of Jesus, who is God. Therefore: Mother of God.",
          },
          {
            type: 'tapOrder',
            cccRef: 'Luke 1:28',
            prompt: 'Arrange the opening of the Hail Mary:',
            options: ['Hail', 'Mary', 'full', 'of', 'grace'],
            correct: [0, 1, 2, 3, 4],
            explanation:
              "From Luke 1:28 — Gabriel's greeting. Combined with Elizabeth's words (Luke 1:42) and the Church's added intercession, this became the Hail Mary, the second most-prayed prayer in Christianity.",
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 410–411, 494',
            prompt: 'Mary is sometimes called "the new Eve."',
            correct: true,
            explanation:
              "As Eve's disobedience brought sin into the world, Mary's obedience brought the Savior. Where Eve said NO to God's command, Mary said YES to God's invitation. St. Irenaeus (2nd century): \"The knot of Eve's disobedience was loosed by the obedience of Mary.\"",
          },
        ],
      },
    ],
  },
  {
    id: 'paschal',
    label: 'Pillar I · Part Three',
    title: 'The Paschal Mystery',
    subtitle: 'He Suffered for Us',
    lessons: [
      {
        id: 'p1',
        title: 'The Hour',
        subtitle: 'Toward the Cross',
        cccRef: 'CCC 571–594',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 571',
            prompt: 'The Paschal Mystery refers to...',
            options: [
              'The Last Supper alone',
              "Christ's Passion, Death, Resurrection, and Ascension",
              'Only Good Friday',
              'Christmas and Easter together',
            ],
            correct: 1,
            explanation:
              'The Paschal Mystery is the heart of Christ\'s saving work — His Passion, Death, Resurrection, and Ascension. "Paschal" comes from "Pesach" (Passover), because Christ is the true Passover Lamb whose blood saves us.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 572',
            prompt: 'Jesus knew He would suffer and die long before it happened.',
            correct: true,
            explanation:
              'Jesus predicted His Passion three times in the Gospels (Mark 8:31, 9:31, 10:33). He freely entered Jerusalem knowing what awaited Him. This was not a tragedy that happened TO Him — it was His freely chosen mission.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 574–594',
            prompt:
              "Why did many Jewish leaders reject Jesus's claim to be Messiah?",
            options: [
              "They didn't believe in God",
              'They expected a political messiah who would defeat Rome',
              'They had never heard of Him',
              'He was a foreigner',
            ],
            correct: 1,
            explanation:
              "Many awaited a Messiah who would militarily liberate Israel from Rome. Jesus's spiritual kingdom and willingness to suffer did not match those expectations. The Catechism is clear (CCC 597): responsibility for Jesus's death cannot be attributed to any Jews today — all sinners share that responsibility.",
          },
          {
            type: 'fillBlank',
            cccRef: 'Mark 10:45',
            prompt: "Complete Jesus's statement of His mission:",
            sentenceParts: [
              'The Son of Man came not to be served, but to ',
              '___',
              '.',
            ],
            options: ['serve', 'save', 'conquer', 'reign', 'teach'],
            correct: 'serve',
            explanation:
              '"The Son of Man came not to be served but to serve, and to give his life as a ransom for many" (Mark 10:45). This single verse sums up Jesus\'s whole mission — service unto death.',
          },
          {
            type: 'match',
            cccRef: 'CCC 574–594',
            prompt: 'Match each charge brought against Jesus to its source:',
            pairs: [
              ['Blasphemy', 'The Sanhedrin — for claiming divinity'],
              ['Insurrection', 'The Romans — for claiming kingship'],
              ['Sabbath-breaking', 'Pharisees — over His healings'],
              ['Threatening the Temple', 'Religious leaders'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              'Jesus was tried by both Jewish religious authorities and Roman civil authorities. None of the charges were true in the sense intended — yet each was true in a deeper sense: He IS God, He IS King, His Temple was His Body.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 596',
            prompt: "What was Pilate's verdict regarding Jesus?",
            options: [
              'Guilty of insurrection',
              'Guilty of blasphemy',
              '"I find no guilt in him" — yet he handed Him over anyway',
              'Mentally unstable',
            ],
            correct: 2,
            explanation:
              'Pilate declared Jesus innocent three times (Luke 23:4, 14, 22) but yielded to political pressure. He famously washed his hands of the matter — but moral responsibility cannot be washed away. A monument of cowardice.',
          },
          {
            type: 'tapOrder',
            cccRef: 'Luke 22:42',
            prompt: "Arrange Jesus's prayer in Gethsemane:",
            options: ['Not', 'my', 'will', 'but', 'yours'],
            correct: [0, 1, 2, 3, 4],
            explanation:
              '"Father, if you are willing, take this cup from me; yet not my will, but yours, be done" (Luke 22:42). The agony in the garden shows Jesus\'s true humanity — He shrank from suffering — and His perfect obedience: His human will freely chose the Father\'s.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 591 · Mark 14:61–64',
            prompt: 'The high priest formally condemned Jesus for blasphemy.',
            correct: true,
            explanation:
              'When the high priest asked, "Are you the Christ, the Son of the Blessed?" Jesus answered: "I am" — and they condemned Him for blasphemy. The irony: He was condemned for telling the truth about who He is.',
          },
        ],
      },
      {
        id: 'p2',
        title: 'The Cross',
        subtitle: 'Passion and Death',
        cccRef: 'CCC 595–623',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 610–611',
            prompt:
              'At the Last Supper, what did Jesus do that pointed forward to His sacrifice?',
            options: [
              'He preached a long sermon',
              'He instituted the Eucharist, anticipating His sacrifice',
              'He chose new apostles',
              'He prayed alone for hours',
            ],
            correct: 1,
            explanation:
              '"This is my body, given for you. This is my blood, poured out for you" (Luke 22:19–20). The Last Supper made the Cross a sacrament — and every Mass since makes the one sacrifice of Calvary present again.',
          },
          {
            type: 'trueFalse',
            cccRef: 'Matthew, Mark, Luke, John',
            prompt: "All four Gospels describe Christ's crucifixion.",
            correct: true,
            explanation:
              'At a time when crucifixion was the most shameful death imaginable, the early Christians did not hide this central event. They proclaimed it openly: this is how God saved us. "We preach Christ crucified" — 1 Cor 1:23.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'Mark 15:21',
            prompt: "Who carried Jesus's cross part of the way to Calvary?",
            options: [
              'John the apostle',
              'Mary, His mother',
              'Simon of Cyrene',
              'Peter',
            ],
            correct: 2,
            explanation:
              'Simon of Cyrene, a passerby, was compelled by Roman soldiers to help. His sons Alexander and Rufus are later mentioned by name as known Christians (Romans 16:13) — suggesting his chance encounter with Christ changed his whole family.',
          },
          {
            type: 'fillBlank',
            cccRef: 'John 19:30',
            prompt:
              "Complete Jesus's final word from the Cross (in John's Gospel):",
            sentenceParts: ['It is ', '___', '.'],
            options: ['finished', 'done', 'over', 'ended', 'fulfilled'],
            correct: 'finished',
            explanation:
              '"It is finished" — in Greek, "Tetelestai." Not a sigh of defeat, but a cry of victory. The mission is accomplished. The same word was written across receipts when a debt was completely paid: "Paid in full."',
          },
          {
            type: 'match',
            cccRef: 'The Seven Last Words',
            prompt:
              "Match each of Christ's words from the Cross to its meaning:",
            pairs: [
              ['"Father, forgive them"', 'Mercy for His persecutors'],
              ['"Today, with me in Paradise"', 'The promise to the good thief'],
              ['"Behold your mother"', 'Mary entrusted to all disciples'],
              ['"It is finished"', 'The mission of redemption complete'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              "The Seven Last Words from the Cross reveal Christ's heart at the moment of His sacrifice — forgiving, saving, providing, suffering, accomplishing. The Church meditates on them especially on Good Friday.",
          },
          {
            type: 'multipleChoice',
            cccRef: 'John 19:19–22',
            prompt:
              'The letters "INRI" on traditional crucifixes stand for...',
            options: [
              'A Latin prayer',
              '"In the Name of the Risen Jesus"',
              '"Jesus of Nazareth, King of the Jews" in Latin',
              'A code used by the early Church',
            ],
            correct: 2,
            explanation:
              'INRI = "Iesus Nazarenus Rex Iudaeorum." The placard above the Cross was meant as Roman mockery. The chief priests asked Pilate to change it; he refused: "What I have written, I have written" (John 19:22). Truth proclaimed even in mockery.',
          },
          {
            type: 'tapOrder',
            cccRef: 'Luke 23:46',
            prompt: "Arrange Jesus's final word from the Cross (in Luke):",
            options: ['Father', 'into', 'your', 'hands'],
            correct: [0, 1, 2, 3],
            explanation:
              '"Father, into your hands I commend my spirit" — quoting Psalm 31. Jesus dies as He lived: trusting the Father completely. The Church prays these words at Night Prayer (Compline) every evening.',
          },
          {
            type: 'trueFalse',
            cccRef: 'John 19:25',
            prompt:
              'Mary, the mother of Jesus, stood at the foot of the Cross.',
            correct: true,
            explanation:
              '"Standing by the cross of Jesus were his mother..." (John 19:25). Mary, who said "yes" at the Annunciation, said "yes" again at Calvary. She did not flee. The Mater Dolorosa — Our Lady of Sorrows — shares in her Son\'s redemptive suffering.',
          },
        ],
      },
      {
        id: 'p3',
        title: 'For Our Sake',
        subtitle: 'Why He Died',
        cccRef: 'CCC 599–623',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 604–605',
            prompt: 'For whom did Jesus die?',
            options: [
              'Only for the Jewish people',
              'Only for those who believed in Him',
              'For all humanity, without exception',
              'Only for a chosen few',
            ],
            correct: 2,
            explanation:
              'CCC 605: "There is not, never has been, and never will be a single human being for whom Christ did not suffer." His sacrifice is offered for every person of every time and place — though each must freely accept it.',
          },
          {
            type: 'trueFalse',
            cccRef: 'John 10:18 · CCC 609',
            prompt:
              'Jesus\'s death was forced on Him unwillingly — He was a tragic victim.',
            correct: false,
            explanation:
              '"No one takes my life from me, but I lay it down of my own accord" (John 10:18). Jesus is no victim. He is a willing, conscious self-offering. The Cross is freely chosen love, not imposed tragedy.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 601–605',
            prompt: 'What does the word "redemption" mean?',
            options: [
              'To punish a wrongdoer',
              'To buy back, to pay a ransom',
              'To forget the past',
              'To start over from scratch',
            ],
            correct: 1,
            explanation:
              '"Redemption" comes from "redimere" — to buy back. Sin enslaved humanity; Christ paid the price to ransom us. The ransom is paid not to Satan (he has no rights over us) but to the demands of divine justice — paid by God, to God, for us.',
          },
          {
            type: 'fillBlank',
            cccRef: 'Isaiah 53:5',
            prompt:
              'Complete this prophecy from Isaiah, fulfilled in Christ:',
            sentenceParts: ['By his wounds we are ', '___', '.'],
            options: ['healed', 'saved', 'freed', 'forgiven', 'redeemed'],
            correct: 'healed',
            explanation:
              'Isaiah 53:5, written 700 years before Christ, describes the Suffering Servant: "He was wounded for our transgressions... by his wounds we are healed." The Church sees Christ on every page of the Old Testament — most clearly here.',
          },
          {
            type: 'match',
            cccRef: 'CCC 599–618',
            prompt: 'Match each title that describes Christ in His sacrifice:',
            pairs: [
              ['Lamb of God', 'The Passover sacrifice for our salvation'],
              ['High Priest', 'The one who offers the sacrifice'],
              ['New Adam', 'Repairs what the first Adam broke'],
              ['Suffering Servant', "Fulfills Isaiah's prophecy"],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              "Each title shows a different facet of Christ's saving work. He is both the priest who offers the sacrifice AND the victim being offered — a unique perfection no Old Testament priest could achieve.",
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 613–614 · Hebrews 10:10',
            prompt:
              "How does Christ's sacrifice differ from Old Testament sacrifices?",
            options: [
              'It was offered in a different temple',
              'It was offered once and for all, perfect and complete',
              'It was offered by a Levite',
              'It involved animals',
            ],
            correct: 1,
            explanation:
              'Hebrews 10:10: "We have been sanctified through the offering of the body of Jesus Christ once for all." Old Testament sacrifices had to be repeated endlessly because they were imperfect. Christ\'s one sacrifice is perfect — the Mass re-presents it, doesn\'t repeat it.',
          },
          {
            type: 'tapOrder',
            cccRef: 'John 15:13',
            prompt: 'Arrange this teaching of Jesus on love:',
            options: ['Greater', 'love', 'has', 'no', 'one'],
            correct: [0, 1, 2, 3, 4],
            explanation:
              '"Greater love has no one than this, that one lay down his life for his friends" (John 15:13). The Cross IS this definition of love made visible. To follow Christ is to learn this kind of self-giving love.',
          },
          {
            type: 'trueFalse',
            cccRef: 'Colossians 1:24 · CCC 1505',
            prompt:
              "Christians can unite their own suffering to Christ's sacrifice.",
            correct: true,
            explanation:
              'St. Paul: "In my flesh I complete what is lacking in Christ\'s afflictions for the sake of his body, the church" (Colossians 1:24). Christ\'s sacrifice is complete — but He invites us to join our suffering to His, making our own crosses redemptive too.',
          },
        ],
      },
      {
        id: 'p4',
        title: 'Descended',
        subtitle: 'Holy Saturday',
        cccRef: 'CCC 624–637',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 632–633',
            prompt:
              'What does "He descended into hell" mean in the Apostles\' Creed?',
            options: [
              'He suffered in the hell of the damned',
              'He went to the realm of the dead (Sheol) to free the just souls awaiting Him',
              'It is symbolic, not literal',
              'He went to purgatory',
            ],
            correct: 1,
            explanation:
              'The Creed uses "hell" (Hades, Sheol) in its older meaning — the abode of all who had died. Christ went there to bring salvation to the righteous of the Old Testament who had been waiting for their Redeemer. This is NOT the hell of the damned.',
          },
          {
            type: 'trueFalse',
            cccRef: 'Matthew 27:57–60',
            prompt: 'Jesus was buried in a borrowed tomb.',
            correct: true,
            explanation:
              'Joseph of Arimathea, a wealthy disciple, donated his own new tomb. The detail fulfills Isaiah 53:9 — "With the rich was his tomb." Even in burial, every detail of Christ\'s life fulfills prophecy.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 633',
            prompt: 'The "hell" Jesus descended to was...',
            options: [
              'The eternal fire of the damned',
              'The realm of the dead — "Sheol" or "Hades"',
              'Purgatory as we now know it',
              'A symbolic place, not real',
            ],
            correct: 1,
            explanation:
              'Before Christ opened heaven, all who died — even the righteous — went to Sheol/Hades, awaiting redemption. The Catechism calls it the "limbo of the fathers." Christ\'s descent to free them is sometimes called the "Harrowing of Hell."',
          },
          {
            type: 'fillBlank',
            cccRef: '1 Peter 3:19',
            prompt: "Complete St. Peter's description of Christ's descent:",
            sentenceParts: [
              'He went and preached to the spirits in ',
              '___',
              '.',
            ],
            options: ['prison', 'darkness', 'torment', 'waiting', 'sorrow'],
            correct: 'prison',
            explanation:
              '1 Peter 3:19 — Christ "went and preached to the spirits in prison." The righteous dead were not in torment, but they were not yet in the joy of heaven. Christ\'s descent brought them what they had longed for.',
          },
          {
            type: 'match',
            cccRef: 'CCC 624–637',
            prompt: 'Match each aspect of Holy Saturday:',
            pairs: [
              ['The body of Christ', 'Rested in the tomb'],
              ['The soul of Christ', 'Descended to the dead'],
              ['His divinity', 'Remained united to both'],
              ['The disciples', 'Mourned, scattered, hidden'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              'Holy Saturday is the day of silence — Christ in the tomb. The Catechism is precise: His body lay in death, His soul went to the dead, but His divinity never left either. The whole Person of Christ remained always God.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 633–635',
            prompt: 'Whom did Christ free during His descent?',
            options: [
              'All who had ever died',
              'Only those who had asked for Him',
              "The righteous of the Old Testament who had died in God's friendship",
              'No one — He simply visited',
            ],
            correct: 2,
            explanation:
              'Adam, Eve, Abraham, Moses, David, the prophets, John the Baptist — the just who had died in friendship with God now received the salvation they had longed for. The Eastern icon of the Resurrection shows Christ lifting Adam and Eve from their tombs.',
          },
          {
            type: 'tapOrder',
            cccRef: "Apostles' Creed",
            prompt: "Arrange this article of the Apostles' Creed:",
            options: ['He', 'descended', 'into', 'hell'],
            correct: [0, 1, 2, 3],
            explanation:
              "This article of the Apostles' Creed reminds us that Christ's saving work reaches the dead — even those who lived before Him. No one is beyond the reach of His salvation, neither in space nor in time.",
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 626–627',
            prompt:
              'Jesus truly died — His soul actually separated from His body.',
            correct: true,
            explanation:
              'Jesus did not merely appear to die. The Creed insists: He died, was buried, descended to the dead. Real death. This matters because His Resurrection is then a real conquest of death — not a clever recovery from a near-death state.',
          },
        ],
      },
      {
        id: 'p5',
        title: 'He Is Risen',
        subtitle: 'The Resurrection',
        cccRef: 'CCC 638–658',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 638',
            prompt:
              'Why is the Resurrection the central event of the Christian faith?',
            options: [
              'It is a beautiful story',
              'Without it, the Cross has no meaning and our faith is in vain',
              'It happened on a Sunday',
              'Mary Magdalene was the first witness',
            ],
            correct: 1,
            explanation:
              'CCC 638 quotes St. Paul: "If Christ has not been raised, then our preaching is in vain, and your faith is in vain" (1 Cor 15:14). The Resurrection is not an optional belief — it is the very foundation. Without it, Christianity collapses.',
          },
          {
            type: 'trueFalse',
            cccRef: '1 Corinthians 15:17',
            prompt:
              'Without the Resurrection, the Christian faith would be empty.',
            correct: true,
            explanation:
              'St. Paul: "If Christ has not been raised, your faith is futile and you are still in your sins" (1 Cor 15:17). The early Christians did not preach merely "Jesus was a good teacher" — they preached "He is risen." Without that, there is no Gospel.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'Mark 16:1–8',
            prompt: 'Who first discovered the empty tomb?',
            options: [
              'Peter and John',
              'Pontius Pilate',
              'The women who came to anoint the body',
              'The Roman guards',
            ],
            correct: 2,
            explanation:
              "Mary Magdalene, Mary the mother of James, and Salome came at dawn on the first day of the week. In a society where women's testimony was not legally accepted, the Gospels still record them as the first witnesses. This is itself an argument for the truth of the account.",
          },
          {
            type: 'fillBlank',
            cccRef: '1 Corinthians 15:14',
            prompt: "Complete St. Paul's statement on the Resurrection:",
            sentenceParts: [
              'If Christ has not been raised, our faith is in ',
              '___',
              '.',
            ],
            options: ['vain', 'doubt', 'shadow', 'danger', 'ruin'],
            correct: 'vain',
            explanation:
              "1 Corinthians 15:14. The whole 15th chapter is St. Paul's great defense of the Resurrection. He even names dozens of witnesses, daring his readers to go and ask them. The early Church was bet-the-house certain Christ had risen.",
          },
          {
            type: 'match',
            cccRef: 'CCC 641–644',
            prompt: 'Match each Resurrection appearance to where it happened:',
            pairs: [
              ['To Mary Magdalene', 'Outside the empty tomb'],
              ['To two disciples', 'On the road to Emmaus'],
              ['To the Apostles (Thomas absent)', 'In a locked upper room'],
              ['To Peter and others', 'By the Sea of Tiberias'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              'Christ appeared many times over forty days, to many different witnesses, in different places, doing different things — eating, walking, teaching, allowing them to touch Him. This was no single hallucination.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 645–646',
            prompt: "What was the nature of Christ's resurrected body?",
            options: [
              'A ghost or spirit only',
              'A different body, not really His',
              'His true body, but glorified — beyond the limits of normal physics',
              'An angel that looked like Him',
            ],
            correct: 2,
            explanation:
              'His real body — He ate, was touched, showed His wounds. But also glorified — passing through locked doors, appearing and disappearing. The risen body is not a resuscitated corpse; it is human nature transformed by glory. Our own bodies will be like this someday.',
          },
          {
            type: 'tapOrder',
            cccRef: "Apostles' Creed",
            prompt: "Arrange this article from the Apostles' Creed:",
            options: ['The', 'third', 'day', 'He', 'rose'],
            correct: [0, 1, 2, 3, 4],
            explanation:
              '"The third day He rose again from the dead." Sunday — the first day of the week, now the Lord\'s Day. Every Sunday is a little Easter; every Mass is a celebration of the Resurrection.',
          },
          {
            type: 'trueFalse',
            cccRef: 'CCC 643–644 · Luke 24:11',
            prompt:
              'The disciples expected the Resurrection — they were ready for it.',
            correct: false,
            explanation:
              "They didn't expect it at all. They thought it was an idle tale (Luke 24:11). Thomas refused to believe without proof. Even after seeing Him, some doubted (Matthew 28:17). The fact that the very first preachers had to be CONVINCED is itself a strong argument that they didn't invent it.",
          },
        ],
      },
      {
        id: 'p6',
        title: 'He Will Come',
        subtitle: 'Ascension and Return',
        cccRef: 'CCC 659–682',
        questions: [
          {
            type: 'multipleChoice',
            cccRef: 'CCC 659 · Acts 1:3',
            prompt: 'How many days after Easter did Jesus ascend to heaven?',
            options: ['7 days', '30 days', '40 days', '50 days'],
            correct: 2,
            explanation:
              'Forty days (Acts 1:3). The number is symbolic — Israel wandered 40 years, Christ fasted 40 days, Moses was on Sinai 40 days. The Easter season runs 50 days total, ending with Pentecost (the descent of the Holy Spirit).',
          },
          {
            type: 'trueFalse',
            cccRef: 'John 14:18 · Matthew 28:20',
            prompt: 'When Jesus ascended, He abandoned His disciples.',
            correct: false,
            explanation:
              '"I will not leave you orphans" (John 14:18). "I am with you always, to the end of the age" (Matthew 28:20). The Ascension is not a goodbye but a transformation of His presence — He is now with us through the Spirit, in the sacraments, in the Church.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 663–664',
            prompt:
              'What does "seated at the right hand of the Father" mean?',
            options: [
              'Jesus is literally sitting on a throne',
              "He shares fully in the Father's glory, authority, and power",
              'He is less important than the Father',
              'He is resting after His work',
            ],
            correct: 1,
            explanation:
              'A Scriptural image of supreme honor and authority. Christ now reigns as Lord of the universe. He is not a mere prophet remembered — He is the King of kings, sharing the Father\'s throne, until He returns.',
          },
          {
            type: 'fillBlank',
            cccRef: 'John 14:3',
            prompt: "Complete Christ's promise to His disciples:",
            sentenceParts: ['I will come again and take you to ', '___', '.'],
            options: ['myself', 'the Father', 'paradise', 'glory', 'rest'],
            correct: 'myself',
            explanation:
              '"I will come again and will take you to myself, that where I am you may be also" (John 14:3). The Christian life is oriented toward this — being WITH Christ forever. Heaven is not primarily a place but a Person.',
          },
          {
            type: 'match',
            cccRef: 'CCC 668–682',
            prompt: "Match each aspect of Christ's Second Coming:",
            pairs: [
              ['Parousia', 'The Greek term for His return'],
              ['Last Judgment', 'Every soul gives account'],
              ['New heavens and new earth', 'Creation itself is renewed'],
              ['The date', 'Known only to the Father'],
            ],
            correct: [0, 1, 2, 3],
            explanation:
              'The Catechism treats the Second Coming with reverence and clarity. It will happen. It will judge. It will renew. But the timing is not for us to know — only to be ready.',
          },
          {
            type: 'multipleChoice',
            cccRef: 'CCC 673',
            prompt: 'What is the "Parousia"?',
            options: [
              'Another name for Pentecost',
              'The Second Coming of Christ in glory',
              'The Ascension',
              'The resurrection of the body',
            ],
            correct: 1,
            explanation:
              'From the Greek for "presence" or "arrival." In the New Testament it refers specifically to Christ\'s glorious return at the end of time, when He will judge the living and the dead and inaugurate the new creation.',
          },
          {
            type: 'tapOrder',
            cccRef: "Apostles' Creed",
            prompt: 'Arrange this article of the Creed:',
            options: ['to', 'judge', 'the', 'living', 'and', 'the', 'dead'],
            correct: [0, 1, 2, 3, 4, 5, 6],
            explanation:
              '"He will come again in glory to judge the living and the dead." Christ\'s first coming was in mercy and humility. His second will be in glory and justice. Both are good news for those who love Him.',
          },
          {
            type: 'trueFalse',
            cccRef: 'Matthew 24:36',
            prompt:
              "We can calculate the exact date of Christ's return from the Bible.",
            correct: false,
            explanation:
              '"About that day or hour no one knows, not even the angels in heaven, nor the Son, but only the Father" (Matthew 24:36). Many have tried to predict the date. All have been wrong. Our job is not to calculate but to be ready — every day.',
          },
        ],
      },
    ],
  },
];
