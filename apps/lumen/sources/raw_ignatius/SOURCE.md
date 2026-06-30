# Source

7 authentic letters of St. Ignatius of Antioch (c. 110 AD), Ante-Nicene
Fathers translation (Roberts & Donaldson, PD), fetched from:
https://github.com/scrollmapper/bible_databases_deuterocanonical
(etc/en/church_history/ante-nicene/ignatius-epistle-to-*)

scrollmapper is already the established source for this app's primary
scripture text (see sources/harvest_scripture.py and DRC.json provenance).

Each file interleaves the genuine Shorter/Middle Recension (the authentic
text) with the spurious 4th-century Longer Recension's restatement of the
same chapter -- within each chapter, the verses repeat once, and the FIRST
pass through a chapter is the genuine Shorter Recension; the repeated second
pass is the Longer Recension forgery and should not be used as Ignatius's
own words. curated_fathers_ignatius.json was hand-curated from the first
(Shorter Recension) pass only.

Spurious/non-genuine letters present in the upstream repo (epistle-to-
antiochians, epistle-to-hero, epistle-to-mary-at-neapolis, epistle-to-st-
john, epistle-to-tarsians, epistle-to-the-virgin-mary, epistle-of-maria-to-
ignatius, reply-of-the-blessed-virgin) were not fetched -- they are later
forgeries, not from Ignatius.
