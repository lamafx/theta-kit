// Généré depuis reference/Profil.dc.html. Les textes passent par t(), les valeurs par le moteur.
import { Fragment } from 'react';
import Footer from '@/components/Footer';
import LangSwitch from '@/components/LangSwitch';
export default function ProfilView({ v, t }: { v: any; t: (k: string) => string }) {
  return (<>
<div className="pf"><header style={{ position: 'absolute', left: '0', right: '0', top: '0', zIndex: '10' }}><div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '26px', paddingBottom: '26px' }}><a href={v.href.accueil} onClick={v.goHome} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#F5F8FC' }}><svg viewBox="-330 -470 660 940" width="18" height="26" aria-hidden="true"><g transform="skewX(-12)"><path fillRule="evenodd" d="M-270 0 a270 420 0 1 0 540 0 a270 420 0 1 0 -540 0 Z M-176 0 a176 368 0 1 0 352 0 a176 368 0 1 0 -352 0 Z" fill="#F5F8FC"></path>
<rect x="-178" y="-26" width="356" height="52" fill="#4C8DFF"></rect>
</g>
</svg>
<span className="serif" style={{ fontSize: '28px', lineHeight: '1' }}>Théta</span>
</a>
<nav aria-label={t('auto.profil.t1')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LangSwitch sombre />
<a className="nav-a" href={v.href.accueil} onClick={v.goHome} style={{ color: '#CFE0FF' }}>{t('profil.retour')}</a>
<a className="nav-a" href="mailto:lamkam760@gmail.com" style={{ background: '#F5F8FC', color: '#0A0F17', fontWeight: '600' }}>{t('profil.contact')}</a>
</nav>
</div>
</header>
<section id="top" ref={v.setCover} aria-label={t('auto.profil.t2')} className="cv" style={{ height: v.coverH }}><canvas ref={v.setCv3d} className="cv-3d" aria-hidden="true"></canvas>
<h1 className="sr">{t('auto.profil.t3')}</h1>
<div className="cv-eb mono in-rise" style={{ animationDelay: v.d0 }}><span style={{ width: '40px', height: '1px', background: '#4C8DFF' }}></span>
{t('profil.episode')}</div>
<div className="cv-name px" style={{ ['--d' as any]: '-18' }} aria-hidden="true"><span className="in-mask" style={{ animationDelay: v.d1, display: 'inline-block' }}>Ladji Lama</span>
</div>
<svg ref={v.setCvSvg} className="cv-theta" viewBox="-330 -470 660 940" aria-hidden="true"><defs ><filter id="pf-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"></feGaussianBlur>
</filter>
</defs>
<g transform="skewX(-12)" fill="none"><g className="th-glow" stroke="#4C8DFF" strokeWidth="22" filter="url(#pf-blur)"><ellipse rx="270" ry="420"></ellipse>
<ellipse rx="176" ry="368"></ellipse>
<path d="M-176 -26 H176 M-176 26 H176"></path>
</g>
<g stroke="#F5F8FC" strokeWidth="4" strokeLinecap="round"><ellipse className="th-line" pathLength={1} rx="270" ry="420"></ellipse>
<ellipse className="th-line" pathLength={1} rx="176" ry="368" style={{ animationDelay: '.5s' }}></ellipse>
<path className="th-line" pathLength={1} d="M-176 -26 H176" style={{ animationDelay: '1s' }}></path>
<path className="th-line" pathLength={1} d="M-176 26 H176" style={{ animationDelay: '1.15s' }}></path>
</g>
</g>
</svg>
<div className="cv-ph px" style={{ ['--d' as any]: '10' }}><img className="pf-photo cv-photo" src="/img/llk-cutout.webp" alt={t('auto.profil.t4')} />
</div>
<div className="cv-fade" aria-hidden="true"></div>
<div className="cv-last serif px" style={{ ['--d' as any]: '30' }} aria-hidden="true"><span className="in-mask" style={{ animationDelay: v.d2, display: 'inline-block' }}>Kamagate</span>
</div>
<div className="cv-info in-rise" style={{ animationDelay: v.d3 }}><p style={{ margin: '0', fontSize: 'clamp(16px, 1.3vw, 19px)', lineHeight: '1.5', color: '#CFE0FF' }}>{t('auto.profil.t5')}</p>
<div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px 18px', fontSize: '14px', color: '#F5F8FC' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}><span style={{ width: '8px', height: '8px', borderRadius: '9px', background: '#4C8DFF', boxShadow: '0 0 0 5px rgba(76,141,255,.2)' }}></span>
{t('auto.profil.t6')}</span>
<span style={{ color: '#8A97A8' }}>{t('auto.profil.t7')}</span>
</div>
</div>
<a href="#episode" onClick={v.toStory} className="cv-down mono" aria-label={t('auto.profil.t8')}><span className="pf-bob" style={{ width: '24px', height: '38px', borderRadius: '14px', border: '1.5px solid #8A97A8', display: 'flex', justifyContent: 'center', paddingTop: '7px', boxSizing: 'border-box' }}><span style={{ width: '3px', height: '8px', borderRadius: '3px', background: '#F5F8FC' }}></span>
</span>
<span style={{ fontSize: '11px' }}>{t('profil.lire')}</span>
</a>
</section>
<div className="tk tk-blue" aria-hidden="true"><div className="tk-in"><span >Machine Learning</span>
<b >✦</b>
<span >API REST</span>
<b >✦</b>
<span >Computer Vision</span>
<b >✦</b>
<span >IoT</span>
<b >✦</b>
<span >Abidjan</span>
<b >✦</b>
<span >{t('auto.profil.t9')}</span>
<b >✦</b>
<span >θ Théta</span>
<b >✦</b>
<span >Machine Learning</span>
<b >✦</b>
<span >API REST</span>
<b >✦</b>
<span >Computer Vision</span>
<b >✦</b>
<span >IoT</span>
<b >✦</b>
<span >Abidjan</span>
<b >✦</b>
<span >{t('auto.profil.t9')}</span>
<b >✦</b>
<span >θ Théta</span>
<b >✦</b>
</div>
</div>
<section id="episode" style={{ background: '#F5F8FC', color: '#0A0F17' }}><div className="wrap" style={{ paddingTop: '140px', paddingBottom: '120px' }}><div data-rv="1" className="mono" style={{ fontSize: '12px', color: '#1C46C9', marginBottom: '30px' }}>{t('profil.en_une_phrase')}</div>
<p data-rv="1" style={{ margin: '0', maxWidth: '1050px', fontSize: 'clamp(34px, 4.4vw, 68px)', lineHeight: '1.08', fontWeight: '500', letterSpacing: '-0.04em' }}>{t('auto.profil.t10')}{' '}<span className="serif" style={{ color: '#1C46C9', letterSpacing: '-0.015em' }}>{t('hero.titre_3')}</span>
</p>
<p data-rv="1" style={{ margin: '34px 0 0', maxWidth: '640px', fontSize: '19px', lineHeight: '1.6', color: '#4A5768' }}>{t('auto.profil.t11')}</p>
<div className="st-row">{(v.p.compteurs || []).map((st: any, i1: number) => (<Fragment key={i1}>
<div className="st" data-rv="1"><b ><span data-count={st.valeur}>0</span>
<sup >{st.sup}</sup>
</b>
<span >{st.label}</span>
</div>
</Fragment>))}
</div>
</div>
</section>
<section aria-label={t('auto.profil.t12')} style={{ background: '#F5F8FC', color: '#0A0F17' }}><div className="wrap" style={{ paddingBottom: '140px' }}><div data-rv="1" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', marginBottom: '34px' }}><h2 style={{ margin: '0', fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: '0.98', fontWeight: '500', letterSpacing: '-0.045em' }}>{t('auto.profil.t13')}<br  />
<span className="serif" style={{ color: '#1C46C9' }}>{t('auto.profil.t14')}</span>
</h2>
<div className="pf-filt" role="group" aria-label={t('auto.profil.t15')}>{(v.filters || []).map((f: any, i2: number) => (<Fragment key={i2}>
<button type="button" className="pf-chip" aria-pressed={f.sel} onClick={f.pick}>{f.label}{' '}<span >{f.n}</span>
</button>
</Fragment>))}
</div>
</div>
<div className="pj-list">{(v.projects || []).map((j: any, i3: number) => (<Fragment key={i3}>
<article className="pj2" data-open={j.open}><button type="button" className="pj2-head" onClick={j.toggle} aria-expanded={j.open}><span className="pj2-n">{j.n}</span>
<span className="pj2-t"><span className="pj2-k">{t('auto.profil.t16')}{' '}{j.i}{' '}/ 3 ·{' '}{j.date}</span>
<span className="pj2-h">{j.title}</span>
</span>
<span className="pj2-res">{j.res}</span>
<span className="pj2-arr" aria-hidden="true">↓</span>
</button>
{j.isOpen && (<>
<div className="pj2-body"><p >{j.desc}</p>
<ul >{(j.bullets || []).map((bu: any, i4: number) => (<Fragment key={i4}>
<li >{bu.t}</li>
</Fragment>))}
</ul>
<div className="pj2-meta"><span className="pj2-lab">{t('auto.profil.t17')}</span>
<span >{j.notion}</span>
</div>
<div className="pj2-stack">{(j.tools || []).map((to: any, i5: number) => (<Fragment key={i5}>
<span >{to.t}</span>
</Fragment>))}
</div>
</div>
</>)}
</article>
</Fragment>))}
</div>
</div>
</section>
<section id="preuves" aria-label={t('profil.preuves_titre')} className="cz"><div className="wrap" style={{ paddingTop: '130px', paddingBottom: '120px' }}><div className="cz-head" data-rv="1"><div ><div className="mono" style={{ fontSize: '12px', color: '#4C8DFF', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '14px' }}><span style={{ width: '36px', height: '1px', background: '#4C8DFF' }}></span>
{t('auto.profil.t18')}</div>
<h2 style={{ margin: '0', fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: '0.98', fontWeight: '500', letterSpacing: '-0.045em' }}>{t('profil.preuves_filtres.cert')}<br  />
<span className="serif" style={{ color: '#CFE0FF' }}>{t('auto.profil.t19')}</span>
</h2>
</div>
<div className="cz-count"><div ><b >{v.czNCert}</b>
<span >{t('auto.profil.t20')}{v.czSCert}</span>
</div>
<div ><b >{v.czNPrix}</b>
<span >{t('auto.profil.t21')}{v.czSPrix}</span>
</div>
</div>
</div>
<div className="cz-bar" data-rv="1"><div className="cz-filt" role="group" aria-label={t('auto.profil.t22')}>{(v.czFilters || []).map((f: any, i6: number) => (<Fragment key={i6}>
<button type="button" className="cz-chip" aria-pressed={f.sel} onClick={f.pick}>{f.label}{' '}<span >{f.n}</span>
</button>
</Fragment>))}
</div>
<div className="cz-nav"><button type="button" className="cz-arrow" onClick={v.czPrev} aria-label={t('carrousels.precedent')}>←</button>
<button type="button" className="cz-arrow" onClick={v.czNext} aria-label={t('carrousels.suivant')}>→</button>
</div>
</div>
<div className="cz-rail" ref={v.setRail} onScroll={v.czScroll}>{(v.czItems || []).map((c: any, i7: number) => (<Fragment key={i7}>
<article className="cz-card" style={{ animationDelay: c.delay }}><button type="button" className={`cz-frame ${c.kind}`} onPointerMove={v.tilt} onPointerLeave={v.untilt} onClick={c.open} aria-label={c.aria}><span className="cz-glare" aria-hidden="true"></span>
{c.isImg && (<>
<span className="cz-paper"><img src={c.url} alt="" loading="lazy" />
</span>
</>)}
{c.isPdf && (<>
<span className="cz-paper cz-pdf"><span className="cz-pdf-tag">PDF</span>
<span className="cz-pdf-k">{t('auto.profil.t23')}</span>
<span className="cz-pdf-t">{c.title}</span>
<span className="cz-pdf-i">{c.issuer}</span>
<span className="cz-seal" aria-hidden="true">θ</span>
</span>
</>)}
{c.isPlate && (<>
<span className="cz-plate"><span className="cz-rank">{c.rank}</span>
<span className="cz-plate-t">{c.event}</span>
<span className="cz-plate-d">{c.date}</span>
<span className="cz-laurel" aria-hidden="true"></span>
</span>
</>)}
<span className="cz-badge">{c.badge}</span>
</button>
<div className="cz-meta"><span className="cz-issuer">{c.issuer}{' '}·{' '}{c.date}</span>
<h3 >{c.title}</h3>
<div className="cz-skills">{(c.skills || []).map((k: any, i8: number) => (<Fragment key={i8}>
<span >{k.t}</span>
</Fragment>))}
</div>
</div>
</article>
</Fragment>))}
</div>
<div className="cz-prog" aria-hidden="true"><span ref={v.setProg}></span>
</div>
</div>
</section>
{v.lbOpen && (<>
<div className="lb2" onClick={v.lbBack}><div className="lb2-card" role="dialog" aria-modal="true" aria-label={v.lbTitle}><button type="button" className="lb2-x" onClick={v.lbClose} aria-label={t('nav.fermer')}>×</button>
<div className="lb2-view">{v.lbImg && (<>
<img src={v.lbUrl} alt={v.lbTitle} />
</>)}
{v.lbPdf && (<>
<iframe src={v.lbUrl} title={v.lbTitle}></iframe>
</>)}
{v.lbPlate && (<>
<div className="cz-plate lb2-plate"><span className="cz-rank">{v.lbRank}</span>
<span className="cz-plate-t">{v.lbEvent}</span>
<span className="cz-plate-d">{v.lbDate}</span>
<span className="cz-laurel" aria-hidden="true"></span>
</div>
</>)}
</div>
<div className="lb2-side"><span className="cz-issuer">{v.lbKind}{' '}·{' '}{v.lbIssuer}</span>
<h3 >{v.lbTitle}</h3>
<span className="lb2-date">{v.lbDate}</span>
<p >{v.lbDesc}</p>
<div className="cz-skills">{(v.lbSkills || []).map((k: any, i9: number) => (<Fragment key={i9}>
<span >{k.t}</span>
</Fragment>))}
</div>
<div className="lb2-acts">{v.lbHasUrl && (<>
<a className="lb2-btn" href={v.lbFile} target="_blank" rel="noopener">{t('auto.profil.t24')}</a>
</>)}
</div>
<div className="lb2-nav"><button type="button" className="cz-arrow" onClick={v.lbPrev} aria-label={t('carrousels.precedent')}>←</button>
<span >{v.lbPos}</span>
<button type="button" className="cz-arrow" onClick={v.lbNext} aria-label={t('carrousels.suivant')}>→</button>
</div>
</div>
</div>
</div>
</>)}
<section aria-label={t('profil.parcours_titre')} style={{ background: '#0A0F17', color: '#F5F8FC' }}><div className="wrap" style={{ paddingTop: '130px', paddingBottom: '130px', display: 'flex', flexWrap: 'wrap', gap: '60px' }}><div data-rv="1" style={{ flex: '0 1 360px', minWidth: '0' }}><div className="mono" style={{ fontSize: '12px', color: '#4C8DFF', marginBottom: '24px' }}>{t('auto.profil.t25')}</div>
<h2 style={{ margin: '0', fontSize: 'clamp(40px, 4.6vw, 68px)', lineHeight: '0.98', fontWeight: '500', letterSpacing: '-0.045em' }}>{t('auto.profil.t26')}<br  />
<span className="serif" style={{ color: '#CFE0FF' }}>{t('auto.profil.t27')}</span>
</h2>
<p style={{ margin: '22px 0 0', fontSize: '17px', lineHeight: '1.6', color: '#A7B3C2' }}>{t('auto.profil.t28')}</p>
</div>
<ol ref={v.setTl} className="tl" style={{ flex: '1 1 560px', minWidth: '0', margin: '0', padding: '0 0 0 28px' }}>{(v.p.parcours || []).map((e: any, i10: number) => (<Fragment key={i10}>
<li data-rv="1" className={e.cls}><div className="tl-y">{e.annee}</div>
<div ><div className="tl-t">{e.t}</div>
<div className="tl-d">{e.d}</div>
</div>
</li>
</Fragment>))}
</ol>
</div>
</section>
<section aria-label={t('auto.profil.t29')} style={{ background: '#F5F8FC', color: '#0A0F17' }}><div className="wrap" style={{ paddingTop: '130px', paddingBottom: '130px' }}><h2 data-rv="1" style={{ margin: '0 0 50px', fontSize: 'clamp(40px, 4.6vw, 68px)', lineHeight: '0.98', fontWeight: '500', letterSpacing: '-0.045em' }}>{t('auto.profil.t30')}{' '}<span className="serif" style={{ color: '#1C46C9' }}>{t('auto.profil.t31')}</span>
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '36px' }}>{(v.p.outils || []).map((o: any, i11: number) => (<Fragment key={i11}>
<div className="tool" data-rv="1"><h4 >{o.t}</h4>
<p >{o.d}</p>
<div className="tchips">{(o.chips || []).map((ch: any, i12: number) => (<Fragment key={i12}>
<span >{ch.t}{' '}{ch.n && (<>
<i >{ch.n}</i>
</>)}
</span>
</Fragment>))}
</div>
</div>
</Fragment>))}
</div>
</div>
</section>
<div className="tk tk-dark" aria-hidden="true"><div className="tk-in"><span >{t('profil.disponible')}</span>
<b >✦</b>
<span >{t('profil.contact')}</span>
<b >✦</b>
<span >{t('auto.profil.t32')}</span>
<b >✦</b>
<span >{t('profil.disponible')}</span>
<b >✦</b>
<span >{t('profil.contact')}</span>
<b >✦</b>
<span >{t('auto.profil.t32')}</span>
<b >✦</b>
</div>
</div>
<section aria-label={t('auto.profil.t33')} style={{ background: '#F5F8FC', color: '#F5F8FC' }}><div className="wrap" style={{ paddingBottom: '120px' }}><div data-rv="1" style={{ position: 'relative', overflow: 'hidden', borderRadius: '36px', background: 'radial-gradient(90% 120% at 85% 0%, #1C46C9 0%, #1C46C9 42%, #102C86 100%)', padding: 'clamp(40px, 6vw, 84px)' }}><svg viewBox="-330 -470 660 940" aria-hidden="true" style={{ position: 'absolute', right: '-4%', top: '-30%', height: '160%', opacity: '0.12' }}><g transform="skewX(-12)" fill="none" stroke="#FFFFFF" strokeWidth="8"><ellipse rx="270" ry="420"></ellipse>
<ellipse rx="176" ry="368"></ellipse>
<path d="M-176 -26 H176 M-176 26 H176"></path>
</g>
</svg>
<div style={{ position: 'relative', maxWidth: '760px' }}><div className="mono" style={{ fontSize: '12px', color: '#CFE0FF', marginBottom: '22px' }}>{t('profil.fin')}</div>
<h2 style={{ margin: '0', fontSize: 'clamp(42px, 5.4vw, 84px)', lineHeight: '0.96', fontWeight: '500', letterSpacing: '-0.05em' }}>{t('auto.profil.t34')}<br  />
<span className="serif" style={{ color: '#CFE0FF' }}>{t('auto.profil.t35')}</span>
</h2>
<div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}><a className="cta" href="mailto:lamkam760@gmail.com?subject=Stage%20en%20Machine%20Learning" style={{ background: '#F5F8FC', color: '#0A0F17', fontWeight: '600' }}>{t('auto.profil.t32')}</a>
{v.cv && (<>
<a className="cta" href={v.cv} download="CV-Ladji-Lama-Kamagate.pdf" target="_blank" rel="noopener" style={{ border: '1px solid rgba(255,255,255,.4)', color: '#FFFFFF' }}>{t('profil.cv')}</a>
</>)}
<a className="cta" href="https://www.linkedin.com/in/kamagate-ladji-lama-02a18429b" target="_blank" rel="noopener" style={{ border: '1px solid rgba(255,255,255,.4)', color: '#FFFFFF' }}>LinkedIn ↗</a>
<a className="cta" href="https://github.com/lamafx" target="_blank" rel="noopener" style={{ border: '1px solid rgba(255,255,255,.4)', color: '#FFFFFF' }}>GitHub ↗</a>
</div>
</div>
</div>
</div>
</section>
<Footer />
<div ref={v.setIris} aria-hidden="true" style={{ position: 'fixed', inset: '0', zIndex: '200', pointerEvents: 'none', clipPath: 'circle(0px at 50% 50%)', background: 'radial-gradient(70% 70% at 50% 50%, #13223F 0%, #0A0F17 72%)' }}></div>
</div>

  </>);
}
