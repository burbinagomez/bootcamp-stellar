"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/** The four silhouettes of the identity. Each starts at its base (0,0) and grows upwards. */
const FORMAS = {
  hoja: "M0 0C-9-12-10-30 0-46C10-30 9-12 0 0Z",
  brizna: "M0 0C-24-30-26-100 6-150C30-100 26-34 0 0Z",
  pasto: "M0 0C1-30 5-62 16-94C8-62 6-30 6 0Z",
  mata: "M0 0C-30-6-46-34-34-58C-24-76 0-74 0-60C0-74 24-76 34-58C46-34 30-6 0 0Z",
};

type Forma = keyof typeof FORMAS;

interface HojaProps {
  forma: Forma;
  x: number;
  y: number;
  r?: number;
  s?: number;
  fill?: string;
  /** Sway around the base; `retraso` in seconds de-syncs neighbours. */
  mece?: boolean;
  retraso?: number;
  /** Delay in seconds for unfolding from the base on mount. */
  aparece?: number;
}

export function Hoja({ forma, x, y, r = 0, s = 1, fill, mece, retraso = 0, aparece }: HojaProps) {
  const trazo = (
    <path
      d={FORMAS[forma]}
      fill={fill}
      className={mece ? "mece" : undefined}
      style={mece ? { animationDelay: `${-retraso}s`, animationDuration: `${6 + (retraso % 3)}s` } : undefined}
    />
  );

  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {aparece === undefined ? (
        trazo
      ) : (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: aparece, type: "spring", stiffness: 300, damping: 18 }}
          style={{ originX: 0.5, originY: 1 }}
        >
          {trazo}
        </motion.g>
      )}
    </g>
  );
}

/**
 * One depth layer: rises into place on mount (deeper layers first) and drifts
 * against the scroll by `profundidad` (0 = glued to the page, 1 = far away).
 */
function Capa({
  profundidad,
  orden,
  children,
}: {
  profundidad: number;
  orden: number;
  children: React.ReactNode;
}) {
  const reducir = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, reducir ? 0 : 500 * profundidad * 0.35]);

  return (
    <motion.g style={{ y }}>
      <motion.g
        initial={{ opacity: 0, y: 18 + 30 * (1 - profundidad) }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 * orden, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.g>
    </motion.g>
  );
}

/** Login hero: sun, two hills and a planted foreground. */
export function EscenaIngreso({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 342 230" className={className} aria-hidden="true">
      <Capa profundidad={1} orden={0}>
        <circle cx="258" cy="66" r="40" fill="var(--color-sol)" />
        <circle cx="258" cy="66" r="52" fill="var(--color-sol)" opacity="0.18" />
      </Capa>
      <Capa profundidad={0.6} orden={1}>
        <path d="M0 160C60 132 120 140 180 150C240 160 292 132 342 122V240H0Z" fill="#CFE0D2" />
        <g fill="#A8CBB1">
          <Hoja forma="brizna" x={70} y={178} r={-18} mece retraso={1} />
          <Hoja forma="brizna" x={86} y={182} r={16} s={0.85} mece retraso={2.4} />
          <Hoja forma="brizna" x={272} y={176} r={-8} s={0.7} mece retraso={0.6} />
        </g>
      </Capa>
      <Capa profundidad={0.3} orden={2}>
        <path d="M0 194C70 176 150 184 220 190C282 195 320 182 342 178V240H0Z" fill="#6FA884" />
        <g fill="#3F7D57">
          <Hoja forma="pasto" x={150} y={208} r={-20} s={0.6} mece retraso={0.4} />
          <Hoja forma="pasto" x={180} y={206} r={-12} s={0.8} mece retraso={1.3} />
          <Hoja forma="pasto" x={196} y={208} r={4} s={0.95} mece retraso={2.1} />
          <Hoja forma="pasto" x={212} y={206} r={-6} s={0.7} mece retraso={0.9} />
          <Hoja forma="pasto" x={226} y={208} r={12} s={0.85} mece retraso={2.7} />
          <Hoja forma="pasto" x={242} y={207} r={20} s={0.65} mece retraso={1.7} />
        </g>
      </Capa>
      <Capa profundidad={0} orden={3}>
        <g fill="#1E4D33">
          <Hoja forma="mata" x={300} y={222} r={-18} s={1.1} />
          <Hoja forma="mata" x={328} y={226} r={24} s={0.8} />
          <Hoja forma="brizna" x={16} y={230} r={28} s={0.8} mece retraso={1.1} />
          <Hoja forma="brizna" x={4} y={230} r={56} s={0.6} mece retraso={2.2} />
        </g>
        <g fill="var(--color-terracota)">
          <Hoja forma="hoja" x={274} y={224} r={-58} s={0.9} mece retraso={0.5} />
          <Hoja forma="hoja" x={44} y={226} r={40} s={0.8} mece retraso={1.9} />
        </g>
        <path d="M0 220C120 212 230 216 342 214V232H0Z" fill="#1E4D33" />
      </Capa>
    </svg>
  );
}

/** Public verification hero: same land, with orchard trees. */
export function EscenaVerificacion({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 390 210" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <Capa profundidad={1} orden={0}>
        <circle cx="300" cy="62" r="34" fill="var(--color-sol)" />
        <circle cx="300" cy="62" r="46" fill="var(--color-sol)" opacity="0.2" />
      </Capa>
      <Capa profundidad={0.6} orden={1}>
        <path d="M0 130C70 104 150 112 220 124C290 136 340 110 390 102V220H0Z" fill="#C6DCCB" />
        <g fill="#8DBB9C">
          <circle cx="84" cy="100" r="26" />
          <circle cx="64" cy="112" r="18" />
          <circle cx="104" cy="112" r="20" />
          <rect x="81" y="116" width="6" height="28" />
          <circle cx="200" cy="112" r="18" />
          <circle cx="186" cy="120" r="12" />
          <circle cx="214" cy="120" r="13" />
          <rect x="198" y="122" width="4" height="22" />
          <circle cx="350" cy="104" r="16" />
          <circle cx="338" cy="112" r="11" />
          <circle cx="362" cy="112" r="12" />
          <rect x="348" y="114" width="4" height="22" />
        </g>
      </Capa>
      <Capa profundidad={0.3} orden={2}>
        <path d="M0 165C90 146 170 152 250 160C320 167 360 156 390 152V220H0Z" fill="#6FA884" />
        <g fill="#3F7D57">
          <Hoja forma="pasto" x={130} y={182} r={-16} s={0.55} mece retraso={0.3} />
          <Hoja forma="pasto" x={160} y={180} r={-4} s={0.65} mece retraso={1.4} />
          <Hoja forma="pasto" x={190} y={182} r={10} s={0.55} mece retraso={2.2} />
          <Hoja forma="pasto" x={220} y={180} r={-8} s={0.6} mece retraso={0.8} />
          <Hoja forma="pasto" x={250} y={182} r={16} s={0.5} mece retraso={1.9} />
          <Hoja forma="pasto" x={280} y={181} r={-12} s={0.55} mece retraso={2.6} />
        </g>
      </Capa>
      <Capa profundidad={0} orden={3}>
        <g fill="#1E4D33">
          <Hoja forma="brizna" x={-6} y={214} r={40} s={0.8} mece retraso={1.2} />
          <Hoja forma="mata" x={356} y={214} r={-18} s={1.1} />
          <Hoja forma="mata" x={386} y={216} r={22} s={0.8} />
          <Hoja forma="brizna" x={300} y={216} r={-30} s={0.5} mece retraso={2} />
        </g>
        <Hoja forma="hoja" x={330} y={210} r={-52} s={0.9} fill="var(--color-terracota)" mece retraso={0.7} />
      </Capa>
    </svg>
  );
}

/** Branch hanging from the top-right corner of the actor screens. It grows in on mount. */
export function RamaEsquina({ className }: { className?: string }) {
  const hojasClaras: [number, number, number, number?][] = [
    [144, 12, -75],
    [136, 24, 165],
    [126, 38, -85],
    [118, 52, 175],
    [111, 68, -95, 0.85],
    [106, 82, 185, 0.75],
    [102, 96, -160, 0.7],
  ];
  const hojasOscuras: [number, number, number, number][] = [
    [152, 62, -60, 0.7],
    [145, 78, 150, 0.7],
    [140, 96, -70, 0.65],
    [137, 112, 160, 0.6],
  ];

  return (
    <svg width="160" height="140" viewBox="0 0 160 140" className={className} aria-hidden="true">
      <Hoja forma="brizna" x={168} y={6} r={-128} s={0.9} fill="#DCE8DE" />
      <Hoja forma="brizna" x={162} y={70} r={-100} s={0.7} fill="#E3ECE3" />
      <motion.path
        d="M160 0C132 22 112 52 102 96"
        stroke="#9CC4A7"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <g fill="#9CC4A7">
        {hojasClaras.map(([x, y, r, s], i) => (
          <Hoja key={i} forma="hoja" x={x} y={y} r={r} s={s} mece retraso={i * 0.7} aparece={0.12 + i * 0.08} />
        ))}
      </g>
      <motion.path
        d="M160 50C146 70 138 92 136 124"
        stroke="#4F8F66"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.25, duration: 0.8, ease: "easeOut" }}
      />
      <g fill="#4F8F66">
        {hojasOscuras.map(([x, y, r, s], i) => (
          <Hoja key={i} forma="hoja" x={x} y={y} r={r} s={s} mece retraso={1 + i * 0.9} aparece={0.4 + i * 0.08} />
        ))}
      </g>
      <Hoja forma="hoja" x={122} y={22} r={-120} s={0.55} fill="var(--color-terracota)" mece retraso={2} />
      <g fill="var(--color-ocre)">
        <circle cx="96" cy="44" r="4" />
        <circle cx="104" cy="30" r="3" />
        <circle cx="90" cy="60" r="2.5" />
      </g>
    </svg>
  );
}

/** Night field at the bottom of the QR screen, with fireflies. */
export function EscenaNoche({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 390 250" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <Capa profundidad={0.7} orden={0}>
        <path d="M0 100C80 70 160 80 240 94C310 106 350 86 390 78V260H0Z" fill="#1B2A21" />
        <g fill="#22402E">
          <Hoja forma="brizna" x={60} y={132} r={-16} s={1.1} mece retraso={0.8} />
          <Hoja forma="brizna" x={92} y={138} r={18} mece retraso={2.1} />
          <Hoja forma="brizna" x={318} y={122} r={-10} s={0.9} mece retraso={1.4} />
          <Hoja forma="brizna" x={350} y={128} r={22} s={0.8} mece retraso={0.2} />
        </g>
      </Capa>
      <Capa profundidad={0.35} orden={1}>
        <path d="M0 160C90 138 180 146 260 156C330 164 370 150 390 146V260H0Z" fill="#1F3628" />
        <g fill="#2E5A40">
          <Hoja forma="pasto" x={120} y={176} r={-18} s={0.7} mece retraso={0.5} />
          <Hoja forma="pasto" x={150} y={174} r={-6} s={0.9} mece retraso={1.6} />
          <Hoja forma="pasto" x={176} y={176} r={8} s={0.75} mece retraso={2.4} />
          <Hoja forma="pasto" x={206} y={174} r={-10} s={0.85} mece retraso={0.9} />
          <Hoja forma="pasto" x={236} y={176} r={14} s={0.7} mece retraso={1.9} />
          <Hoja forma="pasto" x={262} y={175} r={22} s={0.6} mece retraso={2.8} />
        </g>
      </Capa>
      <Capa profundidad={0} orden={2}>
        <g fill="var(--color-menta)">
          <Hoja forma="hoja" x={300} y={214} r={-40} s={0.7} mece retraso={1} />
          <Hoja forma="hoja" x={86} y={216} r={36} s={0.6} mece retraso={2.3} />
        </g>
        <g fill="#0C140F">
          <Hoja forma="mata" x={40} y={252} r={18} s={1.3} />
          <Hoja forma="mata" x={362} y={252} r={-20} s={1.2} />
          <Hoja forma="brizna" x={204} y={252} r={4} s={0.6} />
        </g>
        <path d="M0 222C120 212 260 218 390 214V252H0Z" fill="#0C140F" />
      </Capa>
      <Luciernagas
        puntos={[
          [64, 156, 4],
          [74, 166, 3],
          [330, 150, 3.5],
          [190, 120, 2.5],
        ]}
      />
    </svg>
  );
}

/** Dark garden at the foot of the admin sidebar. */
export function EscenaPanel({ className }: { className?: string }) {
  return (
    <svg width="240" height="300" viewBox="0 0 240 300" className={className} aria-hidden="true">
      <g fill="#1D3125">
        <Hoja forma="brizna" x={40} y={300} r={-14} s={1.4} mece retraso={0.4} />
        <Hoja forma="brizna" x={180} y={300} r={20} s={1.2} mece retraso={1.8} />
      </g>
      <g fill="#24432F">
        <Hoja forma="brizna" x={100} y={300} r={6} s={1.1} mece retraso={2.6} />
        <Hoja forma="mata" x={30} y={300} r={-24} s={1.1} />
      </g>
      <g fill="#2E5A40">
        <Hoja forma="pasto" x={140} y={300} r={-10} s={1.1} mece retraso={1.1} />
        <Hoja forma="pasto" x={160} y={300} r={12} s={0.9} mece retraso={2.2} />
        <Hoja forma="mata" x={220} y={302} r={18} s={0.9} />
      </g>
      <g fill="var(--color-menta)">
        <Hoja forma="hoja" x={70} y={250} r={-40} s={0.6} mece retraso={0.9} />
        <Hoja forma="hoja" x={196} y={236} r={30} s={0.55} mece retraso={2} />
      </g>
      <Luciernagas
        puntos={[
          [120, 170, 4],
          [130, 182, 3],
          [60, 140, 2.5],
        ]}
      />
    </svg>
  );
}

/** Small foliage tucked into the bottom-right of the producer stats card. */
export function EscenaTarjeta({ className }: { className?: string }) {
  return (
    <svg width="180" height="96" viewBox="0 0 180 96" className={className} aria-hidden="true">
      <Hoja forma="brizna" x={150} y={110} r={-28} s={0.75} fill="#1F3327" />
      <Hoja forma="brizna" x={178} y={104} r={-58} s={0.6} fill="#22402E" />
      <Hoja forma="mata" x={118} y={104} r={-14} s={0.75} fill="#2B4A37" />
      <Hoja forma="hoja" x={178} y={70} r={-70} s={0.8} fill="#3F7D57" mece retraso={1.2} />
      <Luciernagas puntos={[[132, 40, 3]]} />
    </svg>
  );
}

/** Leaves around the photo drop zone. */
export function EscenaFoto({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 350 150" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <g fill="#E3EDE4">
        <Hoja forma="brizna" x={10} y={165} r={30} s={0.8} />
        <Hoja forma="brizna" x={44} y={165} r={8} s={0.6} />
        <Hoja forma="brizna" x={356} y={-10} r={200} s={0.6} />
      </g>
      <g fill="#BFD8C5">
        <Hoja forma="hoja" x={28} y={152} r={42} mece retraso={0.6} />
        <Hoja forma="hoja" x={58} y={152} r={-10} s={0.8} mece retraso={1.7} />
        <Hoja forma="mata" x={84} y={156} r={18} s={0.55} />
        <Hoja forma="hoja" x={336} y={-2} r={205} />
        <Hoja forma="hoja" x={318} y={-2} r={160} s={0.8} />
      </g>
      <Hoja forma="hoja" x={346} y={152} r={-40} s={0.7} fill="var(--color-sol)" />
      <Hoja forma="hoja" x={6} y={40} r={70} s={0.5} fill="var(--color-terracota)" />
    </svg>
  );
}

function Luciernagas({ puntos }: { puntos: [number, number, number][] }) {
  return (
    <g fill="var(--color-ocre)">
      {puntos.map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          className="motion-safe:animate-titilar"
          style={{ animationDelay: `${-i * 1.1}s` }}
        />
      ))}
    </g>
  );
}
