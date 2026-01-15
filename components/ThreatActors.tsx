
import React, { useState, useMemo } from 'react';
import { ShieldAlert, ExternalLink, Activity, Info, Globe, Search, Crosshair, Ghost, Terminal, Database, Server } from 'lucide-react';

export interface ThreatActor {
  name: string;
  category: 'Ransomware (RaaS)' | 'Intelligence Aggregator' | 'Defacement / Hacktivism';
  description: string;
  tracking: string;
  url: string;
  tags: string[];
}

const actors: ThreatActor[] = [
  // --- CLEARWEB / UTILITY SOURCES ---
  { name: "GitHub: doormanBreach", category: "Intelligence Aggregator", description: "Tracks new leak/dump references published via the doormanBreach GitHub presence.", tracking: "Catching 'meta' links pointing to fresh breach drops.", url: "https://github.com/doormanBreach", tags: ["GitHub", "Meta"] },
  { name: "Handala Hack", category: "Defacement / Hacktivism", description: "Monitors the Handala Hack public-facing leak/announcement surface.", tracking: "Real-time ingestion of hacktivist leak activity.", url: "https://handala-hack.to", tags: ["Hacktivism", "Real-time"] },
  { name: "Ransom.wiki", category: "Intelligence Aggregator", description: "Ransomware group directory and official leak portal index.", tracking: "Mapping incidents to actor infrastructure.", url: "https://ransom.wiki", tags: ["Directory", "Wiki"] },
  { name: "Ransomed", category: "Intelligence Aggregator", description: "Indexes victim posts across multiple ransomware groups.", tracking: "Used to confirm victim appearance and timing.", url: "https://ransomed.biz", tags: ["Index", "Triage"] },
  { name: "RansomLook", category: "Intelligence Aggregator", description: "Aggregates victim disclosures across many ransomware leak sites.", tracking: "Useful for actor/victim pivoting and history.", url: "https://www.ransomlook.io", tags: ["Aggregate", "Pivot"] },
  { name: "Ransomware.live", category: "Intelligence Aggregator", description: "Structured views of ransomware victim publications by sector.", tracking: "Global trend monitoring and validation.", url: "https://www.ransomware.live", tags: ["Live", "Global"] },
  { name: "CSIDB", category: "Intelligence Aggregator", description: "Monitors ransomware actor/victim intelligence ecosystem.", tracking: "Actor attribution support and cross-referencing.", url: "https://www.csidb.net", tags: ["Ecosystem", "Attribution"] },
  { name: "Darkfeed", category: "Intelligence Aggregator", description: "Ingests threat intel / leak-related items from Darkfeed.", tracking: "Broad coverage beyond single leak sites.", url: "https://darkfeed.io", tags: ["Intel-Feed", "Broad"] },
  { name: "DDoSecrets", category: "Intelligence Aggregator", description: "Indexes large-scale document dumps and collections.", tracking: "Identifying major multi-org leak drops.", url: "https://ddosecrets.com/all_articles/a-z", tags: ["Dumps", "Archive"] },
  { name: "Business Data Leaks", category: "Intelligence Aggregator", description: "Monitors business-oriented leak postings and data-sales.", tracking: "Catching non-ransom data exposure releases.", url: "https://business-data-leaks.com", tags: ["Business", "Sales"] },
  { name: "Leak-Lookup", category: "Intelligence Aggregator", description: "Integrates breach lookup references for validation.", tracking: "Supports confirmation lookups and context.", url: "https://leak-lookup.com", tags: ["Lookup", "Context"] },
  { name: "Mozilla Monitor", category: "Intelligence Aggregator", description: "Monitors Mozilla’s public breach listings.", tracking: "Mapping brand exposure to cataloged incidents.", url: "https://monitor.mozilla.org/breaches", tags: ["Reference", "Monitoring"] },
  { name: "NetLeaks", category: "Intelligence Aggregator", description: "Monitors NetLeaks’ leak publications and victim refs.", tracking: "Additional index surface for emerging leaks.", url: "https://netleaks.net", tags: ["Portal", "Emerging"] },
  { name: "Intel Repository", category: "Intelligence Aggregator", description: "Tracks repository-style leak publishing surfaces.", tracking: "Collecting structured leak drop references.", url: "https://intelrepository.com", tags: ["Repo", "Spectre"] },
  { name: "Toufan Index", category: "Intelligence Aggregator", description: "Tracks Toufan victim postings via structured view.", tracking: "Consistent parsing when infra is unstable.", url: "https://www.ransomlook.io/group/toufan", tags: ["Toufan", "Parsing"] },

  // --- NAMED RANSOMWARE (TOR) ---
  { name: "LockBit (Tor)", category: "Ransomware (RaaS)", description: "LockBit victim posts, samples, and publication updates.", tracking: "Attribution pivots and victim timeline tracking.", url: "http://lockbit7z2jwcskxpbokpemdxmltipntwlkmidcll2qirbu7ykg46eyd.onion/", tags: ["LockBit", "RaaS", "Tor"] },
  { name: "Akira (Tor)", category: "Ransomware (RaaS)", description: "Akira victim announcements and leak drops.", tracking: "Collect victim lists and evidence artifacts.", url: "http://akiral2iz6a7qgd3ayp3l6yub7xx2uep76idk3u2kollpj5z3z636bad.onion/", tags: ["Akira", "Tor", "Leak"] },
  { name: "Rhysida (Tor)", category: "Ransomware (RaaS)", description: "Rhysida victim releases and leak updates.", tracking: "Early alerting and historical archiving.", url: "http://rhysidafohrhyy2aszi7bm32tnjat5xri65fopcxkdfxhi4tidsg7cad.onion/", tags: ["Rhysida", "Tor", "Alert"] },
  { name: "Hunters International (Tor)", category: "Ransomware (RaaS)", description: "Hunters International victim publication feed.", tracking: "Tracking new victims and validating breaches.", url: "http://hunters55atbdusuladzv7vzv6a423bkh6ksl2uftwrxyuarbzlfh7yd.onion/", tags: ["Hunters", "Tor", "Feed"] },
  { name: "Everest (Tor)", category: "Ransomware (RaaS)", description: "Everest Tor leak portal and announcements.", tracking: "Actor tracking and victim confirmation.", url: "http://ransomocmou6mnbquqz44ewosbkjk3o5qjsl3orawojexfook2j7esad.onion/", tags: ["Everest", "Tor"] },
  { name: "CiphBit (Tor)", category: "Ransomware (RaaS)", description: "CiphBit onion leak surface for new claims.", tracking: "Alerting and consistent post archiving.", url: "http://ciphbitqyg26jor7eeo6xieyq7reouctefrompp6ogvhqjba7uo4xdid.onion/", tags: ["CiphBit", "Archive"] },
  { name: "LunaLock (Tor)", category: "Ransomware (RaaS)", description: "LunaLock onion victim pages and releases.", tracking: "Leak detection and victim timeline tracking.", url: "http://lunalockcccxzkpfovwzifwxcytqkiuak6wzybnniqwxcmpsetpbetid.onion/", tags: ["LunaLock", "Timeline"] },
  { name: "SafePay (Tor)", category: "Ransomware (RaaS)", description: "SafePay onion portal for published victims.", tracking: "Catching disclosures quickly for incident cases.", url: "http://safepaypfxntwixwjrlcscft433ggemlhgkkdupi2ynhtcmvdgubmoyd.onion/", tags: ["SafePay", "Incidents"] },
  { name: "Warlock (Tor)", category: "Ransomware (RaaS)", description: "Warlock onion victim announcements and drops.", tracking: "Actor tracking and multi-source correlation.", url: "http://warlockhga5iw3t54ps5iytlilf7hlvxy7kwrkidspn4qoh64s4vsuyd.onion/", tags: ["Warlock", "Correlation"] },

  // --- ANONYMOUS TOR LEAK SOURCES ---
  { name: "34o4m3f (Tor)", category: "Ransomware (RaaS)", description: "Tor-based leak/dump portal monitored for victim claims.", tracking: "Enrich alerts and preserve historical evidence.", url: "http://34o4m3f26ucyeddzpf53bksy76wd737nf2fytslovwd3viac3by5chad.onion/", tags: ["Onion", "Evidence"] },
  { name: "Genesis6ix (Tor)", category: "Ransomware (RaaS)", description: "Onion leak surface for new victim posts and changes.", tracking: "Early detection and archival snapshots.", url: "http://genesis6ixpb5mcy4kudybtw5op2wqlrkocfogbnenz3c647ibqixiad.onion/", tags: ["Onion", "Snapshot"] },
  { name: "Pdcizqz (Tor)", category: "Ransomware (RaaS)", description: "Victim announcements and leak listings from onion portal.", tracking: "Correlate targets and extract evidence.", url: "http://pdcizqzjitsgfcgqeyhuee5u6uki6zy5slzioinlhx6xjnsw25irdgqd.onion/", tags: ["Onion", "Extraction"] },
  { name: "3bnusfu (Tor)", category: "Ransomware (RaaS)", description: "Tracks postings, samples, and timestamps on onion site.", tracking: "Monitoring newly published victims.", url: "http://3bnusfu2lgk5at43ceu7cdok5yv4gfbono2jv57ho74ucjvc7czirfid.onion/", tags: ["Onion", "Tracking"] },
  { name: "Peargxn (Tor)", category: "Ransomware (RaaS)", description: "Tor leak portal for disclosures and data releases.", tracking: "Evidence capture and enrichment.", url: "http://peargxn3oki34c4savcbcfqofjjwjnnyrlrbszfv6ujlx36mhrh57did.onion/", tags: ["Onion", "Capture"] },
  { name: "3ev4met (Tor)", category: "Ransomware (RaaS)", description: "Leak posts and victim pages for alerting.", tracking: "Tracking changes to entries over time.", url: "http://3ev4metjirohtdpshsqlkrqcmxq6zu3d7obrdhglpy5jpbr7whmlfgqd.onion/", tags: ["Onion", "Changes"] },
  { name: "Gunrabx (Tor)", category: "Ransomware (RaaS)", description: "Onion leak site for new victims and evidence.", tracking: "Extract indicators and link victims to cases.", url: "http://gunrabxbig445sjqa535uaymzerj6fp4nwc6ngc2xughf2pedjdhk4ad.onion/", tags: ["Onion", "Indicators"] },
  { name: "Pearsmob (Tor)", category: "Ransomware (RaaS)", description: "Victim posts and leak samples on onion portal.", tracking: "Continuous monitoring and snapshots.", url: "http://pearsmob5sn44ismokiusuld34pnfwi6ctgin3qbvonpoob4lh3rmtqd.onion/", tags: ["Onion", "Samples"] },
  { name: "47glxku (Tor)", category: "Ransomware (RaaS)", description: "Onion leak site for victim disclosures and updates.", tracking: "Detection and historical archiving.", url: "http://47glxkuxyayqrvugfumgsblrdagvrah7gttfscgzn56eyss5wg3uvmqd.onion/", tags: ["Onion", "History"] },
  { name: "5butbkr (Tor)", category: "Ransomware (RaaS)", description: "Victim pages and leak posts from onion portal.", tracking: "Correlate with other leak indices.", url: "http://5butbkrljkaorg5maepuca25oma7eiwo6a2rlhvkblb4v6mf3ki2ovid.onion/", tags: ["Onion", "Correlation"] },
  { name: "Hptqq2o (Tor)", category: "Ransomware (RaaS)", description: "Newly published victims and updates on onion leak site.", tracking: "Early warning and timeline construction.", url: "http://hptqq2o2qjva7lcaaq67w36jihzivkaitkexorauw7b2yul2z6zozpqd.onion/", tags: ["Onion", "Timeline"] },
  { name: "7ukmkdt (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and leak artifacts on Tor portal.", tracking: "Enrichment and evidence retention.", url: "http://7ukmkdtyxdkdivtjad57klqnd3kdsmq6tp45rrsxqnu76zzv3jvitlqd.onion/", tags: ["Onion", "Retention"] },
  { name: "Ijzn3si (Tor)", category: "Ransomware (RaaS)", description: "Structured victim posts and leak updates from onion site.", tracking: "Cross-source correlation and IOC extraction.", url: "http://ijzn3sicrcy7guixkzjkib4ukbiilwc3xhnmby4mcbccnsd7j2rekvqd.onion/", tags: ["Onion", "Structured"] },
  { name: "Imncrew (Tor)", category: "Ransomware (RaaS)", description: "Victim postings and leak drops on onion portal.", tracking: "Ongoing monitoring and evidence archiving.", url: "http://imncrewwfkbjkhr2oylerfm5qtbzfphhmpcfag43xc2kfgvluqtlgoid.onion/", tags: ["Onion", "Archiving"] },
  { name: "Arcuufp (Tor)", category: "Ransomware (RaaS)", description: "Tor leak site for new victims, edits, and samples.", tracking: "Alerting and historic snapshots.", url: "http://arcuufpr5xxbbkin4mlidt7itmr6znlppk63jbtkeguuhszmc5g7qdyd.onion/", tags: ["Onion", "Snapshots"] },
  { name: "Incblog (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and leak content from onion portal.", tracking: "Enrichment and cross-index confirmation.", url: "http://incblog6qu4y4mm4zvw5nrmue6qbwtgjsxpw6b7ixzssu36tsajldoad.onion/", tags: ["Onion", "Blog"] },
  { name: "Rnsm777 (Tor)", category: "Ransomware (RaaS)", description: "Victim posts and leak changes from onion site.", tracking: "Capture evidence and track cadence.", url: "http://rnsm777cdsjrsdlbs4v5qoeppu3px6sb2igmh53jzrx7ipcrbjz5b2ad.onion/", tags: ["Onion", "Cadence"] },
  { name: "Basheqt (Tor)", category: "Ransomware (RaaS)", description: "Postings and victims on Tor leak portal.", tracking: "Alerting and data sample collection.", url: "http://basheqtvzqwz4vp6ks5lm2ocq7i6tozqgf6vjcasj4ezmsy4bkpshhyd.onion/", tags: ["Onion", "Samples"] },
  { name: "J3dp6ok (Tor)", category: "Ransomware (RaaS)", description: "Onion portal for victim disclosures and leak evidence.", tracking: "Continuous monitoring and archiving.", url: "http://j3dp6okmaklajrsk6zljl5sfa2vpui7j2w6cwmhmmqhab6frdfbphhid.onion/", tags: ["Onion", "Archiving"] },
  { name: "Rnsmware (Tor)", category: "Ransomware (RaaS)", description: "Leak posts from onion site for victim enrichment.", tracking: "Cross-checking victims against indices.", url: "http://rnsmwareartse3m4hjsumjf222pnka6gad26cqxqmbjvevhbnym5p6ad.onion/", tags: ["Onion", "Enrichment"] },
  { name: "Beast6a (Tor)", category: "Ransomware (RaaS)", description: "Victim pages and evidence posted on onion leak portal.", tracking: "Alerts and archival evidence retention.", url: "http://beast6azu4f7fxjakiayhnssybibsgjnmy77a6duufqw5afjzfjhzuqd.onion/", tags: ["Onion", "Retention"] },
  { name: "J5o5y2f (Tor)", category: "Ransomware (RaaS)", description: "Tor leak surface for newly published victims.", tracking: "Enrichment and historical recordkeeping.", url: "http://j5o5y2feotmhvr7cbcp2j2ewayv5mn5zenl3joqwx67gtfchhezjznad.onion/", tags: ["Onion", "Historical"] },
  { name: "Benzona (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and leak drops from onion portal.", tracking: "Early alerting and case evidence capture.", url: "http://benzona6x5ggng3hx52h4mak5sgx5vukrdlrrd3of54g2uppqog2joyd.onion/", tags: ["Onion", "Evidence"] },
  { name: "Jvkpexg (Tor)", category: "Ransomware (RaaS)", description: "Victim posts and update timestamps on onion leak site.", tracking: "Enrichment and correlation.", url: "http://jvkpexgkuaw5toiph7fbgucycvnafaqmfvakymfh5pdxepvahw3xryqd.onion/", tags: ["Onion", "Correlation"] },
  { name: "Sarcoma (Tor)", category: "Ransomware (RaaS)", description: "Victim claims and leak evidence from onion portal.", tracking: "Incident validation and historical tracking.", url: "http://sarcomawmawlhov7o5mdhz4eszxxlkyaoiyiy2b5iwxnds2dmb4jakad.onion/", tags: ["Onion", "Validation"] },
  { name: "Bertblog (Tor)", category: "Ransomware (RaaS)", description: "Posts and victim listings from onion leak surface.", tracking: "Archival and enrichment of company cases.", url: "http://bertblogsoqmm4ow7nqyh5ik7etsmefdbf25stauecytvwy7tkgizhad.onion/", tags: ["Onion", "Cases"] },
  { name: "K7kg3jq (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and changes from onion portal.", tracking: "Detecting edits/removals and timeline integrity.", url: "http://k7kg3jqxang3wh7hnmaiokchk7qoebupfgoik6rha6mjpzwupwtj25yd.onion/", tags: ["Onion", "Integrity"] },
  { name: "Securo4 (Tor)", category: "Ransomware (RaaS)", description: "Tor leak site for victim publications and data samples.", tracking: "Cross-source matching and evidence capture.", url: "http://securo45z554mw7rgrt7wcgv5eenj2xmxyrsdj3fcjsvindu63s4bsid.onion/", tags: ["Onion", "Matching"] },
  { name: "Black3g (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and evidence on onion portal.", tracking: "Enrichment and long-term archives.", url: "http://black3gnkizshuynieigw6ejgpblb53mpasftzd6pydqpmq2vn2xf6yd.onion/", tags: ["Onion", "Long-term"] },
  { name: "Kawasa2 (Tor)", category: "Ransomware (RaaS)", description: "Victim posts and leak artifacts from onion site.", tracking: "Link victims into cases and dashboards.", url: "http://kawasa2qo7345dt7ogxmx7qmn6z2hnwaoi3h5aeosupozkddqwp6lqqd.onion/", tags: ["Onion", "Dashboards"] },
  { name: "Shinypo (Tor)", category: "Ransomware (RaaS)", description: "Onion leak portal for new victims and evidence.", tracking: "Timely alerts and archival snapshots.", url: "http://shinypogk4jjniry5qi7247tznop6mxdrdte2k6pdu5cyo43vdzmrwid.onion/", tags: ["Onion", "Alerts"] },
  { name: "Blogvl7 (Tor)", category: "Ransomware (RaaS)", description: "Leak posts and victim disclosures from onion site.", tracking: "Enrichment and correlation.", url: "http://blogvl7tjyjvsfthobttze52w36wwiz34hrfcmorgvdzb6hikucb7aqd.onion/", tags: ["Onion", "Correlation"] },
  { name: "Kraken (Tor)", category: "Ransomware (RaaS)", description: "Onion leak portal for victim posts, updates, and samples.", tracking: "Alerting and evidence capture.", url: "http://krakenccj3wr23452a4ibkbkuph4d6soyx2xgjoogtuamc3m7u7wemad.onion/", tags: ["Onion", "Capture"] },
  { name: "Silentb (Tor)", category: "Ransomware (RaaS)", description: "Victim announcements and leak evidence on onion site.", tracking: "Case enrichment and audit trails.", url: "http://silentbgdghp3zeldwpumnwabglreql7jcffhx5vqkvtf2lshc4n5zid.onion/", tags: ["Onion", "Audit"] },
  { name: "Brohood (Tor)", category: "Ransomware (RaaS)", description: "Leak posts from onion portal for monitoring.", tracking: "Identifying new victim publications quickly.", url: "http://brohoodyaifh2ptccph5zfljyajjabwjjo4lg6gfp4xb6ynw5w7ml6id.onion/", tags: ["Onion", "Quick"] },
  { name: "Ks5424y (Tor)", category: "Ransomware (RaaS)", description: "Victim posts and evidence on Tor leak surface.", tracking: "Enrichment and historical snapshots.", url: "http://ks5424y3wpr5zlug5c7i6svvxweinhbdcqcfnptkfcutrncfazzgz5id.onion/", tags: ["Onion", "Snapshots"] },
  { name: "Tezwss (Tor)", category: "Ransomware (RaaS)", description: "Onion portal for new victims and leak samples.", tracking: "Alerting and correlation across indices.", url: "http://tezwsse5czllksjb7cwp65rvnk4oobmzti2znn42i43bjdfd2prqqkad.onion/", tags: ["Onion", "Alerting"] },
  { name: "Cicada (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and leak evidence from onion site.", tracking: "Enrichment and evidence retention.", url: "http://cicadabv7vicyvgz5khl7v2x5yygcgow7ryyy6yppwmxii4eoobdaztqd.onion/", tags: ["Onion", "Retention"] },
  { name: "Leaksnd (Tor)", category: "Ransomware (RaaS)", description: "Onion leak portal for published victims and updates.", tracking: "Case timelines and alert verification.", url: "http://leaksndi6i6m2ji6ozulqe4imlrqn6wrgjlhxe25vremvr3aymm4aaid.onion/", tags: ["Onion", "Verification"] },
  { name: "Tp5cwh6 (Tor)", category: "Ransomware (RaaS)", description: "Victim claims and leak evidence on Tor portal.", tracking: "Enrichment and historical archiving.", url: "http://tp5cwh6d2b5hekcg6jlhoe6mawa7dlwiv47epvnfmzuaaur2dnaa3uid.onion/", tags: ["Onion", "Archiving"] },
  { name: "Twniiye (Tor)", category: "Ransomware (RaaS)", description: "Onion leak site for new victims and edits.", tracking: "Continuous monitoring and snapshots.", url: "http://twniiyed6mydtbe64i5mdl56nihl7atfaqtpww6gqyaiohgc75apzpad.onion/", tags: ["Onion", "Monitoring"] },
  { name: "Txtggyn (Tor)", category: "Ransomware (RaaS)", description: "Victim posts and leak listings from onion portal.", tracking: "Enrichment and correlation.", url: "http://txtggyng5euqkyzl2knbejwpm4rlq575jn2egqldu27osbqytrj6ruyd.onion/", tags: ["Onion", "Correlation"] },
  { name: "Ctyfftr (Tor)", category: "Ransomware (RaaS)", description: "Tor leak site for victim publications and samples.", tracking: "Alerting and archival retention.", url: "http://ctyfftrjgtwdjzlgqh4avbd35sqrs6tde4oyam2ufbjch6oqpqtkdtid.onion/", tags: ["Onion", "Retention"] },
  { name: "Lynxblo (Tor)", category: "Ransomware (RaaS)", description: "Leak postings and victim lists from onion portal.", tracking: "Enrichment and cross-source validation.", url: "http://lynxblogco7r37jt7p5wrmfxzqze7ghxw6rihzkqc455qluacwotciyd.onion/", tags: ["Onion", "Validation"] },
  { name: "Vkvsgl7 (Tor)", category: "Ransomware (RaaS)", description: "Onion site for leak/victim publications.", tracking: "Actor/victim correlation and case building.", url: "http://vkvsgl7lhipjirmz6j5ubp3w3bwvxgcdbpi3fsbqngfynetqtw4w5hyd.onion/", tags: ["Onion", "Correlation"] },
  { name: "Mblogci (Tor)", category: "Ransomware (RaaS)", description: "Victim posts and leak evidence from onion portal.", tracking: "Enrichment and historical archives.", url: "http://mblogci3rudehaagbryjznltdp33ojwzkq6hn2pckvjq33rycmzczpid.onion/", tags: ["Onion", "Archives"] },
  { name: "Darklea (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and leak drops on Tor portal.", tracking: "Timely alerting and evidence capture.", url: "http://darkleakyqmv62eweqwy4dnhaijg4m4dkburo73pzuqfdumcntqdokyd.onion/", tags: ["Onion", "Alerting"] },
  { name: "Datalea (Tor)", category: "Ransomware (RaaS)", description: "Onion leak surface for victim posts and sample data.", tracking: "Enrichment and correlation.", url: "http://dataleakypypu7uwblm5kttv726l3iripago6p336xjnbstkjwrlnlid.onion/", tags: ["Onion", "Correlation"] },
  { name: "Mydatae (Tor)", category: "Ransomware (RaaS)", description: "Leak/victim postings from onion portal.", tracking: "Ongoing monitoring and evidence retention.", url: "http://mydatae2d63il5oaxxangwnid5loq2qmtsol2ozr6vtb7yfm5ypzo6id.onion/", tags: ["Onion", "Retention"] },
  { name: "Worldle (Tor)", category: "Ransomware (RaaS)", description: "Tor leak portal for victim posts and announcements.", tracking: "Enrichment and archival snapshots.", url: "http://worldleaksartrjm3c6vasllvgacbi5u3mgzkluehrzhk2jz4taufuid.onion/", tags: ["Onion", "Snapshots"] },
  { name: "Dcarryh (Tor)", category: "Ransomware (RaaS)", description: "Onion portal for leak publications and list changes.", tracking: "Early detection and evidence archiving.", url: "http://dcarryhaih5oldidg3tbqwnde4lxljytnpvberrwgj2vlvunopd46dad.onion/", tags: ["Onion", "Detection"] },
  { name: "Nerqnac (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and leak artifacts from onion portal.", tracking: "Enrichment and correlation.", url: "http://nerqnacjmdy3obvevyol7qhazkwkv57dwqvye5v46k5bcujtfa6sduad.onion/", tags: ["Onion", "Correlation"] },
  { name: "Xbkv2qe (Tor)", category: "Ransomware (RaaS)", description: "Victim posts and evidence on onion leak site.", tracking: "Alerting and maintaining history.", url: "http://xbkv2qey6u3gd3qxcojynrt4h5sgrhkar6whuo74wo63hijnn677jnyd.onion/", tags: ["Onion", "History"] },
  { name: "Yrz6bay (Tor)", category: "Ransomware (RaaS)", description: "Victim posts and leak samples from Tor portal.", tracking: "Enrichment and evidence retention.", url: "http://yrz6bayqwhleymbeviter7ejccxm64sv2ppgqgderzgdhutozcbbhpqd.onion/", tags: ["Onion", "Retention"] },
  { name: "Devmanb (Tor)", category: "Ransomware (RaaS)", description: "Onion leak surface for victim claims and updates.", tracking: "Cross-source validation and archiving.", url: "http://devmanblggk7ddrtqj3tsocnayow3bwnozab2s4yhv4shpv6ueitjzid.onion/", tags: ["Onion", "Validation"] },
  { name: "Nitrogen (Tor)", category: "Ransomware (RaaS)", description: "Victim pages and leak artifacts from onion portal.", tracking: "Continuous monitoring and evidence capture.", url: "http://nitrogenczslprh3xyw6lh5xyjvmsz7ciljoqxxknd7uymkfetfhgvqd.onion/", tags: ["Onion", "Capture"] },
  { name: "Yzcpwxu (Tor)", category: "Ransomware (RaaS)", description: "Onion portal for leak/victim publications.", tracking: "Alerting and timeline integrity.", url: "http://yzcpwxuhbkyjnyn4qsf4o5dkvu6m2fyo7dwizmnlutanlmzlos7pa6qd.onion/", tags: ["Onion", "Timeline"] },
  { name: "Direwol (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and leak announcements from Tor.", tracking: "Enrichment and archival snapshots.", url: "http://direwolfcdkv5whaz2spehizdg22jsuf5aeje4asmetpbt6ri4jnd4qd.onion/", tags: ["Onion", "Snapshots"] },
  { name: "Nleakk6 (Tor)", category: "Ransomware (RaaS)", description: "Onion leak surface for new posts and evidence.", tracking: "Alerting and case enrichment.", url: "http://nleakk6sejx45jxtk7x6iyt65hwvfrkifc5v7ertdlwm3gttbpvlvxqd.onion/", tags: ["Onion", "Enrichment"] },
  { name: "Z3wqggt (Tor)", category: "Ransomware (RaaS)", description: "Onion portal for victim publications and samples.", tracking: "Enrichment and correlation across sources.", url: "http://z3wqggtxft7id3ibr7srivv5gjof5fwg76slewnzwwakjuf3nlhukdid.onion/", tags: ["Onion", "Correlation"] },
  { name: "Dounczg (Tor)", category: "Ransomware (RaaS)", description: "Victim pages and leak evidence from onion site.", tracking: "Monitoring newly published disclosures.", url: "http://dounczge5jhw4iztnnpzp54kd4ot3tikhjsimurtcewqssgye6vvrhqd.onion/", tags: ["Onion", "Monitoring"] },
  { name: "Nsalewd (Tor)", category: "Ransomware (RaaS)", description: "Tor portal for victim claims and leak artifacts.", tracking: "Enrichment and evidence capture.", url: "http://nsalewdnfclsowcal6kn5csm4ryqmfpijznxwictukhrgvz2vbmjjjyd.onion/", tags: ["Onion", "Capture"] },
  { name: "Z6wkggh (Tor)", category: "Ransomware (RaaS)", description: "Leak/victim posts and updates on onion portal.", tracking: "Alerting and correlation.", url: "http://z6wkgghtoawog5noty5nxulmmt2zs7c3yvwr22v4czbffdoly2kl4uad.onion/", tags: ["Onion", "Correlation"] },
  { name: "Dragonf (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and leak samples from onion portal.", tracking: "Monitoring and case evidence retention.", url: "http://dragonforxxbp3awc7mzs5dkswrua3znqyx5roefmi4smjrsdi22xwqd.onion/", tags: ["Onion", "Retention"] },
  { name: "Obscura (Tor)", category: "Ransomware (RaaS)", description: "Tor leak surface for victim posts and evidence.", tracking: "Enrichment and correlation.", url: "http://obscurad3aphckihv7wptdxvdnl5emma6t3vikcf3c5oiiqndq6y6xad.onion/", tags: ["Onion", "Correlation"] },
  { name: "Zfytize (Tor)", category: "Ransomware (RaaS)", description: "Victim publications and leak evidence from onion site.", tracking: "Alerting and historical recordkeeping.", url: "http://zfytizegsze6uiswodhbaalyy5rawaytv2nzyzdkt3susbewviqqh7yd.onion/", tags: ["Onion", "Historical"] },
  { name: "Ebhmkoo (Tor)", category: "Ransomware (RaaS)", description: "Onion leak portal for new victims, samples, and edits.", tracking: "Enrichment and evidence retention.", url: "http://ebhmkoohccl45qesdbvrjqtyro2hmhkmh6vkyfyjjzfllm3ix72aqaid.onion/", tags: ["Onion", "Retention"] },
  { name: "Om6q4a6 (Tor)", category: "Ransomware (RaaS)", description: "Leak/victim announcements from onion portal.", tracking: "Correlation and case enrichment.", url: "http://om6q4a6cyipxvt7ioudxt24cw4oqu4yodmqzl25mqd2hgllymrgu4aqd.onion/", tags: ["Onion", "Correlation"] },
  { name: "Zktnif5 (Tor)", category: "Ransomware (RaaS)", description: "Victim pages and leak evidence from onion portal.", tracking: "Alerting and archiving.", url: "http://zktnif5vckhmz5tyrukp5bamatbfhkxjnb23rspsanyzywcrx3bvtqad.onion/", tags: ["Onion", "Archiving"] },
  { name: "Fjg4zi4 (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and artifacts from onion site.", tracking: "Enrichment and timeline tracking.", url: "http://fjg4zi4opkxkvdz7mvwp7h6goe4tcby3hhkrz43pht4j3vakhy75znyd.onion/", tags: ["Onion", "Timeline"] },
  { name: "Omegalo (Tor)", category: "Ransomware (RaaS)", description: "Victim posts and leak drops from onion portal.", tracking: "Early detection and evidence capture.", url: "http://omegalock5zxwbhswbisc42o2q2i54vdulyvtqqbudqousisjgc7j7yd.onion/", tags: ["Onion", "Detection"] },
  { name: "Zohlm7a (Tor)", category: "Ransomware (RaaS)", description: "Tor portal for victim publications and samples.", tracking: "Enrichment and cross-source correlation.", url: "http://zohlm7ahjwegcedoz7lrdrti7bvpofymcayotp744qhx6gjmxbuo2yid.onion/", tags: ["Onion", "Correlation"] },
  { name: "Flock4c (Tor)", category: "Ransomware (RaaS)", description: "Leak posts and victim pages from onion portal.", tracking: "Alerting and historical archiving.", url: "http://flock4cvoeqm4c62gyohvmncx6ck2e7ugvyqgyxqtrumklhd5ptwzpqd.onion/", tags: ["Onion", "Archiving"] },
  { name: "Orca66h (Tor)", category: "Ransomware (RaaS)", description: "Victim disclosures and leak evidence from onion portal.", tracking: "Continuous monitoring and case enrichment.", url: "http://orca66hwnpciepupe5626k2ib6dds6zizjwuuashz67usjps2wehz4id.onion/", tags: ["Onion", "Enrichment"] }
];

const ThreatActors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredActors = useMemo(() => {
    return actors.filter(actor => {
      const matchesSearch = actor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            actor.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory ? actor.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const categories = Array.from(new Set(actors.map(a => a.category)));

  return (
    <div className="py-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-12 border-b border-slate-200 dark:border-white/5 pb-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-500 text-[9px] font-bold uppercase tracking-[0.3em]">
            <Crosshair className="w-3 h-3" />
            Adversary Knowledge Base
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Threat Inventory.</h2>
          <p className="text-lg text-slate-500 dark:text-white/40 font-medium leading-relaxed">
            Full-spectrum tracking of {actors.length} unique ingestion points across RaaS groups, aggregators, and darknet repositories.
          </p>
        </div>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="FILTER BY NAME OR TAG..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-blue-600/40 w-full lg:w-64 transition-all placeholder:text-slate-400 dark:placeholder:text-white/10"
            />
          </div>
          <div className="px-5 py-3 bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 rounded-xl text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest whitespace-nowrap">
            Matched: {filteredActors.length} / {actors.length}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${!activeCategory ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
        >
          All Sources
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredActors.map((actor, idx) => (
          <div key={idx} className="bg-white dark:bg-[#0d0d0f] group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-600/40 dark:hover:border-blue-500/40 transition-all flex flex-col h-full hover:bg-slate-50 dark:hover:bg-[#111113] shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-5">
              <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                actor.category === 'Ransomware (RaaS)' ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-500' :
                actor.category === 'Intelligence Aggregator' ? 'bg-blue-600/10 border-blue-600/30 text-blue-600 dark:text-blue-500' :
                'bg-purple-600/10 border-purple-600/30 text-purple-600 dark:text-purple-500'
              }`}>
                {actor.category}
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/[0.03] text-slate-300 dark:text-white/10 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                {actor.category === 'Ransomware (RaaS)' ? <ShieldAlert className="w-4 h-4" /> : 
                 actor.category === 'Intelligence Aggregator' ? <Activity className="w-4 h-4" /> : 
                 <Ghost className="w-4 h-4" />}
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
              {actor.name}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-white/50 leading-relaxed mb-4 font-medium italic line-clamp-2">
              {actor.description}
            </p>

            <div className="space-y-3 mb-6 flex-grow">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 group-hover:bg-blue-600/[0.02] dark:group-hover:bg-blue-500/[0.02] transition-colors">
                <Info className="w-3.5 h-3.5 text-slate-400 dark:text-white/20 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 dark:text-white/40 leading-relaxed font-medium">
                  {actor.tracking}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {actor.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.03] text-[8px] font-mono text-slate-500 dark:text-white/20 uppercase tracking-tighter border border-slate-200 dark:border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <a 
              href={actor.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-auto flex items-center justify-between px-3 py-2.5 bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 group-hover:border-blue-600/20 dark:group-hover:border-blue-500/20 group-hover:bg-blue-600/5 dark:group-hover:bg-blue-500/5 transition-all overflow-hidden w-full"
            >
              <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                <Globe className="w-3 h-3 text-slate-400 dark:text-white/20 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors shrink-0" />
                <span className="text-[9px] font-mono text-slate-500 dark:text-white/20 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate block">
                  {actor.url.replace('http://', '').replace('https://', '')}
                </span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 dark:text-white/20 group-hover:text-blue-600 dark:group-hover:text-blue-500 shrink-0 ml-3" />
            </a>
          </div>
        ))}
      </div>

      {filteredActors.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
           <div className="p-6 rounded-full bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
              <Search className="w-12 h-12 text-slate-300 dark:text-white/10" />
           </div>
           <div className="space-y-2">
             <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest">No Adversaries Found</h4>
             <p className="text-slate-500 dark:text-white/30 text-sm max-w-sm">No entities match your filter or search criteria.</p>
           </div>
           <button 
             onClick={() => { setSearchTerm(''); setActiveCategory(null); }}
             className="px-8 py-3 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
           >
             Reset Filters
           </button>
        </div>
      )}
    </div>
  );
};

export default ThreatActors;
