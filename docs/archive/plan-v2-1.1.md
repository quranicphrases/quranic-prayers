# Plan: Update Quranic Prayers Data with Tafsir-Informed Metadata

## TL;DR

Update `src/data.json` with ~75 prayers total: update 25 existing prayers (tags, description, title), remove 3 existing prayers, split 1 prayer into 2, and add ~50 new prayers. Use quran.com's tafsir API to research context for each prayer, then run the existing `fetch-prayer-data.ts` script to enrich new entries with Arabic text and translations.

---

## Tafsir API Details

**Discovered endpoints** (quran.com Content API v4):

1. **List available tafsirs**:
   `GET https://api.quran.com/api/v4/resources/tafsirs`

2. **Get tafsir for a specific verse**:
   `GET https://api.quran.com/api/v4/tafsirs/{tafsir_id}/by_ayah/{verse_key}`
   - `tafsir_id`: numeric resource ID (e.g., 169 for Ibn Kathir English — verify via endpoint #1)
   - `verse_key`: format `surah:ayah` (e.g., `1:1`, `2:201`)
   - For multi-verse prayers, fetch tafsir for the **first verse only** (group tafsir covers the passage)

3. **Get tafsir in bulk** (alternative):
   `GET https://api.quran.com/api/v4/quran/tafsirs/{tafsir_id}?chapter_number={N}`
   - Fetches tafsir for an entire chapter; filter by `verse_key` param for a single verse

**Note**: The existing fetch script uses `api.quran.com/api/v4` without auth tokens. The newer `apis.quran.foundation/content/api/v4` requires OAuth. Stick with the existing base URL. If it fails, the script may need auth headers (x-auth-token, x-client-id).

**Recommended tafsir**: Ibn Kathir (English) — resource ID to be confirmed by calling endpoint #1. Fallback: Maariful Quran.

---

## Code Changes Required

### 1. `src/data.json` — Main data file

- **Remove** 3 prayers: p12 (3:26-27), p16 (5:114), p23 (7:189)
- **Split** p9 (2:285-286) into two separate prayers
- **Update** p1 verse range from `1:2-7` → `1:1-7` and **delete its `content` array** so the fetch script re-fetches with verse 1 included
- **Update** metadata (title, description, tags) for all 24 existing prayers from user's table
- **Add** ~50 new prayer entries (metadata only — no `content`)
- For split p9: delete its `content` so both halves re-fetch

### 2. `scripts/fetch-prayer-data.ts` — No changes needed

- The existing `parseVerseRef` handles `surah:start-end` format
- All user's verse references (comma-separated lists) map to consecutive ranges: e.g., `26-83,84,85,86,87,88,89` → `26:83-89`
- Full-surah references (113, 114) → `113:1-5`, `114:1-6`

### 3. New script: `scripts/fetch-tafsir.ts` (one-time research helper)

- Small script to batch-fetch tafsir text for each prayer's first verse
- Output to a text file for manual review of descriptions
- Uses same rate-limiting pattern as existing fetch script
- Delete after review (one-time research artifact)

---

## Tag Consolidation

| User's Tag                             | Recommendation                                   | Reason                                 |
| -------------------------------------- | ------------------------------------------------ | -------------------------------------- |
| "Husband", "Wife" alongside "Spouse"   | Drop "Husband"/"Wife", keep "Spouse"             | Redundant — all on same prayer (25:74) |
| "Mother", "Father" alongside "Parents" | Drop "Mother"/"Father" when "Parents" is present | Covered by "Parents"                   |
| "Ship Landing"                         | Drop — use "Help" + "Nuh AS"                     | Too niche (1 prayer)                   |
| "Become Grateful"                      | → "Gratitude"                                    | Cleaner phrasing                       |
| "Accepting Mistake"                    | → "Repentance"                                   | More standard term                     |
| "Become Muslims"                       | Drop — captured by description                   | Too niche                              |
| "Great kingdom"                        | → "Kingdom"                                      | Shorter                                |
| "Desperation"                          | → "Hardship"                                     | More general                           |
| "Calamity"                             | → "Protection"                                   | Already covered                        |
| "Migration"                            | Drop                                             | Only 1 prayer, niche                   |
| "Anonymous", "Special"                 | Replace with meaningful tags                     | Legacy placeholder tags                |
| "Refuge from Shaytan"                  | → "Refuge"                                       | Consolidate                            |
| "Prayer for others"                    | → "Intercession"                                 | Standard term                          |
| "Wife Of Phiron"                       | → "Wife of Pharaoh"                              | Standard spelling                      |
| "Die as Muslim" / "Die As Muslims"     | Standardize to "Die As Muslims"                  | Consistency                            |

**Final tag count**: ~35 distinct tags (16 person/prophet tags + ~19 theme tags). This is reasonable for ~75 prayers.

---

## Complete Refined Prayer List

### Prayers to REMOVE

| Current ID | Verses  | Title                            | Reason             |
| ---------- | ------- | -------------------------------- | ------------------ |
| p12        | 3:26-27 | Praise of Allah's Sovereignty    | Not in user's list |
| p16        | 5:114   | Prayer of Isa AS for Provision   | Not in user's list |
| p23        | 7:189   | Example of Prayer for Good Child | Not in user's list |

### Existing Prayers to UPDATE

> For each: update title, description, tags. Delete `content` array only where verse range changes.

| #   | ID    | Verses    | Title                                                     | Description                                                                                                                                                                                                                                                            | Tags                                                      | Notes                                                   |
| --- | ----- | --------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| 1   | p1    | **1:1-7** | Al-Fatiha — The Opening                                   | The opening chapter of the Quran: praising Allah as Lord of all worlds, the Most Merciful, Master of the Day of Judgment, and seeking guidance to the straight path.                                                                                                   | Guidance, Praising Allah                                  | **Delete `content`** — verse range changed from 1:2-7   |
| 2   | p2    | 3:38      | Zakariyya AS — Prayer for a Child                         | Inspired by the miraculous provision Allah gave to Maryam, Zakariyya (AS) called upon his Lord to grant him righteous offspring despite his old age.                                                                                                                   | Zecharia AS, Child                                        |                                                         |
| 3   | p3    | 25:74     | Prayer for Family — Coolness of Eyes                      | A prayer of the righteous servants of the Most Merciful, asking Allah to bless them with spouses and children who bring comfort to their eyes, and to make them examples for the God-conscious. Those who make this prayer are promised an elevated place in Paradise. | Spouse, Child                                             |                                                         |
| 4   | p4    | 2:67      | Musa AS — Refuge from Ignorance                           | When Musa (AS) conveyed Allah's command to sacrifice a cow, his people questioned whether he was joking. Musa (AS) sought Allah's refuge from being among the ignorant.                                                                                                | Musa AS, Refuge, Knowledge                                | Partial verse                                           |
| 5   | p5    | 2:127     | Ibrahim & Ismail AS — Accept Our Efforts                  | As Ibrahim (AS) and Ismail (AS) raised the foundations of the Ka'bah, they prayed for Allah to accept their service, acknowledging Him as the All-Hearing and All-Knowing.                                                                                             | Ibrahim AS, Ismail AS                                     |                                                         |
| 6   | p6    | 2:128     | Ibrahim & Ismail AS — Submission and Guidance             | Ibrahim (AS) and Ismail (AS) prayed to be made fully submissive to Allah, for a nation of submission from their descendants, to be shown the rites of worship, and to be forgiven.                                                                                     | Ibrahim AS, Ismail AS, Forgiveness, Descendants, Guidance |                                                         |
| 7   | p7    | 2:126     | Ibrahim AS — Provision for Makkah                         | Ibrahim (AS) prayed for Makkah to be a secure city and for its believing people to be provided with fruits and sustenance.                                                                                                                                             | City, Protection, Food, Ibrahim AS                        |                                                         |
| 8   | p8    | 2:250     | Believers Against Goliath — Patience and Victory          | The believing soldiers of Talut (Saul) prayed for patience, firm footing, and victory before battling the army of Goliath (Jalut), in which Dawud (AS) ultimately defeated Goliath.                                                                                    | Victory, Patience, Dawood AS                              |                                                         |
| 9   | p9    | **2:285** | Affirmation of Faith — Last Verses of Al-Baqarah (1)      | The believers affirm their faith in Allah, His angels, books, and messengers, making no distinction among them. They declare obedience and seek forgiveness, acknowledging the final return is to Allah.                                                               | Forgiveness                                               | **Split from 2:285-286. Delete `content` to re-fetch.** |
| —   | _new_ | **2:286** | Seeking Ease — Last Verses of Al-Baqarah (2)              | A comprehensive prayer asking Allah not to burden beyond capacity, for forgiveness of mistakes and forgetfulness, for relief from heavy burdens, for pardon and mercy, and for victory over disbelieving people.                                                       | Forgiveness, Victory, Mercy, Easier Life                  | **New entry from split. Assign next available ID.**     |
| 10  | p10   | 3:8-9     | Steadfastness After Guidance                              | A prayer asking Allah to not let hearts deviate after being guided, seeking His special mercy, and affirming faith in the Day of Judgment.                                                                                                                             | Guidance, Mercy                                           |                                                         |
| 11  | p11   | 3:16      | Forgiveness and Salvation from Fire                       | A prayer of those who call upon Allah acknowledging their faith, asking for forgiveness and protection from Hellfire. Allah describes those making this prayer among the patient, truthful, and devout.                                                                | Forgiveness, Protection from Hell                         |                                                         |
| 12  | p13   | 3:147     | Prayer of the Righteous — Forgiveness and Victory         | A prayer of former prophets and the devout believers who fought alongside them, asking Allah for forgiveness of sins, steadfastness, and victory against the disbelievers.                                                                                             | Victory, Forgiveness                                      |                                                         |
| 13  | p14   | 3:191-194 | Prayer of the People of Understanding                     | The prayer of those who reflect on creation: seeking forgiveness, salvation from the Fire, the reward promised through His messengers, and protection from disgrace on the Day of Resurrection.                                                                        | Forgiveness, Protection from Hell, Die As Muslims         |                                                         |
| 14  | p15   | 4:75      | Cry of the Oppressed — Deliver Us                         | The cry of oppressed men, women, and children asking Allah to rescue them from a city of wrongdoing people and to appoint for them a protector and helper. Allah asks why the believers do not fight for those making this prayer.                                     | Protection                                                |                                                         |
| 15  | p17   | 7:23      | Adam & Hawa AS — The First Prayer for Forgiveness         | After eating from the forbidden tree, Adam (AS) and Hawa recognized their transgression and turned to Allah — the first prayer for forgiveness in human history.                                                                                                       | Forgiveness                                               |                                                         |
| 16  | p18   | 7:47      | People of Paradise — Protection from Hellfire             | On the Day of Judgment, the people of Paradise look upon the inhabitants of Hell and pray to Allah not to be placed among wrongdoers.                                                                                                                                  | Protection from Hell                                      |                                                         |
| 17  | p19   | 7:126     | Magicians of Pharaoh — Die as Believers                   | After witnessing Musa's miracles, Pharaoh's magicians declared faith. When Pharaoh threatened them, they prayed for patience and to die as Muslims.                                                                                                                    | Patience, Die As Muslims                                  |                                                         |
| 18  | p20   | 7:149     | Bani Israel — Regret Over the Golden Calf                 | After realizing their grave error of worshipping the golden calf in Musa's absence, Bani Israel were filled with regret and prayed for mercy and forgiveness.                                                                                                          | Forgiveness                                               |                                                         |
| 19  | p21   | 7:151     | Musa AS — Forgiveness for Himself and Harun               | When Musa (AS) returned to find his people worshipping the calf, he prayed for forgiveness for himself and his brother Harun (AS), and asked Allah to admit them into His mercy.                                                                                       | Forgiveness, Mercy, Brother                               |                                                         |
| 20  | p22   | 7:155-156 | Musa AS — Mercy After the Earthquake                      | When an earthquake struck the seventy chosen elders, Musa (AS) prayed for forgiveness and mercy, asking Allah not to punish them for the deeds of the foolish among them.                                                                                              | Forgiveness                                               |                                                         |
| 21  | p24   | 10:85-86  | Prayer of Musa's People — Reliance on Allah               | When Musa (AS) urged his people to trust in Allah, the believers prayed for protection from the persecution of Pharaoh and his oppressive people.                                                                                                                      | Musa AS, Protection                                       |                                                         |
| 22  | p25   | 11:47     | Nuh AS — Seeking Forgiveness                              | After the flood, Nuh (AS) learned his son was not among the righteous. Allah reprimanded him, and Nuh (AS) prayed for forgiveness, vowing never to ask of which he has no knowledge.                                                                                   | Nuh AS, Forgiveness                                       |                                                         |
| 23  | p26   | 12:23     | Yusuf AS — Seeking Allah's Refuge                         | When the wife of the Aziz attempted to seduce Yusuf (AS), he sought refuge in Allah against transgression. A prayer of chastity and reliance on Allah.                                                                                                                 | Protection, Yusuf AS                                      | Partial verse                                           |
| 24  | p27   | 12:101    | Yusuf AS — Dying in Submission                            | After years of trial and triumph, Yusuf (AS) was reunited with his family and his childhood dream was fulfilled. He turned to Allah in gratitude, asking to die in submission and be joined with the righteous.                                                        | Die As Muslims, Yusuf AS                                  |                                                         |
| 25  | p28   | 14:35     | Ibrahim AS — Security of Makkah and Protection from Idols | Ibrahim (AS) prayed for Makkah to be a sanctuary of peace and for himself and his descendants to be protected from idol worship, recognizing how many had been led astray by them.                                                                                     | City, Protection, Ibrahim AS, Child                       |                                                         |

### New Prayers to ADD

> All entries below get metadata only. The fetch script will enrich with Arabic text, word-by-word, and translations.

| #   | Verses     | Title                                                    | Description                                                                                                                                                                                                                                                         | Tags                                                                  |
| --- | ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | 2:201      | The Comprehensive Prayer — Good in Both Worlds           | One of the most commonly recited prayers in Islam: asking Allah for good in this world, good in the Hereafter, and protection from the punishment of the Fire.                                                                                                      | Protection from Hell                                                  |
| 2   | 6:77       | Ibrahim AS — Guide Me or I Am Lost                       | As young Ibrahim (AS) searched for the truth, he looked at the moon and when it set, he prayed that without Allah's guidance he would be among the people gone astray. His journey of reasoning led him to reject celestial worship and turn to Allah alone.        | Guidance, Ibrahim AS                                                  |
| 3   | 7:89       | Shu'ayb AS — Judge Between Us in Truth                   | When his people rejected him and threatened exile, Shu'ayb (AS) put his trust in Allah and prayed for Allah to judge in truth between the believers and the disbelievers.                                                                                           | Shu'ayb AS, Help                                                      |
| 4   | 7:143      | Musa AS — Forgiveness After the Mountain                 | When Musa (AS) asked to see Allah, Allah manifested on the mountain, causing it to crumble. Musa (AS) fainted, and upon awakening, he repented and prayed for forgiveness, declaring himself the first of the believers.                                            | Musa AS, Forgiveness                                                  |
| 5   | 10:88      | Musa AS — Prayer Against Pharaoh                         | After Pharaoh and his chiefs persisted in arrogance and rejection, Musa (AS) prayed for their wealth to be destroyed and their hearts hardened, so they would not believe until they witnessed the painful punishment.                                              | Curse, Musa AS                                                        |
| 6   | 11:73      | Angels' Blessing Upon Ibrahim's Household                | The angels visiting Ibrahim (AS) — before proceeding to punish the people of Lut (AS) — blessed his household with Allah's mercy and blessings, affirming that He is Praiseworthy and Honorable.                                                                    | Ibrahim AS, Angels, Intercession                                      |
| 7   | 12:92      | Yusuf AS — Forgiving His Brothers                        | After his brothers came before him in Egypt, Yusuf (AS) forgave them and prayed for Allah's forgiveness upon them, declaring no blame on them and that Allah is the Most Merciful of the merciful.                                                                  | Yusuf AS, Intercession, Forgiveness                                   |
| 8   | 14:37      | Ibrahim AS — Prayer for His Family in Makkah             | When Ibrahim (AS) left Hajar and infant Ismail (AS) in the barren valley of Makkah, he prayed for people's hearts to be drawn to them and for them to be provided with fruits, so they may be grateful.                                                             | Ibrahim AS, Descendants, Food                                         |
| 9   | 14:40      | Ibrahim AS — Establishers of Prayer                      | Ibrahim (AS) prayed for himself and his descendants to remain steadfast in establishing prayer, and asked Allah to accept his supplication.                                                                                                                         | Ibrahim AS, Descendants                                               |
| 10  | 14:41      | Ibrahim AS — Forgiveness on the Day of Reckoning         | Ibrahim (AS) prayed for forgiveness for himself, his parents, and all believers on the Day of Judgment.                                                                                                                                                             | Ibrahim AS, Forgiveness, Parents                                      |
| 11  | 17:24      | Prayer for Parents — Mercy                               | Allah commands believers to be humble and kind to their parents and pray: "My Lord, have mercy upon them as they brought me up when I was small." A prayer of gratitude and compassion for one's parents.                                                           | Parents, Mercy                                                        |
| 12  | 17:80      | Prayer for Truthful Entry and Exit                       | Allah instructs Prophet Muhammad (SAW) to pray for a truthful entrance and exit, and for authority from Allah as a helper. Linked to the night prayer and Quran recitation.                                                                                         | Protection, Night Prayer                                              |
| 13  | 18:10      | People of the Cave — Mercy and Guidance                  | The young believers who fled to the cave seeking refuge from persecution prayed for Allah's mercy and for guidance to the right course in their affair.                                                                                                             | Guidance, Mercy                                                       |
| 14  | 18:24      | Remembrance After Forgetting InshaAllah                  | Allah instructs that when making plans, one should say InshaAllah. If forgotten, one should remember Allah and pray: "Perhaps my Lord will guide me to what is nearer than this to right conduct."                                                                  | Guidance                                                              |
| 15  | 18:39      | Acknowledging Allah's Will — Ma Sha Allah                | The believing companion rebuked the boastful garden owner for not saying "Ma sha Allah, la quwwata illa billah" (What Allah willed; there is no power except in Allah) upon entering his garden. A lesson in attributing blessings to Allah.                        | Protection                                                            |
| 16  | 20:114     | Prayer for Increase in Knowledge                         | Allah directs Prophet Muhammad (SAW) to pray: "My Lord, increase me in knowledge." A concise and powerful prayer for seeking beneficial knowledge.                                                                                                                  | Knowledge, Mohammad SAW                                               |
| 17  | 21:83      | Ayyub AS — Afflicted and Calling on Allah                | When Ayyub (AS) was struck by prolonged illness and hardship, he called upon Allah: "Indeed, adversity has touched me, and you are the Most Merciful of the merciful."                                                                                              | Help, Ayyub AS, Mercy                                                 |
| 18  | 21:87      | Yunus AS — Repentance from the Darkness                  | From the belly of the whale, in layers of darkness, Yunus (AS) called out: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." A profound acknowledgment of mistake and declaration of Allah's glory.                           | Forgiveness, Yunus AS, Repentance                                     |
| 19  | 21:89      | Zakariyya AS — Do Not Leave Me Alone                     | Zakariyya (AS) prayed: "My Lord, do not leave me alone [with no heir], while You are the best of inheritors." A prayer born of longing for a righteous child.                                                                                                       | Zecharia AS, Child                                                    |
| 20  | 23:26      | Nuh AS — Help Against Rejection                          | When his people rejected him, Nuh (AS) turned to Allah: "My Lord, support me because they have denied me."                                                                                                                                                          | Help, Nuh AS                                                          |
| 21  | 23:29      | Nuh AS — Blessed Landing                                 | Allah directed Nuh (AS) to pray upon disembarking from the ark: "My Lord, let me land at a blessed landing place, and You are the best to accommodate us."                                                                                                          | Help, Nuh AS                                                          |
| 22  | 23:39      | Hud AS — Help Against Denial                             | When the people of 'Ad rejected Hud (AS), he prayed: "My Lord, support me because they have denied me."                                                                                                                                                             | Help, Hud AS                                                          |
| 23  | 23:93-94   | Protection from Being Among Wrongdoers                   | Allah instructs Prophet Muhammad (SAW) to pray for protection from being placed among the wrongdoing people when Allah's punishment descends upon them.                                                                                                             | Mohammad SAW, Protection                                              |
| 24  | 23:97-98   | Refuge from the Whisperings of Shaytan                   | Allah commands Prophet Muhammad (SAW) to seek refuge from the evil suggestions of the devils and from even their presence.                                                                                                                                          | Refuge, Mohammad SAW                                                  |
| 25  | 23:109     | Prayer of the Attainers of Success                       | Allah describes a group of believers who pray: "Our Lord, we have believed, so forgive us and have mercy upon us, and You are the best of the merciful." Those who make this prayer are among the successful.                                                       | Forgiveness, Mercy                                                    |
| 26  | 23:118     | Prayer for Forgiveness and Mercy                         | Allah directs Prophet Muhammad (SAW) to say: "My Lord, forgive and have mercy, and You are the best of the merciful."                                                                                                                                               | Forgiveness, Mercy, Mohammad SAW                                      |
| 27  | 25:65-66   | Protection from the Torment of Hell                      | Among the qualities of the servants of the Most Merciful: they pray that the punishment of Hell be averted from them, for its punishment is an unceasing affliction.                                                                                                | Protection from Hell                                                  |
| 28  | 26:83-89   | Ibrahim AS — Comprehensive Prayer for the Hereafter      | Ibrahim (AS) asked Allah for wisdom, to be joined with the righteous, a lasting good mention, inheritance in the Garden of Pleasure, forgiveness for his astray father, and protection from disgrace on the Day of Resurrection.                                    | Ibrahim AS, Heaven, Father, Die As Muslims                            |
| 29  | 26:117-118 | Nuh AS — Judge Between Me and Them                       | When his people threatened to stone him, Nuh (AS) prayed: "My Lord, indeed my people have denied me. Then judge between me and them decisively and save me and those with me of the believers."                                                                     | Nuh AS, Help, Brotherhood                                             |
| 30  | 26:169     | Lut AS — Save My Family                                  | Lut (AS) prayed for safety for himself and his family from the consequences of his people's transgressions.                                                                                                                                                         | Protection, Lut AS                                                    |
| 31  | 27:19      | Sulaiman AS — Gratitude for Blessings                    | Upon hearing the ant's warning, Sulaiman (AS) smiled and prayed: "My Lord, enable me to be grateful for Your favor which You bestowed upon me and my parents, and to do righteousness of which You approve."                                                        | Gratitude, Sulaiman AS                                                |
| 32  | 27:59      | Praise and Peace Upon Chosen Servants                    | Allah instructs Prophet Muhammad (SAW) to declare: "Praise is for Allah, and peace upon His servants whom He has chosen."                                                                                                                                           | Mohammad SAW, Peace, Praising Allah                                   |
| 33  | 28:16      | Musa AS — Forgiveness After a Mistake                    | After accidentally causing a man's death, Musa (AS) prayed: "My Lord, indeed I have wronged myself, so forgive me." Allah forgave him — He is the Forgiving, the Merciful.                                                                                          | Musa AS, Forgiveness                                                  |
| 34  | 28:21      | Musa AS — Save Me from the Wrongdoers                    | Fleeing from Pharaoh's people after being warned, Musa (AS) prayed for Allah to save him from the wrongdoing people.                                                                                                                                                | Help, Musa AS                                                         |
| 35  | 28:22      | Musa AS — Guide Me to the Right Path                     | As Musa (AS) set out toward Madyan, he prayed: "Perhaps my Lord will guide me to the right way."                                                                                                                                                                    | Guidance, Musa AS                                                     |
| 36  | 28:24      | Musa AS — In Desperate Need of Good                      | After arriving in Madyan exhausted, having fled Egypt with nothing, Musa (AS) prayed: "My Lord, indeed I am, for whatever good You would send down to me, in need." Shortly after, he met his future wife.                                                          | Musa AS, Hardship, Help                                               |
| 37  | 29:30      | Lut AS — Help Against the Corruptors                     | Lut (AS) prayed: "My Lord, support me against the corrupting people."                                                                                                                                                                                               | Protection, Lut AS                                                    |
| 38  | 37:100     | Ibrahim AS — Grant Me a Righteous Child                  | Ibrahim (AS) prayed: "My Lord, grant me a child from among the righteous." Allah gave him glad tidings of a forbearing boy (Ismail AS).                                                                                                                             | Ibrahim AS, Child                                                     |
| 39  | 38:35      | Sulaiman AS — A Kingdom Like No Other                    | Sulaiman (AS) prayed: "My Lord, forgive me and grant me a kingdom such as will not belong to anyone after me." Allah granted him dominion over the wind and the jinn.                                                                                               | Sulaiman AS, Kingdom                                                  |
| 40  | 38:41      | Ayyub AS — Calling Out in Affliction                     | Ayyub (AS) called out to his Lord: "Indeed, Satan has touched me with hardship and torment." Allah responded by restoring his health and family.                                                                                                                    | Help, Ayyub AS                                                        |
| 41  | 40:7-9     | Angels' Prayer for Believers                             | The angels who bear the Throne and those around it glorify Allah and pray for the believers: seeking forgiveness, mercy, protection from Hell, and entry into the Gardens of Eden for them, their families, and their righteous ancestors.                          | Forgiveness, Mercy, Protection from Hell, Heaven, Brotherhood, Angels |
| 42  | 46:15      | Prayer for Gratitude and Righteous Offspring             | A prayer Allah encourages: to be grateful for blessings upon oneself and one's parents, to do righteous deeds, and for one's offspring to be righteous. Those who make this prayer — Allah accepts the best of their deeds and overlooks their misdeeds.            | Gratitude, Parents, Child                                             |
| 43  | 54:10      | Nuh AS — I Am Overpowered, So Help                       | After prolonged rejection, Nuh (AS) called upon his Lord: "Indeed, I am overpowered, so help." Allah responded by opening the gates of heaven with rain.                                                                                                            | Nuh AS, Help                                                          |
| 44  | 59:10      | Brotherhood — Remove Resentment                          | A prayer of the later believers for those who preceded them in faith: seeking forgiveness and asking Allah to remove any resentment from their hearts toward fellow believers. Initially made by early Muslims uniting those who accepted Islam at different times. | Brotherhood, Forgiveness                                              |
| 45  | 60:4-5     | Ibrahim AS — Trust in Allah Against Disbelief            | Ibrahim (AS) and those with him declared their dissociation from disbelievers, put their trust in Allah, and prayed not to be made a trial for the disbelieving people and for Allah's forgiveness.                                                                 | Help, Forgiveness, Ibrahim AS                                         |
| 46  | 66:8       | Prayer of the Believers on the Day of Judgment           | On the Day of Judgment, the believing people pray: "Our Lord, perfect for us our light and forgive us. Indeed, You are over all things competent."                                                                                                                  | Forgiveness                                                           |
| 47  | 66:11      | Wife of Pharaoh — A House in Paradise                    | Asiya, the wife of Pharaoh, prayed: "My Lord, build for me near You a house in Paradise and save me from Pharaoh and his deeds and save me from the wrongdoing people." Allah presents her as an example for the believers.                                         | Heaven, Protection, Wife of Pharaoh                                   |
| 48  | 71:28      | Nuh AS — Forgiveness for Himself, Parents, and Believers | Nuh (AS) prayed for forgiveness for himself, his parents, and all believing men and women, while praying against the wrongdoers.                                                                                                                                    | Nuh AS, Forgiveness, Parents, Brotherhood, Curse                      |
| 49  | 113:1-5    | Al-Falaq — Seeking Refuge in the Lord of Dawn            | Allah instructs to seek refuge in the Lord of daybreak from the evil of creation, darkness, those who blow on knots (sorcery), and the evil of the envious. A complete surah of protection.                                                                         | Help, Refuge                                                          |
| 50  | 114:1-6    | An-Nas — Seeking Refuge in the Lord of Mankind           | Allah instructs to seek refuge in the Lord, Sovereign, and God of mankind from the evil of the retreating whisperer — who whispers into the hearts of mankind — from among jinn and men. A complete surah of protection.                                            | Help, Refuge                                                          |

---

## Edge Cases & Special Notes

1. **Partial verses**: Prayers at 2:67, 12:23, 18:24, 18:39, 20:114 contain the prayer as part of a larger verse. Add `partialVerse` field with a note for each.

2. **27:117-118 → 26:117-118**: Confirmed typo. Surah 27 has only 93 verses. Correct reference is Surah 26 (Ash-Shu'ara).

3. **40:7-9 duplicate**: Appeared twice in user's table with different tags. Merged into one entry (#41) with combined tags.

4. **p9 split**: Current p9 (2:285-286) splits into p9 (2:285) and a new entry (2:286). Both need their `content` arrays deleted for re-fetch.

5. **p1 verse change**: Changing from 1:2-7 to 1:1-7 requires deleting `content` for re-fetch.

6. **ID assignment**: After removing p12, p16, p23, new prayers get IDs p29 onward. Total ~75 prayers. Consider re-numbering all IDs sequentially for cleanliness, or keep existing IDs and append.

7. **11:73**: This verse is more of a blessing (angels to Ibrahim's household) than a dua. User explicitly wants it included.

8. **12:92**: This is Yusuf AS forgiving his brothers, not a traditional dua format. The phrase "may Allah forgive you" serves as a supplication.

9. **27:59**: This is a declaration of praise rather than a personal prayer. User wants it included.

---

## Implementation Steps

### Phase 1: Tafsir Research (can run in parallel with Phase 2)

1. Call `GET /resources/tafsirs` to find Ibn Kathir English resource ID
2. Write `scripts/fetch-tafsir.ts` — a small helper that iterates over all prayer verse keys and fetches tafsir text via `GET /tafsirs/{id}/by_ayah/{verse_key}` (rate-limited at 150ms)
3. Save tafsir output to a review file (e.g., `tafsir-output.txt`)
4. Review tafsir to refine the drafted descriptions above — adjust any descriptions that are inaccurate or miss context
5. Delete `scripts/fetch-tafsir.ts` and `tafsir-output.txt` after review (they're one-time research artifacts)

### Phase 2: Data Preparation (_depends on finalized descriptions from Phase 1_)

1. Remove p12, p16, p23 entries from `src/data.json`
2. Split p9 into two entries — delete `content` from both
3. Update p1 verses to `1:1-7` — delete its `content`
4. Update all 24 existing prayers with new title, description, tags per the table above
5. Add all ~50 new prayer entries (metadata only) per the table above
6. Verify all `verses` fields use the correct `surah:start-end` format

### Phase 3: Content Enrichment (_depends on Phase 2_)

1. Run `npm run fetch-data` to enrich new prayers and re-fetch modified ones
2. Verify script completes without errors
3. Spot-check a few enriched entries for correct Arabic text and translations

### Phase 4: Verification

1. Run `npm run build` — verify no build errors
2. Run the app locally (`npm run dev`)
3. Check that all prayers render correctly (Arabic text, translations, word-by-word)
4. Test tag filtering — verify all new tags appear and filtering works (OR logic)
5. Spot-check prayers with `partialVerse` notes
6. Verify prayer count matches expected total (~75)

---

## Decisions Made

- **27:117-118 → 26:117-118** (typo fix confirmed by user)
- **Split 2:285 and 2:286** into separate prayers (confirmed by user)
- **Remove p12, p16, p23** from data.json (confirmed by user)
- **Include verse 1** in Al-Fatiha (1:1-7) (confirmed by user)
- **No changes to parseVerseRef** — all verse references fit existing format
- **No changes to fetch script** — existing script handles everything needed
