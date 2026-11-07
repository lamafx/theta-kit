// Généré depuis reference/Main.dc.html. Les textes passent par t(), les valeurs par le moteur.
import { Fragment } from 'react';
import Footer from '@/components/Footer';
import LangSwitch from '@/components/LangSwitch';
export default function MainView({ v, t }: { v: any; t: (k: string) => string }) {
  return (<>
<div className="th-intro" data-page="accueil" style={{ position: 'relative', background: '#0A0F17', color: '#F5F8FC', fontFamily: 'var(--font-sans)' }}>{v.showLoader && (<>
<div className="th-curtain-blue" aria-hidden="true" style={{ position: 'fixed', inset: '0', zIndex: '49', background: '#1C46C9' }}></div>
<div className="th-curtain-dark" role="status" aria-label={t('auto.accueil.t1')} style={{ position: 'fixed', inset: '0', zIndex: '50', background: '#0A0F17', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '40px' }}><svg viewBox="-330 -470 660 940" width="140" height="200" aria-hidden="true"><g transform="skewX(-12)" fill="none" strokeLinecap="round" strokeLinejoin="round"><path className="th-draw" pathLength={1} d="M0 -420 C 160 -420 270 -230 270 0 C 270 230 160 420 0 420 C -160 420 -270 230 -270 0 C -270 -230 -160 -420 0 -420" stroke="#F5F8FC" strokeWidth="14"></path>
<path className="th-draw" pathLength={1} d="M-250 0 C -120 -14 120 14 250 0" stroke="#4C8DFF" strokeWidth="14"></path>
</g>
</svg>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}><div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '34px', color: '#F5F8FC' }}>Théta</div>
<div style={{ width: '200px', height: '1px', background: '#1E2938', overflow: 'hidden' }}><div className="th-bar" style={{ width: '100%', height: '1px', background: '#F5F8FC' }}></div>
</div>
<div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '500', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A97A8' }}>{t('loader.tagline')}</div>
</div>
</div>
</>)}
<svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute', width: '0', height: '0', overflow: 'hidden' }}><defs ><g id="hx-robot"><path d="M60 640 C60 520 120 455 220 445 L380 445 C480 455 540 520 540 640 Z" fill="url(#hr-torso)"></path>
<path d="M214 515 Q300 548 386 515" fill="none" stroke="#A7B3C2" strokeWidth="2"></path>
<circle cx="300" cy="575" r="27" fill="none" stroke="#A7B3C2" strokeWidth="2"></circle>
<circle className="th-pulse" cx="300" cy="575" r="14" fill="#4C8DFF" filter="url(#hr-glow)"></circle>
<circle cx="108" cy="548" r="31" fill="url(#hr-shell)"></circle>
<circle cx="108" cy="548" r="22" fill="none" stroke="url(#hr-bronze)" strokeWidth="6"></circle>
<circle cx="108" cy="548" r="15" fill="url(#hr-disc)"></circle>
<circle cx="492" cy="548" r="31" fill="url(#hr-shell)"></circle>
<circle cx="492" cy="548" r="22" fill="none" stroke="url(#hr-bronze)" strokeWidth="6"></circle>
<circle cx="492" cy="548" r="15" fill="url(#hr-disc)"></circle>
<rect x="266" y="360" width="68" height="86" rx="10" fill="url(#hr-metal)"></rect>
<ellipse cx="300" cy="447" rx="62" ry="11" fill="url(#hr-bronze)"></ellipse>
<ellipse cx="300" cy="384" rx="96" ry="16" fill="#0A0F17" fillOpacity="0.5" filter="url(#hr-soft)"></ellipse>
<path d="M150 214 C150 22 450 22 450 214" fill="none" stroke="#1E2938" strokeWidth="22" strokeLinecap="round"></path>
<path d="M150 214 C150 22 450 22 450 214" fill="none" stroke="#4A5768" strokeWidth="5" strokeLinecap="round"></path>
<ellipse cx="300" cy="230" rx="165" ry="150" fill="url(#hr-shell)"></ellipse>
<path d="M170 152 Q300 116 430 152" fill="none" stroke="#C9D4E3" strokeWidth="2"></path>
<rect x="182" y="180" width="236" height="140" rx="70" fill="url(#hr-visor)"></rect>
<path d="M208 220 Q240 194 296 190" fill="none" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="6" strokeLinecap="round"></path>
<g filter="url(#hr-glow)"><rect x="234" y="238" width="46" height="20" rx="10" fill="#9CC6FF"></rect>
<rect x="320" y="238" width="46" height="20" rx="10" fill="#9CC6FF"></rect>
</g>
<rect x="288" y="285" width="24" height="4" rx="2" fill="#4C8DFF" fillOpacity="0.7"></rect>
<circle cx="132" cy="245" r="58" fill="url(#hr-shell)"></circle>
<circle cx="132" cy="245" r="44" fill="none" stroke="url(#hr-bronze)" strokeWidth="9"></circle>
<circle cx="132" cy="245" r="35" fill="url(#hr-disc)"></circle>
<circle cx="132" cy="245" r="13" fill="#DCE3EC" stroke="#8A97A8" strokeWidth="2"></circle>
<circle cx="468" cy="245" r="58" fill="url(#hr-shell)"></circle>
<circle cx="468" cy="245" r="44" fill="none" stroke="url(#hr-bronze)" strokeWidth="9"></circle>
<circle cx="468" cy="245" r="35" fill="url(#hr-disc)"></circle>
<circle cx="468" cy="245" r="13" fill="#DCE3EC" stroke="#8A97A8" strokeWidth="2"></circle>
</g>
<linearGradient id="hr-white" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF"></stop>
<stop offset="0.6" stopColor="#F5F8FC"></stop>
<stop offset="1" stopColor="#C9D4E3"></stop>
</linearGradient>
<filter id="hr-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"></feGaussianBlur>
</filter>
<radialGradient id="hr-shell" cx="38%" cy="28%" r="80%"><stop offset="0" stopColor="#FFFFFF"></stop>
<stop offset="0.55" stopColor="#DCE3EC"></stop>
<stop offset="1" stopColor="#8A97A8"></stop>
</radialGradient>
<radialGradient id="hr-torso" cx="50%" cy="8%" r="95%"><stop offset="0" stopColor="#FFFFFF"></stop>
<stop offset="0.5" stopColor="#DCE3EC"></stop>
<stop offset="1" stopColor="#8A97A8"></stop>
</radialGradient>
<linearGradient id="hr-visor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1E2938"></stop>
<stop offset="1" stopColor="#0A0F17"></stop>
</linearGradient>
<linearGradient id="hr-bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C9D4E3"></stop>
<stop offset="0.5" stopColor="#D9A066"></stop>
<stop offset="1" stopColor="#4A5768"></stop>
</linearGradient>
<linearGradient id="hr-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4A5768"></stop>
<stop offset="0.45" stopColor="#DCE3EC"></stop>
<stop offset="1" stopColor="#4A5768"></stop>
</linearGradient>
<radialGradient id="hr-disc" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#FFFFFF"></stop>
<stop offset="1" stopColor="#A7B3C2"></stop>
</radialGradient>
<filter id="hr-glow" x="-60%" y="-120%" width="220%" height="340%"><feGaussianBlur stdDeviation="7" result="b"></feGaussianBlur>
<feMerge ><feMergeNode in="b"></feMergeNode>
<feMergeNode in="b"></feMergeNode>
<feMergeNode in="SourceGraphic"></feMergeNode>
</feMerge>
</filter>
<filter id="hr-soft" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="9"></feGaussianBlur>
</filter>
</defs>
</svg>
<section id="accueil" className="hx" style={{ position: 'relative', overflow: 'hidden', background: '#F5F8FC', color: '#0A0F17', minHeight: v.heroH, display: 'flex', flexDirection: 'column' }}><div aria-hidden="true" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', backgroundImage: 'radial-gradient(#C9D4E3 1.1px, transparent 1.2px)', backgroundSize: '28px 28px', WebkitMaskImage: 'radial-gradient(90% 80% at 62% 40%, #000 30%, transparent 85%)', maskImage: 'radial-gradient(90% 80% at 62% 40%, #000 30%, transparent 85%)', opacity: '0.7' }}></div>
<div aria-hidden="true" style={{ position: 'absolute', right: '-10%', top: '-20%', width: '70%', height: '120%', pointerEvents: 'none', background: 'radial-gradient(closest-side, rgba(76,141,255,0.22), rgba(76,141,255,0) 70%)' }}></div>
<header className="hx-top" style={{ position: 'relative', zIndex: '5', width: '100%', maxWidth: '1360px', margin: '0 auto', padding: '26px 40px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}><a href="#accueil" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#0A0F17' }}><svg viewBox="-330 -470 660 940" width="20" height="29" aria-hidden="true"><g transform="skewX(-12)"><path fillRule="evenodd" d="M-270 0 a270 420 0 1 0 540 0 a270 420 0 1 0 -540 0 Z M-176 0 a176 368 0 1 0 352 0 a176 368 0 1 0 -352 0 Z" fill="#0A0F17"></path>
<rect x="-178" y="-26" width="356" height="52" fill="#1C46C9"></rect>
</g>
</svg>
<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '30px', lineHeight: '1' }}>Théta</span>
</a>
<div className="hx-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.7)', border: '1px solid #DCE3EC', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}><nav className="hx-nav" aria-label={t('auto.accueil.t2')} style={{ display: 'flex', gap: '2px', fontSize: '15px' }}><a href="#carrousels" onClick={v.toPdf}>{t('nav.carrousels')}</a>
<a href={v.href.labo} onClick={v.toLabo}>{t('nav.labo')}</a>
</nav>
<LangSwitch />
<a className="th-btn hx-enter" href="#portail" onClick={v.enter} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minHeight: '42px', padding: '0 20px', borderRadius: '999px', background: '#0A0F17', color: '#F5F8FC', fontSize: '15px', fontWeight: '600', textDecoration: 'none' }}>{t('auto.accueil.t3')}{' '}<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '20px', color: '#9CC6FF' }}>θ</span>
</a>
</div>
</header>
<div className="hx-main" style={{ position: 'relative', zIndex: '2', flex: '1 1 auto', width: '100%', maxWidth: '1360px', margin: '0 auto', padding: '8px 40px 40px', boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}><div className="hx-left" style={{ flex: '1 1 640px', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '28px', padding: '20px 0' }}><div className="th-rise" style={{ animationDelay: v.d0, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 14px 8px 8px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid #DCE3EC', fontSize: '14px', color: '#4A5768' }}><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '24px', padding: '0 10px', borderRadius: '999px', background: '#1C46C9', color: '#FFFFFF', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', whiteSpace: 'nowrap', flexShrink: '0' }}>{t('hero.saison')}</span>
{t('hero.serie')}</div>
<h1 style={{ margin: '0', fontSize: 'clamp(44px, 4.8vw, 84px)', lineHeight: '0.98', fontWeight: '500', letterSpacing: '-0.05em', color: '#0A0F17' }}><span className="th-reveal" style={{ animationDelay: v.d1, display: 'block' }}>{t('hero.titre_1')}</span>
<span className="th-reveal" style={{ animationDelay: v.d2, display: 'block', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400', letterSpacing: '-0.02em', color: '#1C46C9' }}>{t('hero.titre_2')}</span>
<span className="th-reveal" style={{ animationDelay: v.d3, display: 'block' }}>{t('hero.titre_3')}</span>
</h1>
<p className="th-rise" style={{ animationDelay: v.d4, margin: '0', maxWidth: '520px', fontSize: 'clamp(18px, 1.5vw, 21px)', lineHeight: '1.55', color: '#4A5768' }}>{t('hero.intro')}</p>
<div className="th-rise" style={{ animationDelay: v.d5, display: 'flex', flexWrap: 'wrap', gap: '12px' }}><a className="th-btn" href="#portail" onClick={v.enter} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', minHeight: '56px', padding: '0 28px', borderRadius: '999px', background: '#1C46C9', color: '#FFFFFF', fontSize: '16px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 18px 40px -18px rgba(28,70,201,0.8)' }}>{t('hero.cta_voyage')}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"></path>
</svg>
</a>
<a className="th-btn" href="#carrousels" onClick={v.toPdf} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minHeight: '56px', padding: '0 26px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid #C9D4E3', color: '#0A0F17', fontSize: '16px', fontWeight: '500', textDecoration: 'none' }}>{t('hero.cta_pdf')}</a>
</div>
<div className="th-rise" style={{ animationDelay: v.d6, display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}><div className="hx-stat"><b >{v.total}</b>
<span >{t('hero.stat_episodes')}</span>
</div>
<div className="hx-stat"><b >{v.rythme}</b>
<span >{t('hero.stat_rythme')}</span>
</div>
<div className="hx-stat"><b>{v.nbLabos}</b>
<span >{t('hero.stat_3d')}</span>
</div>
</div>
</div>
<div className="th-rise hx-panel" style={{ animationDelay: v.d1, position: 'relative', flex: '1 1 460px', minWidth: '0', alignSelf: 'stretch', minHeight: '600px', borderRadius: '36px', overflow: 'hidden', background: 'radial-gradient(110% 80% at 50% 38%, #1C46C9 0%, #1C46C9 38%, #102C86 72%, #13223F 100%)', boxShadow: '0 40px 80px -40px rgba(16,44,134,.75)' }}><canvas data-hero="1" ref={v.setHeroCanvas} onClick={v.poke} aria-label={t('auto.accueil.t4')} role="img" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}></canvas>
{v.noGL && (<>
<svg viewBox="40 10 520 640" style={{ position: 'absolute', left: '50%', top: '50%', width: '46%', transform: 'translate(-50%, -50%)' }} role="img" aria-label={t('auto.accueil.t5')}><use href="#hx-robot"></use>
</svg>
</>)}
<div ref={v.setBubble} aria-hidden="true" className="hx-bubble" style={{ position: 'absolute', left: '0', top: '0', opacity: '0', pointerEvents: 'none', padding: '12px 18px', borderRadius: '18px 18px 18px 6px', background: '#FFFFFF', border: '1px solid #DCE3EC', boxShadow: '0 18px 40px -18px rgba(10,15,23,0.35)', fontSize: '16px', fontWeight: '500', color: '#0A0F17', whiteSpace: 'nowrap' }}></div>
<div className="hx-chip th-float" style={{ left: '5%', top: '9%', animationDelay: '-1s' }}>θ ← θ − η∇J</div>
<div className="hx-chip th-float" style={{ right: '5%', top: '20%', animationDelay: '-2.5s' }}>∇J</div>
<div className="hx-chip th-float" style={{ left: '5%', bottom: '14%', animationDelay: '-3.6s' }}>{t('auto.accueil.t6')}</div>
<div style={{ position: 'absolute', right: '5%', top: '5%', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#CFE0FF' }}><span className="th-pulse" style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#9CC6FF' }}></span>
{t('hero.robot_hint')}</div>
</div>
</div>
<div style={{ position: 'relative', zIndex: '2', display: 'flex', justifyContent: 'center', padding: '0 0 26px' }}><a href="#carrousels" onClick={v.toPdf} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#6B7A8C', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' }}><span className="th-bob" style={{ width: '24px', height: '38px', borderRadius: '14px', border: '1.5px solid #A7B3C2', display: 'flex', justifyContent: 'center', paddingTop: '7px', boxSizing: 'border-box' }}><span style={{ width: '3px', height: '8px', borderRadius: '3px', background: '#0A0F17' }}></span>
</span>
{t('hero.defiler')}</a>
</div>
</section>
<div aria-hidden="true" style={{ borderTop: '1px solid #1E2938', borderBottom: '1px solid #1E2938', overflow: 'hidden', padding: '24px 0' }}><div className="th-marquee" style={{ display: 'flex', width: 'max-content', gap: '44px', alignItems: 'center', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '38px', color: '#C9D4E3', whiteSpace: 'nowrap' }}>{(v.marquee || []).map((m: any, i1: number) => (<Fragment key={i1}>
<span >{m.t}</span>
<span style={{ color: '#4C8DFF' }}>θ</span>
</Fragment>))}
</div>
</div>
<section className="sec-pad" id="carrousels" aria-label={t('hero.cta_pdf')} style={{ position: 'relative', maxWidth: '1320px', margin: '0 auto', padding: '150px 40px 120px' }}><div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px 60px', marginBottom: '64px' }}><div style={{ display: 'flex', flexDirection: 'column', gap: '26px', flex: '1 1 520px', minWidth: '0' }}><div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A97A8' }}><span style={{ width: '40px', height: '1px', background: '#4C8DFF' }}></span>
{t('carrousels.surtitre')}</div>
<h2 style={{ margin: '0', fontSize: 'clamp(46px, 6vw, 96px)', lineHeight: '0.95', fontWeight: '500', letterSpacing: '-0.045em' }}>{t('carrousels.titre_1')}<br  />
<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400', letterSpacing: '-0.02em', color: '#CFE0FF' }}>{t('carrousels.titre_2')}</span>
</h2>
</div>
<div style={{ flex: '0 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}><p style={{ margin: '0', fontSize: '18px', lineHeight: '1.55', color: '#A7B3C2' }}>{t('carrousels.intro')}</p>
<a className="pd-btn" href="https://www.linkedin.com/feed/hashtag/thetaml/" target="_blank" rel="noopener" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '10px', minHeight: '46px', padding: '0 20px', borderRadius: '999px', border: '1px solid #2E3B4D', color: '#F5F8FC', fontSize: '15px', textDecoration: 'none' }}>{t('carrousels.suivre')}{' '}<span aria-hidden="true">↗</span>
</a>
</div>
</div>
<div className="pd-stack" ref={v.setStack} style={{ position: 'relative' }}>{(v.eps || []).map((c: any, i2: number) => (<Fragment key={i2}>
<div data-card="1" style={{ position: 'sticky', top: c.top, height: c.h, paddingBottom: '26px', boxSizing: 'border-box' }}><article className="pd-card" data-inner="1" style={{ position: 'relative', height: '100%', borderRadius: '32px', background: c.bg, color: c.fg, border: `1px solid ${c.line}`, overflow: 'hidden', transformOrigin: '50% 0', boxShadow: '0 -24px 60px -30px rgba(4,8,14,0.7)' }}><div className="pd-split" style={{ height: '100%', display: 'flex' }}><div className="pd-txt" style={{ flex: '1 1 52%', minWidth: '0', padding: '46px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '28px', boxSizing: 'border-box' }}><div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.16em', textTransform: 'uppercase', color: c.muted }}><span ><b style={{ fontSize: '22px', fontWeight: '500', color: c.fg }}>{c.n}</b>
/{' '}{c.total}</span>
<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '20px', letterSpacing: '0', textTransform: 'none' }}>{c.group}</span>
</div>
<div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}><h3 style={{ margin: '0', fontSize: 'clamp(38px, 4.4vw, 72px)', lineHeight: '0.98', fontWeight: '500', letterSpacing: '-0.04em' }}>{c.t1}{' '}<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400', letterSpacing: '-0.015em', color: c.accent }}>{c.t2}</span>
</h3>
<p style={{ margin: '0', maxWidth: '480px', fontSize: '19px', lineHeight: '1.5', color: c.muted }}>{c.text}</p>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}><a className="pd-btn" href={c.pdf} target={c.target} download={c.file} data-ep={c.n} onClick={c.dl} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', minHeight: '52px', padding: '0 24px', borderRadius: '999px', background: c.btnBg, color: c.btnFg, fontSize: '15px', fontWeight: '600', textDecoration: 'none' }}>{c.cta}<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={c.icon}></path>
</svg>
</a>
{c.hasLab && (<>
<a className="pd-btn" href={c.labHref} onClick={c.lab} style={{ display: 'inline-flex', alignItems: 'center', minHeight: '52px', padding: '0 22px', borderRadius: '999px', border: `1px solid ${c.line2}`, color: c.fg, fontSize: '15px', fontWeight: '500', textDecoration: 'none' }}>{t('carrousels.labo')}</a>
</>)}
{c.hasMail && (<>
<button type="button" className="pd-btn" data-ep={c.n} data-title={c.plain} onClick={c.mail} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minHeight: '52px', padding: '0 20px', borderRadius: '999px', border: `1px solid ${c.line2}`, background: 'transparent', color: c.fg, font: '500 15px var(--font-sans)', cursor: 'pointer' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h16v12H4zM4 7l8 6 8-6"></path>
</svg>
{t('carrousels.email')}</button>
</>)}
</div>
</div>
<div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: c.muted }}>{c.foot}</div>
</div>
<a className="pd-cover pd-cover-a" href={c.pdf} target={c.target} download={c.file} data-ep={c.n} onClick={c.dl} aria-label={c.aria} style={{ position: 'relative', display: 'block', flex: '1 1 48%', minWidth: '0', background: c.panel, overflow: 'hidden', color: 'inherit', textDecoration: 'none' }}><svg viewBox="-330 -470 660 940" aria-hidden="true" style={{ position: 'absolute', right: '-12%', top: '-10%', height: '120%', opacity: '0.07' }}><g transform="skewX(-12)"><path fillRule="evenodd" d="M-270 0 a270 420 0 1 0 540 0 a270 420 0 1 0 -540 0 Z M-176 0 a176 368 0 1 0 352 0 a176 368 0 1 0 -352 0 Z" fill={c.fg}></path>
<rect x="-178" y="-26" width="356" height="52" fill={c.fg}></rect>
</g>
</svg>
<div className="pd-page" style={{ position: 'absolute', left: '50%', top: '50%', width: '46%', maxWidth: '300px', aspectRatio: '4 / 5', marginLeft: '-23%', borderRadius: '14px', background: '#F5F8FC', boxShadow: '0 30px 60px -30px rgba(4,8,14,0.55)', transform: 'translate(calc(var(--f) * -120px), -50%) rotate(calc(var(--f) * -10deg))', display: 'flex', flexDirection: 'column', gap: '9px', padding: '22px 20px', boxSizing: 'border-box' }}><span style={{ width: '70%', height: '12px', borderRadius: '4px', background: '#0A0F17' }}></span>
<span style={{ width: '45%', height: '12px', borderRadius: '4px', background: '#1C46C9' }}></span>
<span style={{ marginTop: '10px', width: '100%', height: '5px', borderRadius: '3px', background: '#DCE3EC' }}></span>
<span style={{ width: '92%', height: '5px', borderRadius: '3px', background: '#DCE3EC' }}></span>
<span style={{ width: '84%', height: '5px', borderRadius: '3px', background: '#DCE3EC' }}></span>
<svg viewBox="0 0 200 90" style={{ marginTop: 'auto', width: '100%', height: 'auto' }} aria-hidden="true"><path d="M6 14 C 50 92, 120 96, 194 20" fill="none" stroke="#4C8DFF" strokeWidth="3"></path>
<circle cx="98" cy="74" r="5" fill="#D9A066"></circle>
</svg>
</div>
<div className="pd-page" style={{ position: 'absolute', left: '50%', top: '50%', width: '46%', maxWidth: '300px', aspectRatio: '4 / 5', marginLeft: '-23%', borderRadius: '14px', background: '#F5F8FC', boxShadow: '0 30px 60px -30px rgba(4,8,14,0.55)', transform: 'translate(calc(var(--f) * 120px), -50%) rotate(calc(var(--f) * 10deg))', display: 'flex', flexDirection: 'column', gap: '9px', padding: '22px 20px', boxSizing: 'border-box' }}><span style={{ width: '70%', height: '12px', borderRadius: '4px', background: '#0A0F17' }}></span>
<span style={{ width: '45%', height: '12px', borderRadius: '4px', background: '#1C46C9' }}></span>
<span style={{ marginTop: '10px', width: '100%', height: '5px', borderRadius: '3px', background: '#DCE3EC' }}></span>
<span style={{ width: '92%', height: '5px', borderRadius: '3px', background: '#DCE3EC' }}></span>
<span style={{ width: '84%', height: '5px', borderRadius: '3px', background: '#DCE3EC' }}></span>
<svg viewBox="0 0 200 90" style={{ marginTop: 'auto', width: '100%', height: 'auto' }} aria-hidden="true"><path d="M6 14 C 50 92, 120 96, 194 20" fill="none" stroke="#4C8DFF" strokeWidth="3"></path>
<circle cx="98" cy="74" r="5" fill="#D9A066"></circle>
</svg>
</div>
<div style={{ position: 'absolute', left: '50%', top: '50%', width: '46%', maxWidth: '300px', aspectRatio: '4 / 5', marginLeft: '-23%', transform: 'translateY(calc(-50% - var(--f) * 10px))', borderRadius: '14px', background: '#0A0F17', border: '1px solid #1E2938', boxShadow: '0 40px 70px -28px rgba(4,8,14,0.8)', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '16px 16px 14px', boxSizing: 'border-box' }}>{c.hasCover && (<>
<img src={c.cover} alt={c.coverAlt} loading="lazy" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
</>)}
{c.noCover && (<>
<div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8A97A8' }}><span >{t('auto.accueil.t7')}</span>
<span >{c.coverNo}</span>
</div>
<svg viewBox="150 52 210 228" style={{ width: '78%', height: 'auto', margin: '10px auto 0', display: 'block' }} aria-hidden="true"><g transform="translate(150 60) scale(0.34)"><path d="M60 640 C60 520 120 455 220 445 L380 445 C480 455 540 520 540 640 Z" fill="url(#hr-torso)"></path>
<circle cx="300" cy="575" r="14" fill="#4C8DFF" filter="url(#hr-glow)"></circle>
<rect x="266" y="360" width="68" height="86" rx="10" fill="url(#hr-metal)"></rect>
<ellipse cx="300" cy="447" rx="62" ry="11" fill="url(#hr-bronze)"></ellipse>
<path d="M150 214 C150 22 450 22 450 214" fill="none" stroke="#1E2938" strokeWidth="22" strokeLinecap="round"></path>
<ellipse cx="300" cy="230" rx="165" ry="150" fill="url(#hr-shell)"></ellipse>
<rect x="182" y="180" width="236" height="140" rx="70" fill="url(#hr-visor)"></rect>
<g filter="url(#hr-glow)"><rect x="234" y="238" width="46" height="20" rx="10" fill="#9CC6FF"></rect>
<rect x="320" y="238" width="46" height="20" rx="10" fill="#9CC6FF"></rect>
</g>
<circle cx="132" cy="245" r="58" fill="url(#hr-shell)"></circle>
<circle cx="132" cy="245" r="44" fill="none" stroke="url(#hr-bronze)" strokeWidth="9"></circle>
<circle cx="132" cy="245" r="35" fill="url(#hr-disc)"></circle>
<circle cx="468" cy="245" r="58" fill="url(#hr-shell)"></circle>
<circle cx="468" cy="245" r="44" fill="none" stroke="url(#hr-bronze)" strokeWidth="9"></circle>
<circle cx="468" cy="245" r="35" fill="url(#hr-disc)"></circle>
</g>
</svg>
<div style={{ marginTop: 'auto', fontSize: '17px', lineHeight: '1.05', fontWeight: '500', letterSpacing: '-0.02em', color: '#F5F8FC' }}>{c.t1}{' '}<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400', color: '#CFE0FF' }}>{c.t2}</span>
</div>
<div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.16em', color: '#4C8DFF' }}>{t('auto.accueil.t8')}</div>
</>)}
</div>
<span className="pd-dlbadge pd-hot" style={{ position: 'absolute', left: '50%', bottom: '28px', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', gap: '10px', minHeight: '48px', padding: '0 22px', borderRadius: '999px', background: '#4C8DFF', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', whiteSpace: 'nowrap', transition: 'transform .25s ease' }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={c.icon}></path>
</svg>
{c.badge}</span>
</a>
</div>
<div data-shade="1" aria-hidden="true" style={{ position: 'absolute', inset: '0', background: '#0A0F17', opacity: '0', pointerEvents: 'none' }}></div>
</article>
</div>
</Fragment>))}
</div>
<div ref={v.setPdBar} className="pd-bar" role="group" aria-label={t('auto.accueil.t9')} style={{ position: 'fixed', left: '50%', bottom: '22px', zIndex: '120', transform: 'translate(-50%, 20px)', opacity: '0', pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px', borderRadius: '999px', background: 'rgba(10,15,23,0.82)', border: '1px solid #2E3B4D', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 20px 50px -20px rgba(0,0,0,.7)' }}><button type="button" className="pd-ctl" onClick={v.pdPrev} aria-label={t('auto.accueil.t10')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"></path>
</svg>
</button>
<span ref={v.setPdCount} style={{ minWidth: '66px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.12em', color: '#CFE0FF' }}>01 / 11</span>
<button type="button" className="pd-ctl" onClick={v.pdNext} aria-label={t('auto.accueil.t11')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path>
</svg>
</button>
<span aria-hidden="true" style={{ width: '1px', height: '24px', background: '#2E3B4D', margin: '0 4px' }}></span>
<button type="button" className="pd-ctl" onClick={v.pdSkip} style={{ background: '#F5F8FC', color: '#0A0F17', padding: '0 18px', fontWeight: '600' }}>{t('carrousels.passer')}{' '}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"></path>
</svg>
</button>
</div>
<div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '26px', borderTop: '1px solid #1E2938', fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8A97A8' }}><span >{v.prochain}</span>
<a href="#portail" onClick={v.enter} style={{ color: '#CFE0FF', textDecoration: 'none' }}>{t('carrousels.vers_voyage')}</a>
</div>
</section>
<section id="createur" aria-label={t('auto.accueil.t12')} style={{ position: 'relative', padding: '10px 0 70px' }}><a className="ct3" href={v.href.profil} onClick={v.toProfil} onPointerMove={v.ctMove}><div className="ct3-top"><span className="ct3-face"><span className="ct3-ring" aria-hidden="true"></span>
<img src="/img/llk-cutout.webp" alt="" />
</span>
<span className="ct3-txt"><span className="ct3-eb">{t('createur.surtitre')}</span>
<span className="ct3-name">Ladji Lama{' '}<i >Kamagate</i>
</span>
</span>
<span className="ct3-go">{t('createur.cta')}{' '}<span className="ct3-arr" aria-hidden="true">→</span>
</span>
</div>
<div className="ct3-tk" aria-hidden="true"><div className="ct3-tk-in"><span >Machine Learning</span>
<b >✦</b>
<span >API REST</span>
<b >✦</b>
<span >Computer Vision</span>
<b >✦</b>
<span >IoT</span>
<b >✦</b>
<span >Abidjan</span>
<b >✦</b>
<span >{t('auto.accueil.t13')}</span>
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
<span >{t('auto.accueil.t13')}</span>
<b >✦</b>
</div>
</div>
<span className="ct3-cur" aria-hidden="true">{t('createur.cta_court')}</span>
</a>
</section>
<section className="sec-pad" id="inscription" aria-label={t('auto.accueil.t14')} style={{ position: 'relative', maxWidth: '1320px', margin: '0 auto', padding: '40px 40px 150px' }}><div style={{ position: 'relative', overflow: 'hidden', borderRadius: '36px', background: 'radial-gradient(90% 120% at 85% 0%, #1C46C9 0%, #1C46C9 40%, #102C86 100%)', color: '#F5F8FC', boxShadow: '0 50px 100px -50px rgba(16,44,134,.9)' }}><svg viewBox="-330 -470 660 940" aria-hidden="true" style={{ position: 'absolute', right: '-6%', top: '-30%', height: '160%', opacity: '0.1' }}><g transform="skewX(-12)" fill="none" stroke="#FFFFFF" strokeWidth="10"><ellipse cx="0" cy="0" rx="270" ry="420"></ellipse>
<ellipse cx="0" cy="0" rx="176" ry="368"></ellipse>
<path d="M-176 -26 H176 M-176 26 H176"></path>
</g>
</svg>
<div className="ins-grid" style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '48px', padding: 'clamp(32px, 5vw, 64px)' }}><div style={{ flex: '1 1 420px', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#CFE0FF' }}><span style={{ width: '40px', height: '1px', background: '#CFE0FF' }}></span>
{t('inscription.surtitre')}</div>
<h2 style={{ margin: '0', fontSize: 'clamp(40px, 4.6vw, 72px)', lineHeight: '0.98', fontWeight: '500', letterSpacing: '-0.045em' }}>{t('inscription.titre_1')}<br  />
<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400', letterSpacing: '-0.02em', color: '#CFE0FF' }}>{t('inscription.titre_2')}</span>
</h2>
<p style={{ margin: '0', maxWidth: '460px', fontSize: '18px', lineHeight: '1.55', color: '#CFE0FF' }}>{t('inscription.intro')}</p>
<ul style={{ margin: '0', padding: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '16px', color: '#F5F8FC' }}><li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ width: '22px', height: '22px', borderRadius: '999px', background: 'rgba(255,255,255,.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</span>
{t('inscription.plus_1')}</li>
<li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ width: '22px', height: '22px', borderRadius: '999px', background: 'rgba(255,255,255,.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</span>
{t('inscription.plus_2')}</li>
<li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ width: '22px', height: '22px', borderRadius: '999px', background: 'rgba(255,255,255,.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</span>
{t('inscription.plus_3')}</li>
</ul>
</div>
<div style={{ flex: '1 1 400px', minWidth: '0' }}>{!v.inscription && (<div style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '18px', padding: '36px', borderRadius: '26px', background: '#F5F8FC', color: '#0A0F17' }}>
<div style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-0.03em' }}>{t('commun.liste_bientot_titre')}</div>
<p style={{ margin: '0', fontSize: '17px', lineHeight: '1.55', color: '#4A5768' }}>{t('commun.liste_bientot')}</p>
<a href="https://www.linkedin.com/feed/hashtag/thetaml/" target="_blank" rel="noopener" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', minHeight: '48px', padding: '0 20px', borderRadius: '999px', background: '#1C46C9', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', textDecoration: 'none' }}>{t('carrousels.suivre')} ↗</a>
</div>)}
{v.fDone && (<>
<div role="status" style={{ height: '100%', minHeight: '320px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '18px', padding: '36px', borderRadius: '26px', background: '#F5F8FC', color: '#0A0F17' }}><span style={{ width: '52px', height: '52px', borderRadius: '999px', background: '#1C46C9', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '30px' }}>θ</span>
<div style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-0.03em' }}>{v.fThanks}</div>
<p style={{ margin: '0', fontSize: '17px', lineHeight: '1.55', color: '#4A5768' }}>{v.fDoneTxt}</p>
<button type="button" onClick={v.fReset} style={{ alignSelf: 'flex-start', minHeight: '44px', padding: '0 18px', borderRadius: '999px', border: '1px solid #C9D4E3', background: 'transparent', color: '#0A0F17', font: '500 15px var(--font-sans)', cursor: 'pointer' }}>{t('inscription.autre')}</button>
</div>
</>)}
{v.fOpen && (<>
<form onSubmit={v.fSubmit} noValidate={v.yes} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px', borderRadius: '26px', background: '#F5F8FC', color: '#0A0F17' }}><label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#2E3B4D' }}><span >{t('inscription.prenom')}{' '}<span style={{ fontWeight: '400', color: '#6B7A8C' }}>{t('inscription.facultatif')}</span>
</span>
<input ref={v.setFName} name="prenom" type="text" autoComplete="given-name" maxLength={60} placeholder="Ladji" className="fm-in" />
</label>
<label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#2E3B4D' }}>{t('inscription.email')}<input ref={v.setFMail} name="email" type="email" autoComplete="email" maxLength={160} placeholder={t('auto.accueil.t15')} className="fm-in" aria-invalid={v.fMailBad} aria-describedby="fm-err" />
</label>
<fieldset style={{ margin: '0', padding: '0', border: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}><legend style={{ padding: '0', marginBottom: '10px', fontSize: '14px', fontWeight: '500', color: '#2E3B4D' }}>{t('inscription.je_veux')}</legend>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}><button type="button" className="fm-chip" onClick={v.fTogPdf} aria-pressed={v.fPdfPressed}><span className="fm-box" aria-hidden="true">✓</span>
{t('inscription.pdf')}</button>
<button type="button" className="fm-chip" onClick={v.fTogNews} aria-pressed={v.fNewsPressed}><span className="fm-box" aria-hidden="true">✓</span>
{t('inscription.newsletter')}</button>
</div>
</fieldset>
<input ref={v.setFTrap} name="site" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: '0' }} />
<label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', lineHeight: '1.5', color: '#4A5768', cursor: 'pointer' }}><input ref={v.setFOk} type="checkbox" style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: '#1C46C9', flexShrink: '0' }} />
<span >{t('inscription.consentement')}{' '}<a href={v.hrefConf} style={{ color: '#1C46C9', textDecoration: 'underline' }}>{t('footer.confidentialite')}</a>
</span>
</label>
<div id="fm-err" role="alert" style={{ minHeight: '20px', fontSize: '14px', fontWeight: '500', color: '#0A0F17' }}>{v.fErr}</div>
<button type="submit" className="th-btn" style={{ minHeight: '56px', border: '0', borderRadius: '999px', background: '#0A0F17', color: '#F5F8FC', font: '600 16px var(--font-sans)', cursor: 'pointer', opacity: v.fBtnOp, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>{v.fBtnTxt}{' '}<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '22px', color: '#9CC6FF' }}>θ</span>
</button>
</form>
</>)}
</div>
</div>
</div>
</section>
<Footer />
<div data-avant-portail="1" style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 40px 60px', display: 'flex', justifyContent: 'center' }}><a href="#portail" onClick={v.enter} className="mono-cta" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#CFE0FF', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '500', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{t('auto.accueil.t16')}<span className="th-bob" aria-hidden="true" style={{ fontSize: '18px' }}>↓</span>
</a>
</div>
<section id="portail" ref={v.setPortal} aria-label={t('auto.accueil.t17')} style={{ position: 'relative', height: v.portalH }}><div style={{ position: 'sticky', top: '0', height: v.stickyH, overflow: 'hidden', background: '#0A0F17' }}><canvas data-portal="1" ref={v.setCanvas} aria-hidden="true" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }}></canvas>
<div aria-hidden="true" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', background: 'radial-gradient(110% 85% at 50% 50%, rgba(10,15,23,0) 45%, rgba(10,15,23,0.85) 100%)' }}></div>
<div ref={v.setS1} className="th-shadow" style={{ position: 'absolute', left: '0', right: '0', top: '22%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', pointerEvents: 'none', padding: '0 24px' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A97A8' }}>{t('auto.accueil.t18')}</span>
<span style={{ fontSize: 'clamp(40px, 5vw, 80px)', lineHeight: '0.96', fontWeight: '500', letterSpacing: '-0.045em' }}>{t('auto.accueil.t19')}{' '}<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400', color: '#CFE0FF' }}>θ.</span>
</span>
<span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '18px' }}><span className="th-bob" style={{ width: '24px', height: '38px', borderRadius: '14px', border: '1.5px solid #8A97A8', display: 'flex', justifyContent: 'center', paddingTop: '7px', boxSizing: 'border-box' }}><span style={{ width: '3px', height: '8px', borderRadius: '3px', background: '#F5F8FC' }}></span>
</span>
<span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A7B3C2' }}>{t('auto.accueil.t20')}</span>
</span>
</div>
<div ref={v.setS2} className="th-shadow" style={{ position: 'absolute', left: '0', right: '0', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', pointerEvents: 'none', opacity: '0', padding: '0 24px' }}><span style={{ display: 'block', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(44px, 6vw, 96px)', lineHeight: '1', color: '#F5F8FC' }}>{t('auto.accueil.t21')}</span>
<span style={{ display: 'block', margin: '22px auto 0', maxWidth: '560px', fontSize: 'clamp(17px, 1.5vw, 21px)', lineHeight: '1.5', color: '#CFE0FF' }}>{t('auto.accueil.t22')}</span>
</div>
<div ref={v.setS3} className="th-shadow" style={{ position: 'absolute', left: '0', right: '0', top: '50%', transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', gap: '22px 36px', flexWrap: 'wrap', pointerEvents: 'none', opacity: '0', padding: '0 24px', fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#CFE0FF' }}><span style={{ width: '100%', textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: 'clamp(36px, 4.4vw, 68px)', fontWeight: '500', letterSpacing: '-0.04em', textTransform: 'none', color: '#F5F8FC' }}>{t('auto.accueil.t23')}{' '}<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400', color: '#CFE0FF' }}>{t('auto.accueil.t24')}</span>
</span>
<span >{v.portes}</span>
<span style={{ color: '#4C8DFF' }}>θ</span>
<span >{v.nbEps}</span>
<span style={{ color: '#4C8DFF' }}>θ</span>
<span >{t('auto.accueil.t25')}</span>
</div>
{v.tactile && (<>
<a className="th-btn" href={v.href.voyage} onClick={v.goNow} style={{ position: 'absolute', left: '50%', bottom: '84px', transform: 'translateX(-50%)', zIndex: '3', display: 'inline-flex', alignItems: 'center', minHeight: '52px', padding: '0 26px', borderRadius: '999px', background: '#F5F8FC', color: '#0A0F17', fontSize: '16px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>{t('hero.cta_voyage')}</a>
</>)}
<div ref={v.setBar} aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: '40px', width: '160px', height: '2px', marginLeft: '-80px', background: '#1E2938', borderRadius: '2px', overflow: 'hidden' }}><div ref={v.setBarIn} style={{ width: '100%', height: '2px', background: '#4C8DFF', transformOrigin: 'left center', transform: 'scaleX(0)' }}></div>
</div>
<div ref={v.setFlash} aria-hidden="true" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', opacity: '0', background: 'radial-gradient(60% 60% at 50% 46%, #F5F8FC 0%, #4C8DFF 30%, #0A0F17 80%)' }}></div>
</div>
</section>
{v.mOpen && (<>
<div className="ml-back" onClick={v.mBack} style={{ position: 'fixed', inset: '0', zIndex: '220', background: 'rgba(5,8,13,0.62)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}><div className="ml-card" role="dialog" aria-modal="true" aria-labelledby="ml-title" style={{ position: 'relative', width: '100%', maxWidth: '460px', borderRadius: '28px', background: '#F5F8FC', color: '#0A0F17', boxShadow: '0 40px 90px -30px rgba(0,0,0,.7)', overflow: 'hidden' }}><div style={{ position: 'relative', padding: '26px 28px 22px', background: 'radial-gradient(120% 140% at 90% 0%, #1C46C9 0%, #1C46C9 45%, #102C86 100%)', color: '#F5F8FC' }}><button type="button" onClick={v.closeMail} aria-label={t('nav.fermer')} style={{ position: 'absolute', right: '14px', top: '14px', width: '40px', height: '40px', borderRadius: '999px', border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.08)', color: '#FFFFFF', fontSize: '18px', cursor: 'pointer' }}>×</button>
<div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '500', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#CFE0FF' }}>{t('auto.accueil.t26')}{' '}{v.mEp}{' '}{t('auto.accueil.t27')}</div>
<div id="ml-title" style={{ marginTop: '10px', paddingRight: '44px', fontSize: '26px', lineHeight: '1.12', fontWeight: '500', letterSpacing: '-0.03em' }}>{t('auto.accueil.t28')}{' '}<span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: '400', color: '#CFE0FF' }}>{v.mTitle}</span>
{' '}{t('auto.accueil.t29')}</div>
</div>
{v.mDone && (<>
<div role="status" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}><div style={{ fontSize: '22px', fontWeight: '500', letterSpacing: '-0.02em' }}>{t('auto.accueil.t30')}</div>
<p style={{ margin: '0', fontSize: '16px', lineHeight: '1.55', color: '#4A5768' }}>{t('auto.accueil.t31')}{' '}{v.mEp}{' '}{t('auto.accueil.t32')}</p>
<button type="button" onClick={v.closeMail} style={{ alignSelf: 'flex-start', minHeight: '46px', padding: '0 20px', borderRadius: '999px', border: '0', background: '#0A0F17', color: '#F5F8FC', font: '600 15px var(--font-sans)', cursor: 'pointer' }}>{t('nav.fermer')}</button>
</div>
</>)}
{v.mForm && (<>
<form onSubmit={v.mSubmit} noValidate={v.yes} style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}><label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#2E3B4D' }}><span >{t('inscription.email')}</span>
<input ref={v.setMMail} name="email" type="email" autoComplete="email" maxLength={160} placeholder={t('auto.accueil.t15')} className="fm-in" aria-invalid={v.mMailBad} aria-describedby="ml-err" />
</label>
<input ref={v.setMTrap} name="site" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: '0' }} />
<label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', lineHeight: '1.5', color: '#2E3B4D', cursor: 'pointer' }}><input ref={v.setMNews} type="checkbox" style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: '#1C46C9', flexShrink: '0' }} />
<span >{t('auto.accueil.t33')}</span>
</label>
<label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13px', lineHeight: '1.5', color: '#4A5768', cursor: 'pointer' }}><input ref={v.setMOk} type="checkbox" style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: '#1C46C9', flexShrink: '0' }} />
<span >{t('auto.accueil.t34')}</span>
</label>
<div id="ml-err" role="alert" style={{ minHeight: '20px', fontSize: '14px', fontWeight: '500', color: '#0A0F17' }}>{v.mErr}</div>
<button type="submit" style={{ minHeight: '54px', border: '0', borderRadius: '999px', background: '#1C46C9', color: '#FFFFFF', font: '600 16px var(--font-sans)', cursor: 'pointer', opacity: v.mBtnOp }}>{v.mBtnTxt}</button>
</form>
</>)}
</div>
</div>
</>)}
<div className="pd-toast" role="status" aria-live="polite" style={{ position: 'fixed', left: '50%', bottom: '86px', zIndex: '210', transform: `translate(-50%, ${v.toastY})`, opacity: v.toastOp, pointerEvents: v.toastPE, display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 10px 10px 22px', minHeight: '48px', boxSizing: 'border-box', borderRadius: '999px', background: '#F5F8FC', color: '#0A0F17', fontSize: '15px', fontWeight: '500', boxShadow: '0 20px 50px -20px rgba(0,0,0,.6)', whiteSpace: 'nowrap' }}><span >{v.toast}</span>
{v.hasToastLink && (<>
<a href={v.toastHref} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '36px', padding: '0 16px', borderRadius: '999px', background: '#1C46C9', color: '#FFFFFF', fontWeight: '600', textDecoration: 'none' }}>{v.toastLabel}</a>
</>)}
</div>
<div ref={v.setIris} aria-hidden="true" style={{ position: 'fixed', inset: '0', zIndex: '200', pointerEvents: 'none', clipPath: 'circle(0px at 50% 50%)', background: 'radial-gradient(70% 70% at 50% 50%, #13223F 0%, #0A0F17 72%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg viewBox="-330 -470 660 940" width="70" height="100" aria-hidden="true" style={{ opacity: v.irisOp, transition: 'opacity .45s ease .3s' }}><g transform="skewX(-12)" fill="none" stroke="#9CC6FF" strokeWidth="18"><path d="M-270 0 a270 420 0 1 0 540 0 a270 420 0 1 0 -540 0 Z"></path>
<path d="M-250 0 H250"></path>
</g>
</svg>
</div>
</div>

  </>);
}
