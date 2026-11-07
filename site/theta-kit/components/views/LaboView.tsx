// Généré depuis reference/Labo.dc.html. Les textes passent par t(), les valeurs par le moteur.
import { Fragment } from 'react';
import LaboMenu from '@/components/LaboMenu';
import LangSwitch from '@/components/LangSwitch';
export default function LaboView({ v, t }: { v: any; t: (k: string) => string }) {
  return (<>
<div data-page="labo" style={{ position: 'relative', minHeight: '100vh', background: '#0A0F17', color: '#F5F8FC', fontFamily: 'var(--font-sans)' }}><div className="lb-stage"><div className="lb-canvas" onPointerDown={v.onDown} onPointerMove={v.onMove} onPointerUp={v.onUp} onPointerCancel={v.onUp} style={{ background: 'radial-gradient(75% 70% at 55% 48%, #13223F 0%, #0A0F17 55%, #0A0F17 100%)', touchAction: 'none', cursor: v.cursor, userSelect: 'none' }}><canvas data-lab3d="1" ref={v.setCanvas} role="img" aria-label={v.sceneLabel} style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }}></canvas>
{v.noGL && (<>
<div className="lb-nogl" style={{ position: 'absolute', inset: '0', zIndex: '2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', fontSize: '15px', lineHeight: '1.55', color: '#CFE0FF' }}>{t('auto.labo.t1')}</div>
</>)}
{!!v.indice && <div className="lb-indice" aria-hidden="true">{v.indice}</div>}
{v.notReady && (<>
<div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A97A8' }}>{t('auto.labo.t2')}</div>
</>)}
{v.flash && (<>
<div className="lb-toast" role="status" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: '5', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 22px 14px 14px', borderRadius: '999px', background: '#F5F8FC', color: '#0A0F17', pointerEvents: 'none' }}><span style={{ width: '34px', height: '34px', borderRadius: '999px', background: '#0A0F17', color: '#F5F8FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"></path>
</svg>
</span>
<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '24px', lineHeight: '1' }}>{t('auto.labo.t3')}</span>
<span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#4A5768' }}>{v.score}/{v.nbThemes}</span>
</div>
</>)}
</div>
<header className="lb-top"><a href={v.href.accueil} onClick={v.goMain} style={{ display: 'flex', alignItems: 'baseline', gap: '10px', textDecoration: 'none', color: '#F5F8FC' }}><svg viewBox="-330 -470 660 940" width="17" height="24" aria-hidden="true" style={{ alignSelf: 'center' }}><g transform="skewX(-12)"><path fillRule="evenodd" d="M-270 0 a270 420 0 1 0 540 0 a270 420 0 1 0 -540 0 Z M-176 0 a176 368 0 1 0 352 0 a176 368 0 1 0 -352 0 Z" fill="#F5F8FC"></path>
<rect x="-178" y="-26" width="356" height="52" fill="#4C8DFF"></rect>
</g>
</svg>
<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '26px', lineHeight: '1' }}>Théta</span>
<span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A97A8' }}>Labo</span>
</a>
<LaboMenu v={v} t={t} />
<div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}><LangSwitch sombre />
<span className="lb-defis" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A97A8' }}>{t('auto.labo.t6')}{' '}<strong style={{ color: '#F5F8FC', fontWeight: '500' }}>{v.score}/{v.nbThemes}</strong>
</span>
<a className="lb-ic" href={v.href.voyage} onClick={v.goVoyage} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: '44px', padding: '0 18px', borderRadius: '999px', border: '1px solid rgba(207,224,255,0.16)', color: '#F5F8FC', fontSize: '14px', textDecoration: 'none' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"></path>
</svg>
{t('auto.labo.t7')}</a>
</div>
</header>
<div className="lb-stat" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.04em', color: '#A7B3C2' }}>{v.statLine}</div>
<section className="lb-card lb-glass lb-scroll" style={{ borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}><div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A97A8' }}><span style={{ color: '#4C8DFF' }}>Nº{' '}{v.num}</span>
{' '}·{' '}{v.sub}</div>
<h1 style={{ margin: '0', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400', fontSize: '40px', lineHeight: '1', letterSpacing: '-0.01em' }}>{v.title}</h1>
<p style={{ margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#A7B3C2' }}>{v.idea}</p>
<div style={{ height: '1px', background: 'rgba(207,224,255,0.08)' }}></div>
<p aria-live="polite" style={{ margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#DCE3EC' }}>{v.msg}</p>
<details style={{ borderTop: '1px solid rgba(207,224,255,0.08)', paddingTop: '12px' }}><summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '32px', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#CFE0FF' }}>{t('auto.labo.t8')}<svg className="lb-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path>
</svg>
</summary>
<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px' }}><div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{(v.calc || []).map((c: any, i2: number) => (<Fragment key={i2}>
<div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', lineHeight: '1.6', color: '#C9D4E3', overflowWrap: 'anywhere' }}>{c.t}</div>
</Fragment>))}
</div>
<svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '14px', background: 'rgba(10,15,23,0.6)' }} role="img" aria-label={v.chartTitle}><defs ><marker id="lb-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#F5F8FC"></path>
</marker>
</defs>
{(v.chartLines || []).map((l: any, i3: number) => (<Fragment key={i3}>
<path d={l.d} fill="none" stroke={l.s} strokeWidth={l.w} strokeDasharray={l.dash} markerEnd={l.m} strokeLinecap="round" strokeLinejoin="round" opacity={l.o}></path>
</Fragment>))}
{(v.chartDots || []).map((c: any, i4: number) => (<Fragment key={i4}>
<circle cx={c.x} cy={c.y} r={c.r} fill={c.f}></circle>
</Fragment>))}
{(v.chartTexts || []).map((x: any, i5: number) => (<Fragment key={i5}>
<text x={x.x} y={x.y} fill={x.f} fontSize="11" fontFamily="Geist Mono, monospace" textAnchor={x.a}>{x.t}</text>
</Fragment>))}
</svg>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>{(v.legend || []).map((l: any, i6: number) => (<Fragment key={i6}>
<span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#A7B3C2' }}><span style={{ width: '14px', height: '2px', borderRadius: '2px', background: l.c }}></span>
{l.t}</span>
</Fragment>))}
</div>
</div>
</details>
<div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(207,224,255,0.08)' }}><span style={{ flexShrink: '0', marginTop: '6px', width: '7px', height: '7px', borderRadius: '999px', background: v.statusDot, boxShadow: v.statusGlow }}></span>
<span style={{ fontSize: '13px', lineHeight: '1.5', color: '#A7B3C2' }}><span style={{ color: '#F5F8FC' }}>{t('auto.labo.t9')}</span>
{' '}{v.goal}{' '}<span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: v.statusColor }}>{v.statusTxt}</span>
</span>
</div>
</section>
<div className="lb-dock lb-glass" style={{ borderRadius: '999px', padding: '8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>{v.hasPlay && (<>
<button type="button" className="lb-ic" onClick={v.togglePlay} aria-label={v.playLabel} style={{ width: '48px', height: '48px', border: '0', borderRadius: '999px', background: '#F5F8FC', color: '#0A0F17', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{v.playing && (<>
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"></rect>
<rect x="14" y="5" width="4" height="14" rx="1"></rect>
</svg>
</>)}
{v.notPlaying && (<>
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"></path>
</svg>
</>)}
</button>
<button type="button" className="lb-ic" onClick={v.doStep} aria-label={t('auto.labo.t10')} style={{ width: '48px', height: '48px', border: '1px solid rgba(207,224,255,0.14)', borderRadius: '999px', background: 'transparent', color: '#F5F8FC', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 5l8 7-8 7"></path>
<path d="M18 5v14"></path>
</svg>
</button>
</>)}
<button type="button" className="lb-ic" onClick={v.doReset} aria-label={t('auto.labo.t11')} style={{ width: '48px', height: '48px', border: '1px solid rgba(207,224,255,0.14)', borderRadius: '999px', background: 'transparent', color: '#F5F8FC', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path>
<path d="M3 4v5h5"></path>
</svg>
</button>
{v.hasSlider && (<>
<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0', width: '210px', padding: '0 14px' }}><label htmlFor="lb-sl" style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', color: '#8A97A8' }}><span >{v.slLabel}</span>
<span style={{ color: '#F5F8FC' }}>{v.slTxt}</span>
</label>
<input id="lb-sl" type="range" min={v.slMin} max={v.slMax} step={v.slStep} value={v.slVal} onChange={v.slChange} />
</div>
</>)}
{v.hasBatch && (<>
<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '150px', padding: '0 14px 0 0' }}><label htmlFor="lb-batch" style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', color: '#8A97A8' }}><span>{v.b2Label}</span>
<span style={{ color: '#F5F8FC' }}>{v.batchTxt}</span>
</label>
<input id="lb-batch" type="range" min={v.b2Min} max={v.b2Max} step="1" value={v.batchIdx} onChange={v.onBatch} />
</div>
</>)}
{v.hasToggle && (<>
<button type="button" className="lb-ic" onClick={v.tgClick} aria-pressed={v.tgPressed} style={{ minHeight: '48px', padding: '0 20px', border: `1px solid ${v.tgBorder}`, borderRadius: '999px', background: v.tgBg, color: v.tgColor, fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>{v.tgLabel}</button>
</>)}
<button type="button" className="lb-ic" onClick={v.recenter} aria-label={t('auto.labo.t13')} style={{ width: '48px', height: '48px', border: '0', borderRadius: '999px', background: 'transparent', color: '#8A97A8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle>
<path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path>
</svg>
</button>
</div>
</div>
<div ref={v.setIris} aria-hidden="true" style={{ position: 'absolute', inset: '0', zIndex: '61', pointerEvents: 'none', clipPath: 'circle(0px at 50% 50%)', background: 'radial-gradient(70% 70% at 50% 50%, #13223F 0%, #0A0F17 72%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg viewBox="-330 -470 660 940" width="70" height="100" aria-hidden="true" style={{ opacity: v.exitOp, transition: 'opacity .45s ease .3s' }}><g transform="skewX(-12)" fill="none" stroke="#9CC6FF" strokeWidth="18"><path d="M-270 0 a270 420 0 1 0 540 0 a270 420 0 1 0 -540 0 Z"></path>
<path d="M-250 0 H250"></path>
</g>
</svg>
</div>
</div>

  </>);
}
