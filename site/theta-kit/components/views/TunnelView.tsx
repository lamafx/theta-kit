// Généré depuis reference/Tunnel.dc.html. Les textes passent par t(), les valeurs par le moteur.
import { Fragment } from 'react';
import LangSwitch from '@/components/LangSwitch';
export default function TunnelView({ v, t }: { v: any; t: (k: string) => string }) {
  return (<>
<div className="tn-root" data-page="voyage" tabIndex={0} onWheel={v.onWheel} onKeyDown={v.onKey} onPointerDown={v.onDown} onPointerMove={v.onMove} onPointerUp={v.onUp} onPointerCancel={v.onUp} onPointerLeave={v.onLeave} aria-label={t('auto.voyage.t1')} style={{ position: 'relative', height: '100vh', minHeight: '560px', overflow: 'hidden', background: '#0A0F17', color: '#F5F8FC', fontFamily: 'var(--font-sans)', outline: 'none', touchAction: 'none', cursor: v.cursor }}><canvas data-tunnel="1" ref={v.setCanvas} aria-hidden="true" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }}></canvas>
<div aria-hidden="true" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', background: 'radial-gradient(120% 90% at 50% 50%, rgba(10,15,23,0) 50%, rgba(10,15,23,0.8) 100%)' }}></div>
{(v.chapters || []).map((c: any, i1: number) => (<Fragment key={i1}>
<section className="tn-chap" ref={c.ref} aria-label={c.label} style={{ position: 'absolute', left: '0', top: '0', width: 'min(460px, 84vw)', opacity: '0', visibility: 'hidden', transformOrigin: c.origin, willChange: 'transform, opacity', display: 'flex', flexDirection: 'column', gap: '18px', textAlign: c.align, alignItems: c.items }}><div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A97A8' }}><span style={{ color: '#4C8DFF' }}>{c.num}</span>
<span style={{ width: '28px', height: '1px', background: '#2E3B4D' }}></span>
<span >{c.group}</span>
</div>
<h2 style={{ margin: '0', fontSize: 'clamp(40px, 4.6vw, 68px)', lineHeight: '0.96', fontWeight: '500', letterSpacing: '-0.04em', color: '#F5F8FC' }}>{c.t1}<br  />
<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400', letterSpacing: '-0.015em', color: '#CFE0FF' }}>{c.t2}</span>
</h2>
<p style={{ margin: '0', maxWidth: '420px', fontSize: '18px', lineHeight: '1.55', color: '#A7B3C2' }}>{c.text}</p>
{c.hasFormula && (<>
<span className="tn-glass" style={{ display: 'inline-flex', padding: '8px 16px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#DCE3EC' }}>{c.formula}</span>
</>)}
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: c.items }}>{(c.links || []).map((l: any, i2: number) => (<Fragment key={i2}>
<a className="tn-btn" href={l.href} onClick={l.go} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minHeight: '50px', padding: '0 24px', borderRadius: '999px', border: `1px solid ${l.border}`, background: l.bg, color: l.color, fontSize: '15px', fontWeight: '600', textDecoration: 'none' }}>{l.label}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"></path>
</svg>
</a>
</Fragment>))}
{c.soon && (<>
<span style={{ display: 'inline-flex', alignItems: 'center', minHeight: '40px', padding: '0 16px', borderRadius: '999px', border: '1px dashed #2E3B4D', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A97A8' }}>{c.soonTxt}</span>
</>)}
</div>
</section>
</Fragment>))}
<header style={{ position: 'absolute', left: '0', right: '0', top: '0', zIndex: '5', padding: '22px clamp(18px, 3vw, 40px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', pointerEvents: 'none' }}><a href={v.href.accueil} onClick={v.goMain} style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#F5F8FC' }}><svg viewBox="-330 -470 660 940" width="20" height="29" aria-hidden="true"><g transform="skewX(-12)"><path fillRule="evenodd" d="M-270 0 a270 420 0 1 0 540 0 a270 420 0 1 0 -540 0 Z M-176 0 a176 368 0 1 0 352 0 a176 368 0 1 0 -352 0 Z" fill="#F5F8FC"></path>
<rect x="-178" y="-26" width="356" height="52" fill="#4C8DFF"></rect>
</g>
</svg>
<span style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '30px' }}>Théta</span>
<span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8A97A8', marginTop: '4px' }}>{t('auto.voyage.t2')}</span>
</span>
<span style={{ marginLeft: '6px', width: '38px', height: '38px', borderRadius: '999px', overflow: 'hidden', background: '#1C46C9', border: '1px solid rgba(207,224,255,0.25)' }}><img src="/img/llk-cutout.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
</span>
</a>
<div className="tn-glass" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '6px', padding: '5px', borderRadius: '999px' }}><LangSwitch sombre />
<a className="tn-btn" href={v.href.labo} onClick={v.goLabAny} style={{ display: 'inline-flex', alignItems: 'center', minHeight: '40px', padding: '0 18px', borderRadius: '999px', background: '#F5F8FC', color: '#0A0F17', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>{t('nav.labo')}</a>
<a className="tn-btn" href={v.href.accueil} onClick={v.goMain} style={{ display: 'inline-flex', alignItems: 'center', minHeight: '40px', padding: '0 18px', borderRadius: '999px', color: '#F5F8FC', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>{t('auto.voyage.t3')}</a>
</div>
</header>
<nav className="tn-chapitres" aria-label={t('auto.voyage.t4')} style={{ position: 'absolute', right: 'clamp(14px, 2.6vw, 40px)', top: '50%', transform: 'translateY(-50%)', zIndex: '5', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>{(v.navItems || []).map((n: any, i3: number) => (<Fragment key={i3}>
<button type="button" className="tn-nav" onClick={n.go} aria-current={n.current} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', minHeight: '40px', padding: '0 2px 0 12px', border: '0', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: n.weight, color: n.color }}><span >{n.label}</span>
<span style={{ width: n.dot, height: n.dot, borderRadius: '999px', background: n.dotColor, boxShadow: n.glow, transition: 'all .35s ease' }}></span>
</button>
</Fragment>))}
</nav>
<div className="tn-bas" style={{ position: 'absolute', left: 'clamp(18px, 3vw, 40px)', bottom: '26px', zIndex: '5', display: 'flex', flexDirection: 'column', gap: '10px', width: 'min(280px, 50vw)', pointerEvents: 'none' }}><div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', fontFamily: 'var(--font-mono)' }}><span style={{ fontSize: '26px', fontWeight: '500', color: '#F5F8FC' }}>{v.curLabel}</span>
<span style={{ fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A97A8' }}>{v.curName}</span>
</div>
<div style={{ height: '2px', background: '#1E2938', borderRadius: '2px', overflow: 'hidden' }}><div ref={v.setBar} style={{ width: '100%', height: '2px', background: '#4C8DFF', transformOrigin: 'left center', transform: 'scaleX(0)' }}></div>
</div>
<span className="tn-aide" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7A8C' }}>{v.aide}</span>
</div>
{v.atStart && (<>
<div className="tn-defiler" style={{ position: 'absolute', left: '50%', bottom: '26px', transform: 'translateX(-50%)', zIndex: '5', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', pointerEvents: 'none' }}><span className="tn-bob" style={{ width: '24px', height: '38px', borderRadius: '14px', border: '1.5px solid #8A97A8', display: 'flex', justifyContent: 'center', paddingTop: '7px', boxSizing: 'border-box' }}><span style={{ width: '3px', height: '8px', borderRadius: '3px', background: '#F5F8FC' }}></span>
</span>
<span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A7B3C2' }}>{t('auto.voyage.t5')}</span>
</div>
</>)}
{v.offre && (<div className="tn-offre" role="status">
<span>{v.offre.texte}</span>
<a href={v.offre.href} onClick={v.offre.oui}>{v.offre.label}</a>
<button type="button" onClick={v.offre.non}>{v.nonTxt}</button>
</div>)}
<div className="tn-tact">
<span>{t('voyage.aide_tactile')}</span>
<button type="button" onClick={v.goPrev} aria-label={t('commun.precedent')}>‹</button>
<button type="button" onClick={v.goNext} aria-label={t('commun.suivant')}>›</button>
</div>
<div ref={v.setCursor} className="tn-cursor" aria-hidden="true" style={{ position: 'absolute', left: '0', top: '0', zIndex: '30', width: '34px', height: '34px', margin: '-17px 0 0 -17px', borderRadius: '999px', border: '1.5px solid rgba(207,224,255,0.55)', pointerEvents: 'none', opacity: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ position: 'absolute', left: '100%', top: '50%', transform: 'translate(12px, -50%)', whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '999px', background: '#F5F8FC', color: '#0A0F17', fontSize: '13px', fontWeight: '600', opacity: v.cursorLabelOp, transition: 'opacity .25s ease' }}>{v.cursorLabel}</span>
</div>
<div ref={v.setIris} aria-hidden="true" style={{ position: 'absolute', inset: '0', zIndex: '40', pointerEvents: 'none', clipPath: 'circle(0px at 50% 50%)', background: 'radial-gradient(70% 70% at 50% 50%, #13223F 0%, #0A0F17 72%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg viewBox="-330 -470 660 940" width="70" height="100" aria-hidden="true" style={{ opacity: v.exitOp, transition: 'opacity .5s ease .35s' }}><g transform="skewX(-12)" fill="none" stroke="#9CC6FF" strokeWidth="18"><path fillRule="evenodd" d="M-270 0 a270 420 0 1 0 540 0 a270 420 0 1 0 -540 0 Z"></path>
<path d="M-250 0 H250"></path>
</g>
</svg>
</div>
{v.arrive && (<>
<div className="tn-arrive" aria-hidden="true" style={{ position: 'absolute', inset: '0', zIndex: '41', pointerEvents: 'none', background: 'radial-gradient(60% 60% at 50% 46%, #F5F8FC 0%, #4C8DFF 30%, #0A0F17 80%)' }}></div>
</>)}
</div>

  </>);
}
