/**
 * The Novena library.
 *
 * A novena is nine consecutive days of prayer for a particular grace, in
 * memory of the nine days the Apostles and Our Lady spent in prayer between
 * the Ascension and Pentecost (Acts 1:14). Each entry carries a short
 * introduction, the prayer said each day, and nine daily meditations so the
 * tracker can guide the whole nine-day course.
 *
 * The fixed prayers here follow long-published traditional texts; the daily
 * meditations are brief devotional reflections. Where a novena is prayed with
 * the Rosary, the Chaplet, or the common prayers, those already live in the
 * Prayer Library (Pater Noster, Ave Maria, Gloria Patri, …).
 */

export interface NovenaDay {
  /** Short focus of the day, e.g. "The gift of Wisdom". */
  theme: string;
  /** A brief meditation to carry into the day's prayer. */
  meditation: string;
  /** Optional day-specific prayer; when absent, the novena's shared prayer is used. */
  prayer?: string;
}

export interface Novena {
  id: string;
  title: string;
  latinTitle?: string;
  /** Whose intercession is sought, or the mystery honoured. */
  patron: string;
  /** When it is traditionally prayed. */
  occasion: string;
  /** One line: what it is prayed for. */
  intention: string;
  /** A short introduction shown at the top of the novena. */
  about: string;
  /** The prayer said each day (in addition to any day-specific prayer). */
  prayer: string;
  /** Optional short closing said each day. */
  closing?: string;
  /** Exactly nine days. */
  days: NovenaDay[];
}

export const NOVENAS: Novena[] = [
  {
    id: 'divineMercy',
    title: 'Divine Mercy',
    patron: 'The Divine Mercy of Jesus',
    occasion: 'Good Friday to Divine Mercy Sunday (or any nine days)',
    intention: 'To entrust the whole world, soul by soul, to the mercy of God.',
    about:
      'Our Lord asked St. Faustina to make a novena before the Feast of Mercy, bringing a different group of souls to His Heart each day and immersing them in the ocean of His mercy. The Chaplet of Divine Mercy is prayed each day for that day’s intention.',
    prayer:
      'Most Merciful Jesus, whose very nature is compassion, receive the souls I bring before You today into the abode of Your Most Compassionate Heart. Let the rays of Your grace enfold them, that they may glorify the power of Your mercy for ever. I trust in You.',
    closing: 'Jesus, I trust in You.',
    days: [
      { theme: 'All mankind, especially sinners', meditation: 'Today bring to the Heart of Jesus all humanity, and above all sinners, that the ocean of His mercy may drown every misery.' },
      { theme: 'The souls of priests and religious', meditation: 'Bring to Jesus those consecrated to Him — priests and religious — through whose hands His mercy flows to the world.' },
      { theme: 'All devout and faithful souls', meditation: 'Bring the faithful who walk the ordinary road of duty, that His mercy may sustain them and keep them from growing weary.' },
      { theme: 'Those who do not yet know Jesus', meditation: 'Bring those who do not believe in God and those who do not yet know Christ, that His mercy may draw them into the light.' },
      { theme: 'Those separated from the Church', meditation: 'Bring the souls of separated brethren, that His mercy may heal every division and gather all into one fold.' },
      { theme: 'The meek, the humble, and children', meditation: 'Bring the meek and humble souls and the souls of little children, in whom the Heart of Jesus delights and finds His rest.' },
      { theme: 'Those who venerate His mercy', meditation: 'Bring those who especially glorify and venerate His mercy, that they may be strengthened on the difficult road of life.' },
      { theme: 'The souls in Purgatory', meditation: 'Bring the souls detained in Purgatory, that the streams of the Precious Blood may relieve and refresh them.' },
      { theme: 'The lukewarm souls', meditation: 'Bring the lukewarm souls, that in the fire of His pure love they may be warmed again and set aflame.' },
    ],
  },
  {
    id: 'holySpirit',
    title: 'The Holy Spirit',
    latinTitle: 'Veni Sancte Spiritus',
    patron: 'God the Holy Spirit',
    occasion: 'The nine days between Ascension and Pentecost',
    intention: 'To be filled anew with the Holy Spirit and His seven gifts.',
    about:
      'This is the oldest of all novenas — the very first, kept by Our Lady and the Apostles in the Upper Room as they awaited the promised Spirit. Each day asks for the Spirit Himself and, in turn, for His seven gifts and their fruits.',
    prayer:
      'Come, Holy Spirit, fill the hearts of Your faithful and kindle in them the fire of Your love. Send forth Your Spirit and they shall be created, and You shall renew the face of the earth. O God, who by the light of the Holy Spirit did instruct the hearts of the faithful, grant that by the same Spirit we may be truly wise and ever rejoice in His consolation. Through Christ our Lord. Amen.',
    closing: 'Come, Holy Spirit — renew the face of the earth.',
    days: [
      { theme: 'The Holy Spirit Himself', meditation: 'The Spirit is the love of the Father and the Son, given to dwell in us. Ask today only for Him, and every gift comes with Him.' },
      { theme: 'The gift of Fear of the Lord', meditation: 'A holy reverence that dreads sin more than any punishment, because it fears to wound the God it loves.' },
      { theme: 'The gift of Piety', meditation: 'The tender, filial love that turns to God as to a Father and finds sweetness in His service.' },
      { theme: 'The gift of Knowledge', meditation: 'To see created things rightly — as gifts pointing to the Giver — and never to rest in them alone.' },
      { theme: 'The gift of Fortitude', meditation: 'The courage to do what is right and to endure what must be endured, trusting the strength that God supplies.' },
      { theme: 'The gift of Counsel', meditation: 'A supernatural prudence for the moment of decision, guiding the soul in what to do and what to avoid.' },
      { theme: 'The gift of Understanding', meditation: 'A deeper penetration into the truths of faith, that they may become light for the mind and warmth for the heart.' },
      { theme: 'The gift of Wisdom', meditation: 'To savour the things of God and judge all things in His light — the highest of the gifts, and the sweetest.' },
      { theme: 'The fruits of the Holy Spirit', meditation: 'Charity, joy, peace, patience, kindness, goodness, gentleness — ask that these ripen in you as the sign of His indwelling.' },
    ],
  },
  {
    id: 'sacredHeart',
    title: 'The Sacred Heart of Jesus',
    latinTitle: 'Cor Iesu Sacratissimum',
    patron: 'The Most Sacred Heart of Jesus',
    occasion: 'Before the Feast of the Sacred Heart, or the Nine First Fridays',
    intention: 'To place every need with confidence in the Heart that loves us.',
    about:
      'To St. Margaret Mary the Lord revealed His Heart, burning with love for mankind and asking only to be loved in return. This novena rests each day upon a different consolation of that Heart, and ends by placing all our trust in Him.',
    prayer:
      'O most holy Heart of Jesus, fountain of every blessing, I adore You, I love You, and with lively sorrow for my sins I offer You this poor heart of mine. Make me humble, patient, and wholly obedient to Your will. Grant, good Jesus, that I may live in You and for You. Protect me in the midst of danger; comfort me in my afflictions; and receive me at last into Your mercy. Sacred Heart of Jesus, I place all my trust in You.',
    closing: 'Sacred Heart of Jesus, I place all my trust in You.',
    days: [
      { theme: 'The Heart that loved us first', meditation: 'Before we knew Him, He loved us. Rest today in a love that has no beginning and asks only to be received.' },
      { theme: 'A refuge for sinners', meditation: 'His Heart was opened by the lance so that we might have a place to hide. No sinner who comes is turned away.' },
      { theme: 'Patient and rich in mercy', meditation: 'He bears with our slowness and begins with us again each day. Bring Him your failures without fear.' },
      { theme: 'The source of all consolation', meditation: 'Whatever the trial, His Heart is a spring that does not run dry. Draw from it the peace the world cannot give.' },
      { theme: 'Meek and humble of heart', meditation: '“Learn of Me,” He says, “for I am meek and humble.” Ask for a heart shaped to the pattern of His own.' },
      { theme: 'Burning with love for us', meditation: 'His love is a fire that longs to be shared. Ask that a spark of it be kindled in your own cold heart.' },
      { theme: 'Obedient unto death', meditation: 'His Heart was faithful to the Father to the very end. Ask for the grace to say, and mean, “Thy will be done.”' },
      { theme: 'Our peace and reconciliation', meditation: 'In His Heart heaven and earth are made one again. Bring to Him today whatever is broken or divided in your life.' },
      { theme: 'Our hope in the hour of death', meditation: 'He has promised to be the refuge of those devoted to His Heart. Entrust to Him now the hour you cannot foresee.' },
    ],
  },
  {
    id: 'stJude',
    title: 'Saint Jude Thaddeus',
    patron: 'St. Jude, Apostle',
    occasion: 'In any need, especially those that seem hopeless',
    intention: 'To seek help in desperate and seemingly hopeless causes.',
    about:
      'St. Jude, an Apostle and kinsman of the Lord, is honoured as the patron of hopeless and desperate cases — for such is often the confidence of those who turn to him. This novena entrusts to his intercession the burdens that feel beyond all human remedy.',
    prayer:
      'Most holy Apostle, St. Jude, faithful servant and friend of Jesus, the Church honours and invokes you universally as the patron of hopeless and difficult cases. Pray for me, so helpless and alone. Make use, I implore you, of that particular privilege given to you to bring visible and speedy help where help is almost despaired of. Come to my assistance in this great need, that I may receive the consolation and succour of heaven in all my necessities, and that I may bless God with you and all the elect for ever. I promise, blessed St. Jude, to be ever mindful of this great favour, and never to cease honouring you as my special and powerful patron. Amen.',
    closing: 'St. Jude, helper of the hopeless, pray for us.',
    days: [
      { theme: 'Turning to a friend of God', meditation: 'St. Jude was a friend of Jesus. Begin by placing your trouble in the hands of one who stands close to the Lord.' },
      { theme: 'Naming the need', meditation: 'Set before God, plainly and without disguise, the very thing that weighs on you. He is not frightened by our desperation.' },
      { theme: 'Hope against hope', meditation: 'Like Abraham, believe in hope even where there seems no ground for it. Nothing is impossible with God.' },
      { theme: 'Patience in waiting', meditation: 'Heaven’s help often comes quietly and not on our timetable. Ask for the patience to keep praying.' },
      { theme: 'Trust in Providence', meditation: 'The Father knows what you need before you ask. Rest today in His care rather than in your own foresight.' },
      { theme: 'Perseverance', meditation: 'The persistent widow was heard because she did not give up. Do not weary of knocking.' },
      { theme: 'Surrender of the outcome', meditation: 'Hand over not only the need but the result, trusting that He will grant this or something better.' },
      { theme: 'Gratitude in advance', meditation: 'Begin to thank God even now, sure that He has already heard and is at work in ways unseen.' },
      { theme: 'Peace of soul', meditation: 'Whatever the answer, ask above all for the peace that guards the heart in Christ Jesus.' },
    ],
  },
  {
    id: 'immaculate',
    title: 'The Immaculate Conception',
    latinTitle: 'Immaculata Conceptio',
    patron: 'Our Lady, conceived without sin',
    occasion: 'November 29 – December 7, before the feast on December 8',
    intention: 'To ask Our Lady’s help toward purity of heart and holiness of life.',
    about:
      'Mary was preserved from the first moment of her existence free from every stain of sin, that she might be a worthy dwelling for the Son of God. This novena honours that singular grace and asks her to obtain for us a share in her purity and her faith.',
    prayer:
      'O Mary, conceived without sin, pray for us who have recourse to thee. Most holy Virgin Immaculate, my Mother, to thee I come with confidence: thou art the refuge of sinners, the hope of the hopeless. Obtain for me from thy Son a lively faith, a firm hope, an ardent charity, and above all that purity of heart which alone can see God. Keep me this day and always under thy mantle, that I may be numbered among thy children now and at the hour of my death. Amen.',
    closing: 'O Mary, conceived without sin, pray for us who have recourse to thee.',
    days: [
      { theme: 'Full of grace', meditation: 'The angel found her already full of grace. Ask that grace may take deeper root in your own soul today.' },
      { theme: 'Free from every stain', meditation: 'Preserved from all sin, she is the pure mirror of God’s beauty. Ask her help to hate whatever dims that image in you.' },
      { theme: 'The humble handmaid', meditation: '“Behold the handmaid of the Lord.” Her greatness grew from her lowliness. Ask for a like humility.' },
      { theme: 'Her fiat', meditation: 'She gave God her whole consent. Ask for the grace to answer His will today with your own quiet “Let it be.”' },
      { theme: 'The new Eve', meditation: 'Where the first Eve grasped, Mary surrendered. Ask her to undo in you the old habits of self-will.' },
      { theme: 'Mother of the Redeemer', meditation: 'She carried Christ to the world. Ask that you too may bear Him to those around you.' },
      { theme: 'Faithful at the Cross', meditation: 'She stood when others fled. Ask for the constancy to remain near her Son in the hour of trial.' },
      { theme: 'Refuge of sinners', meditation: 'No one who fled to her protection was left unaided. Place under her mantle the sin you most wish to be free of.' },
      { theme: 'Our life, our sweetness, and our hope', meditation: 'She is the surest road to Jesus. Entrust to her today your whole way home to God.' },
    ],
  },
  {
    id: 'stJoseph',
    title: 'Saint Joseph',
    latinTitle: 'Sanctus Ioseph',
    patron: 'St. Joseph, Guardian of the Redeemer',
    occasion: 'March 10 – 18, before his feast, or in any need',
    intention: 'To seek the protection of the guardian of Jesus and the Church.',
    about:
      'The just man to whom God entrusted His own Son and His Mother is the patron of the universal Church, of workers, of families, and of a holy death. This novena places our needs under the quiet, powerful protection of St. Joseph.',
    prayer:
      'O glorious St. Joseph, you who have power to render possible even things which are considered impossible, come to my aid in my present trouble and necessity. Take this intention under your special protection, that it may end happily. O dear St. Joseph, all my confidence is in you. Let it not be said that I invoked you in vain; and since you can do everything with Jesus and Mary, show me that your goodness is as great as your power. Amen.',
    closing: 'St. Joseph, foster-father of Jesus, pray for us.',
    days: [
      { theme: 'The just man', meditation: 'Scripture calls Joseph simply “a just man.” Ask for that quiet, dependable holiness that seeks no notice.' },
      { theme: 'The obedient servant', meditation: 'He rose in the night and did as the angel commanded. Ask for a heart quick to obey the will of God.' },
      { theme: 'Guardian of Jesus', meditation: 'God trusted His Son to Joseph’s care. Entrust to him today those whom you are called to protect.' },
      { theme: 'Spouse of Mary', meditation: 'He loved and served Our Lady with a chaste and faithful heart. Ask his help in your own duties of love.' },
      { theme: 'The worker of Nazareth', meditation: 'He sanctified ordinary labour with his hands. Offer him your work today, that it may be made holy.' },
      { theme: 'Man of silence', meditation: 'Not one word of Joseph is recorded — only his deeds. Ask for the grace to trust and act without needing to be heard.' },
      { theme: 'Protector in danger', meditation: 'He carried the Child to safety in Egypt. Place under his guard whatever now threatens you or those you love.' },
      { theme: 'Terror of demons', meditation: 'The Church invokes him as a strong defender against evil. Ask his protection over your soul and your home.' },
      { theme: 'Patron of a happy death', meditation: 'He died in the arms of Jesus and Mary. Ask him now to be near you at the hour you cannot foresee.' },
    ],
  },
];

/** The order shown on the Novena list. */
export const NOVENA_LIBRARY: string[] = NOVENAS.map((n) => n.id);

export function novenaById(id: string): Novena | undefined {
  return NOVENAS.find((n) => n.id === id);
}
