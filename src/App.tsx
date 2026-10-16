import { useEffect, useState } from 'react'
import PrismaticSlats from '@/components/PrismaticSlats/PrismaticSlats'
import wall from './photos.html?raw'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        const el = en.target as HTMLElement
        const sib = Array.from(el.parentElement?.querySelectorAll(':scope > .reveal') ?? [])
        el.style.transitionDelay = `${Math.min(sib.indexOf(el), 6) * 80}ms`
        el.classList.add('in'); io.unobserve(el)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
}

function useWallPhoto(index: number) {
  const [src, setSrc] = useState<string>()
  useEffect(() => {
    const doc = new DOMParser().parseFromString(wall, 'text/html')
    const img = doc.querySelectorAll('img')[index]
    if (img) setSrc(img.getAttribute('src') ?? undefined)
  }, [index])
  return src
}

const Label = ({ children }: { children: string }) => (
  <div className="reveal text-xs font-medium tracking-[.16em] uppercase text-[var(--color-accent)] mb-5">{children}</div>
)
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="reveal font-serif text-[clamp(32px,4.6vw,52px)] leading-[1.08] tracking-tight mb-10 max-w-[20ch]">{children}</h2>
)

export default function App() {
  useReveal()
  const [open, setOpen] = useState(false)
  const haloPhoto = useWallPhoto(5)
  const nav = ['About','Experience','Projects','Proof','Recognition']

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--color-bg)]/75 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 h-[62px] flex items-center justify-between">
          <a href="#top" className="font-serif text-[22px]">Dev Bhodia</a>
          <nav className="hidden md:flex gap-6 text-sm text-[var(--color-ink-2)]">
            {nav.map(s => <a key={s} href={`#${s.toLowerCase()}`} className="hover:text-[var(--color-ink)] transition">{s}</a>)}
            <a href="/Dev_Bhodia_CV.pdf" className="hover:text-[var(--color-ink)] transition">CV ↗</a>
          </nav>
          <button className="md:hidden text-sm border border-[var(--color-line-2)] rounded-md px-3 py-1.5" onClick={() => setOpen(o => !o)} aria-expanded={open}>Menu</button>
        </div>
        {open && (
          <nav className="md:hidden border-t border-[var(--color-line)] px-5 py-3 flex flex-col text-[var(--color-ink-2)]">
            {nav.map(s => <a key={s} href={`#${s.toLowerCase()}`} className="py-2.5" onClick={() => setOpen(false)}>{s}</a>)}
            <a href="/Dev_Bhodia_CV.pdf" className="py-2.5">CV ↗</a>
          </nav>
        )}
      </header>

      <main>
        <section id="top" className="relative min-h-[82vh] md:min-h-[88vh] flex items-center overflow-hidden">
          <PrismaticSlats
            className="absolute inset-0"
            backgroundColor="#070708"
            colors={['#5B4FFF', '#D042FF']}
            angle={31} flutes={8} refraction={4} aberration={0.61} softness={0.5}
            wave={0.06} waveFrequency={1.5} highlight={0.12} highlightSoftness={0.3}
            lightAngle={-90} radius={6.5} momentum={13} intensity={1} trail={1}
            grain={0.05} speed={1} interactive
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/20 via-[var(--color-bg)]/30 to-[var(--color-bg)] pointer-events-none" />
          <div className="relative w-full max-w-[1120px] mx-auto px-5 md:px-7 py-16 md:py-20 pointer-events-none">
            <div className="rise text-[12px] md:text-[13px] tracking-[.14em] uppercase text-[var(--color-ink-2)] mb-5 md:mb-7">Dubai · BEng Computer and Autonomous Systems · 2027</div>
            <h1 className="rise [animation-delay:.12s] font-serif text-[clamp(40px,8vw,96px)] leading-[.98] tracking-tight mb-6 max-w-[14ch]">
              Engineering where <em className="text-[var(--color-accent)]">wireless, hardware and AI</em> meet.
            </h1>
            <p className="rise [animation-delay:.24s] text-[17px] md:text-[19px] text-[var(--color-ink-2)] max-w-[50ch] mb-8">
              Published IEEE author on Wi-Fi sensing. RF and antenna designer. Founder of Vantage Vision, an assistive wearable built and tested with blind users.
            </p>
            <div className="rise [animation-delay:.36s] flex gap-3 flex-wrap pointer-events-auto">
              <a href="#projects" className="px-6 py-3 rounded-full bg-[var(--color-ink)] text-black font-medium hover:bg-[var(--color-accent)] transition">See the work</a>
              <a href="#contact" className="px-6 py-3 rounded-full border border-[var(--color-line-2)] font-medium hover:border-[var(--color-ink-2)] transition">Get in touch</a>
            </div>
          </div>
        </section>

        <div className="marquee border-y border-[var(--color-line)] bg-[var(--color-bg-2)] overflow-hidden py-4" aria-hidden>
          <div className="marquee-track flex gap-14 w-max whitespace-nowrap text-xs md:text-sm tracking-[.08em] uppercase text-[var(--color-ink-2)]">
            {[0,1].map(i => (
              <span key={i} className="flex gap-14">
                <span><b className="text-[var(--color-ink)] font-medium">IEEE ICEEE 2025</b> · first-author paper</span>
                <span><b className="text-[var(--color-ink)] font-medium">AED 50,000</b> · Expo City Dubai grant</span>
                <span><b className="text-[var(--color-ink)] font-medium">Red Bull Basement</b> · UAE winner, World Finalist</span>
                <span><b className="text-[var(--color-ink)] font-medium">SpacePoint</b> · CubeSat avionics</span>
                <span><b className="text-[var(--color-ink)] font-medium">UOWD</b> · antenna research</span>
              </span>
            ))}
          </div>
        </div>

        <section id="about" className="py-20 md:py-28 border-t border-[var(--color-line)]">
          <div className="max-w-[1120px] mx-auto px-5 md:px-7 grid md:grid-cols-[1.1fr_.9fr] gap-10 md:gap-16">
            <div>
              <Label>About</Label>
              <H2>Hardware that has to work <em className="text-[var(--color-ink-2)]">in front of the person who needs it.</em></H2>
              <p className="reveal text-lg text-[var(--color-ink-2)] mb-4">Final-year engineering student at the University of Wollongong in Dubai. I've built CubeSat avionics, designed wearable antennas, and lead the hardware and AI behind Halo at Vantage Vision.</p>
              <p className="reveal text-lg text-[var(--color-ink-2)]">I check the design against the requirement before anything gets built, test it with the people it's for, and keep the records straight.</p>
            </div>
            <dl className="reveal text-[15px]">
              {[
                ['Degree','BEng, Computer and Autonomous Systems','UOWD · June 2027'],
                ['Training','AI and Cybersecurity Track','Khalifa University · 2026'],
                ['Languages','Python, MATLAB, ROS 2',''],
                ['Open to','Internships and research in hardware, wireless, energy and assistive tech',''],
              ].map(([k,v,s]) => (
                <div key={k} className="grid grid-cols-[100px_1fr] gap-4 py-4 border-t border-[var(--color-line)] last:border-b">
                  <dt className="text-[var(--color-ink-3)]">{k}</dt>
                  <dd><b className="font-medium block">{v}</b>{s && <span className="text-[var(--color-ink-2)]">{s}</span>}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="py-20 md:py-28 border-t border-[var(--color-line)]">
          <div className="max-w-[1120px] mx-auto px-5 md:px-7">
            <Label>Publication</Label>
            <div className="reveal border border-[var(--color-line-2)] rounded-2xl p-6 md:p-10 grid md:grid-cols-[auto_1fr] gap-5 md:gap-7 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent">
              <span className="self-start text-[11px] font-semibold tracking-[.12em] uppercase bg-[var(--color-accent)] text-black px-2.5 py-1.5 rounded-md">IEEE · 2025</span>
              <div>
                <h3 className="font-serif text-[22px] md:text-[26px] leading-tight mb-3">Attention-enhanced CNN with wavelet denoising for through-wall human activity recognition using Wi-Fi CSI</h3>
                <p className="text-[var(--color-ink-2)]">Wi-Fi channel state information used as a device-free sensor to recognise human activity through walls.</p>
                <div className="text-[13.5px] text-[var(--color-ink-3)] mt-4">D. Bhodia, A. Elkhouly, M. F. A. Malek · ICEEE 2025</div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="py-20 md:py-28 border-t border-[var(--color-line)]">
          <div className="max-w-[1120px] mx-auto px-5 md:px-7">
            <Label>Experience</Label>
            <H2>From startup <em className="text-[var(--color-ink-2)]">to spacecraft.</em></H2>
            {[
              ['Vantage Vision','Founder and Lead Engineer','Apr 2025 — Present','Leading Halo from concept to field testing','Hardware, embedded and AI for an assistive wearable: cameras, LiDAR and time-of-flight sensors on a Raspberry Pi CM5, tested with users at Al Noor CRID. AED 50,000 grant from Expo City Dubai Foundation; featured in Khaleej Times.'],
              ['SpacePoint','Embedded Systems Intern','Jul 2025 — Jul 2026','CubeSat command and data handling','FPGA and MCU integration, PCB design and fabrication, subsystem testing and validation for the CDHS.'],
              ['UOWD','Antenna Engineering Intern','Jun 2025 — Jan 2026','Wearable antenna design','Full-wave EM simulation and bench testing: return loss, gain, efficiency, on-body detuning.'],
              ['UOWD','Engineering Peer Tutor','Oct 2024 — Jan 2026','Teaching core subjects','Mentored engineering students in technical subjects and lab work.'],
            ].map(([org,role,when,title,body]) => (
              <article key={title} className="reveal grid md:grid-cols-[200px_1fr] gap-2 md:gap-8 py-7 border-t border-[var(--color-line)] last:border-b">
                <div className="text-sm text-[var(--color-ink-3)]"><b className="block text-[var(--color-ink)] font-medium">{org}</b>{role} · {when}</div>
                <div><h3 className="text-lg font-semibold">{title}</h3><p className="text-[var(--color-ink-2)] mt-2">{body}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="py-20 md:py-28 border-t border-[var(--color-line)]">
          <div className="max-w-[1120px] mx-auto px-5 md:px-7">
            <Label>Projects</Label>
            <H2>Selected <em className="text-[var(--color-ink-2)]">work.</em></H2>
            <div className="grid md:grid-cols-3 gap-4">
              <article className="reveal md:col-span-3 bg-[var(--color-bg-2)] border border-[var(--color-line)] rounded-2xl overflow-hidden grid md:grid-cols-[1.1fr_.9fr] transition hover:-translate-y-1.5 hover:border-[var(--color-line-2)]">
                <div className="p-6 md:p-8 flex flex-col gap-3 order-2 md:order-1">
                  <div className="text-xs font-medium text-[var(--color-accent)] tracking-[.1em] uppercase">Vantage Vision · Grant funded</div>
                  <h3 className="font-serif text-[28px] md:text-[34px] leading-tight">Halo — assistive wearable</h3>
                  <p className="text-[var(--color-ink-2)] flex-1">Head-worn device giving blind and visually impaired users spatial awareness, obstacle detection, instant text recognition, live GPS and SOS. On-device AI with audio and haptic feedback. Built with Al Noor CRID; incubated at the Expo City Dubai Changemakers Academy.</p>
                  <div className="flex flex-wrap gap-1.5">{['Object detection','OCR','LiDAR','Edge AI','Mobile app'].map(s => <span key={s} className="text-xs border border-[var(--color-line-2)] rounded-full px-2.5 py-1 text-[var(--color-ink-2)]">{s}</span>)}</div>
                </div>
                <div className="order-1 md:order-2 aspect-[16/10] md:aspect-auto md:min-h-[320px] bg-[var(--color-bg)]">
                  {haloPhoto && <img src={haloPhoto} alt="Demonstrating the Vantage Vision prototype at the AccessAbilities Expo" className="w-full h-full object-cover" />}
                </div>
              </article>
              {[
                ['Research · ICEEE 2025','Wi-Fi CSI activity recognition','Through-wall sensing with wavelet denoising and an attention-enhanced CNN.',['Deep learning','Signal processing']],
                ['Energy · SREO Top 5','Kilmara','Edge AI predicting HVAC behaviour from a five-parameter sensor model, no cloud dependence.',['Edge AI','Embedded sensing']],
                ['Biomedical · Project of Excellence','ExoHand','EMG-controlled assistive hand for stroke rehab, paired with a mixed-reality therapy game.',['EMG','Mixed reality']],
                ['RF · UOWD','Wearable antenna','Designed, simulated and tested for biomedical and wireless use.',['Antenna design','EM simulation']],
                ['Aerospace · SpacePoint','CubeSat CDHS','FPGA and MCU integration, PCBs and subsystem testing for a flight computer.',['FPGA','MCU','PCB']],
              ].map(([tag,title,body,stack]) => (
                <article key={title as string} className="reveal bg-[var(--color-bg-2)] border border-[var(--color-line)] rounded-2xl p-6 md:p-7 flex flex-col gap-3 transition hover:-translate-y-1.5 hover:border-[var(--color-line-2)]">
                  <div className="text-xs font-medium text-[var(--color-accent)] tracking-[.1em] uppercase">{tag as string}</div>
                  <h3 className="text-xl font-semibold">{title as string}</h3>
                  <p className="text-[var(--color-ink-2)] flex-1">{body as string}</p>
                  <div className="flex flex-wrap gap-1.5">{(stack as string[]).map(s => <span key={s} className="text-xs border border-[var(--color-line-2)] rounded-full px-2.5 py-1 text-[var(--color-ink-2)]">{s}</span>)}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="py-20 md:py-28 border-t border-[var(--color-line)]">
          <div className="max-w-[1120px] mx-auto px-5 md:px-7">
            <Label>Proof</Label>
            <H2>Stages, panels, <em className="text-[var(--color-ink-2)]">and the users the work is for.</em></H2>
            <div className="reveal" dangerouslySetInnerHTML={{ __html: wall }} />
          </div>
        </section>

        <section id="recognition" className="py-20 md:py-28 border-t border-[var(--color-line)]">
          <div className="max-w-[1120px] mx-auto px-5 md:px-7">
            <Label>Recognition</Label>
            <ul>
              {[
                ['2026','SREO Program — Top 5','MBR Centre for Government Innovation, for Kilmara'],
                ['2026','Red Bull Basement — UAE Winner, World Finalist','San Francisco'],
                ['2026','MBR Innovation Trailblazers — 3rd Place','AED 15,000'],
                ['2026','Emerging Project of Excellence','UOWD, for ExoHand'],
                ['2025','Golden Shield — Tolerance Shield Contest','UAE Ministry of Tolerance and Coexistence, as Society President'],
                ['2025','Expo Changemakers Academy','Selected from 148 · AED 50,000 grant'],
                ['2025','Innovation Fair Runner-up','UOWD, two Platinum Awards'],
                ['Press','Khaleej Times · MENA FN','Vantage Vision coverage'],
              ].map(([y,t,s]) => (
                <li key={t} className="reveal grid md:grid-cols-[100px_1fr] gap-1 md:gap-5 py-4 border-t border-[var(--color-line)] last:border-b">
                  <div className="text-sm text-[var(--color-ink-3)]">{y}</div>
                  <div><b className="font-medium">{t}</b><span className="block text-[var(--color-ink-2)] text-[14.5px]">{s}</span></div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="py-20 md:py-28 border-t border-[var(--color-line)]">
          <div className="max-w-[1120px] mx-auto px-5 md:px-7">
            <Label>Contact</Label>
            <h2 className="reveal font-serif text-[clamp(38px,7vw,88px)] leading-[1.05] tracking-tight max-w-[14ch] mb-8">Let's build <em className="text-[var(--color-ink-2)]">something real.</em></h2>
            <p className="reveal text-lg text-[var(--color-ink-2)] max-w-[50ch] mb-10">Open to internships, research and collaborations in hardware, wireless, energy and assistive technology.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                ['Email','devbhodia17@gmail.com','mailto:devbhodia17@gmail.com'],
                ['Phone','+971 55 785 7806','tel:+971557857806'],
                ['LinkedIn','linkedin.com/in/devbhodia','https://www.linkedin.com/in/devbhodia'],
                ['CV','Download PDF','/Dev_Bhodia_CV.pdf'],
              ].map(([k,v,h]) => (
                <a key={k} href={h} className="reveal border border-[var(--color-line-2)] rounded-xl px-5 py-4 flex justify-between items-center transition hover:-translate-y-1 hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-2)]">
                  <div className="min-w-0"><small className="block text-[11px] tracking-[.12em] uppercase text-[var(--color-ink-3)] mb-1">{k}</small><b className="font-medium break-all">{v}</b></div><span className="ml-3">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-line)] text-[var(--color-ink-3)] text-[13.5px]">
        <div className="max-w-[1120px] mx-auto px-5 md:px-7 py-6 flex justify-between flex-wrap gap-2"><span>© 2026 Dev Bhodia · Dubai</span><span>Rev. 2026.10</span></div>
      </footer>
    </>
  )
}