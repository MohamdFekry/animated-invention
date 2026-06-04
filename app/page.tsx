import type { ReactNode } from "react";

const fleetRows = [
  {
    name: "Almajaz",
    controlCpo: 1017,
    controlTasks: "62,929",
    treatmentCpo: 971,
    treatmentTasks: "107,885",
    diff: -47,
    controlMix: 38.8,
    treatmentMix: 33.7,
    color: "bg-emerald-500",
  },
  {
    name: "Karama",
    controlCpo: 1006,
    controlTasks: "57,257",
    treatmentCpo: 954,
    treatmentTasks: "113,333",
    diff: -52,
    controlMix: 35.3,
    treatmentMix: 35.4,
    color: "bg-cyan-500",
  },
  {
    name: "Marina",
    controlCpo: 1119,
    controlTasks: "41,900",
    treatmentCpo: 1073,
    treatmentTasks: "99,125",
    diff: -46,
    controlMix: 25.9,
    treatmentMix: 30.9,
    color: "bg-amber-500",
  },
];

const methodCards = [
  {
    label: "CUPED",
    title: "Compare every bucket against its historical expectation.",
    point: "Useful when hour, weekday, fleet, or load history predicts the metric.",
    metric: "Raw +18 min",
    result: "Adjusted -2 min",
  },
  {
    label: "CIs",
    title: "Show the likely range, not only the point estimate.",
    point: "A positive-looking estimate is not actionable if the interval crosses zero.",
    metric: "Estimate +1.2 min",
    result: "CI +0.4 to +2.0",
  },
  {
    label: "Adjusted Regression",
    title: "Compare treatment and control inside similar conditions.",
    point: "Protects fleet-level slices from hour, day, load, and volume imbalance.",
    metric: "Raw +4.7 min worse",
    result: "Adjusted about -2 min",
  },
  {
    label: "MLM",
    title: "Pool information across fleets when some slices are small.",
    point: "Powerful, but harder to explain. Keep it for a later, advanced version.",
    metric: "Observed Fleet C -8",
    result: "MLM maybe -3",
  },
];

const flowSteps = [
  "Filter experiment data",
  "Show fleet/hour and load-factor imbalance diagnostics",
  "Compute task-count weighted averages",
  "Put fleet-level results before global numbers",
  "Add confidence intervals",
  "Add CUPED-adjusted results",
  "Use adjusted regression for fleet-level slices",
  "Keep MLM as an advanced future option",
];

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{note}</p>
    </div>
  );
}

function MixBar({ type }: { type: "control" | "treatment" }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold capitalize text-slate-800">{type}</span>
        <span className="text-slate-500">
          {type === "control" ? "162,086 tasks" : "320,343 tasks"}
        </span>
      </div>
      <div className="flex h-9 overflow-hidden border border-slate-200 bg-white">
        {fleetRows.map((fleet) => (
          <div
            key={fleet.name}
            className={`${fleet.color} flex items-center justify-center text-xs font-semibold text-white`}
            style={{
              width: `${
                type === "control" ? fleet.controlMix : fleet.treatmentMix
              }%`,
            }}
            title={`${fleet.name}: ${
              type === "control" ? fleet.controlMix : fleet.treatmentMix
            }%`}
          >
            {type === "control" ? fleet.controlMix : fleet.treatmentMix}%
          </div>
        ))}
      </div>
    </div>
  );
}

function CiStrip({
  title,
  left,
  right,
  estimate,
  interpretation,
}: {
  title: string;
  left: string;
  right: string;
  estimate: string;
  interpretation: string;
}) {
  return (
    <div className="border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-semibold text-slate-950">{title}</h4>
        <p className="text-sm text-slate-500">{interpretation}</p>
      </div>
      <div className="mt-5">
        <div className="relative h-10">
          <div className="absolute left-0 right-0 top-5 h-1 bg-slate-200" />
          <div className="absolute left-[30%] top-3 h-5 w-px bg-slate-400" />
          <div className="absolute left-[55%] top-5 h-1 w-[34%] bg-emerald-500" />
          <div className="absolute left-[71%] top-2 h-7 w-2 bg-emerald-700" />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{left}</span>
          <span>zero</span>
          <span>{right}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-800">{estimate}</p>
    </div>
  );
}

function ConceptHeader({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase text-teal-700">{kicker}</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
        {children}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-8 lg:px-10">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase text-teal-700">
              E2 Analysis Recommendations
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
              Make experiment results explain themselves.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              A practical guide to reading switchback experiments with adjusted
              regression, CUPED, confidence intervals, and MLM. Every concept
              starts from the same concrete question: did treatment really help?
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Stat
                label="Global CPO"
                value="-44 fils"
                note="Treatment improved globally"
              />
              <Stat
                label="Fleet diffs"
                value="-46 to -52"
                note="Every fleet improved more"
              />
              <Stat
                label="Why"
                value="+5.0 pts"
                note="Treatment had more Marina mix"
              />
            </div>
          </div>

          <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  The mix puzzle
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Marina is the highest-cost fleet, and treatment had more of
                  it.
                </p>
              </div>
              <div className="bg-amber-100 px-3 py-2 text-right">
                <p className="text-xs font-semibold uppercase text-amber-800">
                  Marina mix
                </p>
                <p className="text-lg font-semibold text-amber-950">
                  25.9% to 30.9%
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <MixBar type="control" />
              <MixBar type="treatment" />
            </div>

            <div className="mt-6 grid gap-2 text-sm sm:grid-cols-3">
              {fleetRows.map((fleet) => (
                <div key={fleet.name} className="border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 ${fleet.color}`} />
                    <p className="font-semibold text-slate-950">{fleet.name}</p>
                  </div>
                  <p className="mt-2 text-slate-600">
                    {fleet.controlCpo} to {fleet.treatmentCpo} fils
                  </p>
                  <p className="mt-1 font-semibold text-emerald-700">
                    {fleet.diff} fils
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">
              Start Here
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Global results are weighted averages of different task mixes.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The global treatment result can be smaller than every fleet-level
              result because the control and treatment groups do not contain the
              same proportions of each fleet. This is a Simpson&apos;s-paradox-style
              aggregation effect.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Stat
              label="Control weighted CPO"
              value="1039.5"
              note="(fleet CPO x tasks) / control tasks"
            />
            <Stat
              label="Treatment weighted CPO"
              value="996.5"
              note="(fleet CPO x tasks) / treatment tasks"
            />
            <Stat
              label="Weighted diff"
              value="-43.0"
              note="Close to the displayed -44 fils"
            />
          </div>
        </div>

        <div className="mt-8 overflow-x-auto border border-slate-200 bg-white shadow-sm">
          <div className="grid min-w-[780px] grid-cols-[1.1fr_repeat(5,1fr)] border-b border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
            <span>Fleet</span>
            <span>Control CPO</span>
            <span>Control tasks</span>
            <span>Treatment CPO</span>
            <span>Treatment tasks</span>
            <span>Fleet diff</span>
          </div>
          {fleetRows.map((fleet) => (
            <div
              key={fleet.name}
              className="grid min-w-[780px] grid-cols-[1.1fr_repeat(5,1fr)] border-b border-slate-100 px-4 py-4 text-sm last:border-b-0"
            >
              <span className="font-semibold text-slate-950">{fleet.name}</span>
              <span>{fleet.controlCpo}</span>
              <span>{fleet.controlTasks}</span>
              <span>{fleet.treatmentCpo}</span>
              <span>{fleet.treatmentTasks}</span>
              <span className="font-semibold text-emerald-700">
                {fleet.diff} fils
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase text-teal-300">
            The Toolkit
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-semibold md:text-4xl">
            Four methods, one product principle: compare like with like and show
            uncertainty.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {methodCards.map((card) => (
              <article
                key={card.label}
                className="border border-white/15 bg-white/8 p-5"
              >
                <p className="text-sm font-semibold text-teal-300">
                  {card.label}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {card.point}
                </p>
                <div className="mt-5 border border-white/15 bg-black/20 p-3">
                  <p className="text-sm text-slate-300">{card.metric}</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {card.result}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cuped" className="mx-auto max-w-7xl px-5 py-14 md:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <ConceptHeader kicker="CUPED" title="Ask how each bucket performed versus history.">
            Raw comparisons can punish treatment for landing in harder hours.
            CUPED subtracts an expected baseline first, then compares treatment
            and control residuals.
          </ConceptHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">
                Raw comparison
              </h3>
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Control quiet hour</span>
                    <span>23 min</span>
                  </div>
                  <div className="mt-2 h-4 bg-slate-200">
                    <div className="h-4 w-[38%] bg-cyan-500" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Treatment dinner peak</span>
                    <span>41 min</span>
                  </div>
                  <div className="mt-2 h-4 bg-slate-200">
                    <div className="h-4 w-[68%] bg-rose-500" />
                  </div>
                </div>
              </div>
              <p className="mt-5 text-2xl font-semibold text-rose-700">
                Treatment looks +18 min worse
              </p>
            </div>

            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">
                CUPED view
              </h3>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center justify-between border border-slate-200 p-3">
                  <span>Control: 23 - 22 baseline</span>
                  <span className="font-semibold text-rose-700">+1 min</span>
                </div>
                <div className="flex items-center justify-between border border-slate-200 p-3">
                  <span>Treatment: 41 - 42 baseline</span>
                  <span className="font-semibold text-emerald-700">-1 min</span>
                </div>
              </div>
              <p className="mt-5 text-2xl font-semibold text-emerald-700">
                Treatment looks about 2 min better
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cis" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
          <ConceptHeader kicker="Confidence Intervals" title="Separate promising from conclusive.">
            A point estimate says what happened in the sample. A confidence
            interval shows the range of effects still compatible with the data.
            For switchbacks, calculate it from buckets, not naive task-level
            independence.
          </ConceptHeader>

          <div className="grid gap-4">
            <CiStrip
              title="Conclusive example"
              left="-1 min"
              right="+3 min"
              estimate="Treatment improves O2D by +1.2 min; CI +0.4 to +2.0."
              interpretation="Entire interval is above zero."
            />
            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-semibold text-slate-950">
                  Less conclusive example
                </h4>
                <p className="text-sm text-slate-500">
                  Interval crosses zero.
                </p>
              </div>
              <div className="mt-5">
                <div className="relative h-10">
                  <div className="absolute left-0 right-0 top-5 h-1 bg-slate-200" />
                  <div className="absolute left-[30%] top-3 h-5 w-px bg-slate-400" />
                  <div className="absolute left-[14%] top-5 h-1 w-[78%] bg-amber-500" />
                  <div className="absolute left-[58%] top-2 h-7 w-2 bg-amber-700" />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>-1 min</span>
                  <span>zero</span>
                  <span>+3.5 min</span>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                Treatment improves O2D by +1.2 min; CI -0.8 to +3.2.
              </p>
            </div>
            <div className="border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950">
              Practical first version: resample fleet-hour or fleet-day buckets,
              recompute the weighted effect many times, and use that bootstrap
              distribution as the CI.
            </div>
          </div>
        </div>
      </section>

      <section
        id="adjusted-regression"
        className="mx-auto max-w-7xl px-5 py-14 md:px-8 lg:px-10"
      >
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <ConceptHeader kicker="Adjusted Regression" title="Compare treatment within similar hours and conditions.">
            Adjusted regression estimates treatment after accounting for hour of
            day, day of week, load factor, and volume. Inside one fleet, no
            fleet adjustment is needed because there is only one fleet.
          </ConceptHeader>

          <div className="border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase text-slate-500">
                  Raw average
                </p>
                <p className="mt-3 text-sm text-slate-700">
                  Control: (20 + 21 + 40) / 3 = 27.0
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Treatment: (18 + 38 + 39) / 3 = 31.7
                </p>
                <p className="mt-4 text-2xl font-semibold text-rose-700">
                  +4.7 min worse
                </p>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase text-slate-500">
                  Adjusted comparison
                </p>
                <p className="mt-3 text-sm text-slate-700">
                  Quiet: treatment 18 vs control 20.5 = -2.5
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Peak: treatment 38.5 vs control 40 = -1.5
                </p>
                <p className="mt-4 text-2xl font-semibold text-emerald-700">
                  About -2 min better
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["Quiet hour", "20.5", "18", "-2.5 min"],
                ["Dinner peak", "40", "38.5", "-1.5 min"],
              ].map(([bucket, control, treatment, diff]) => (
                <div key={bucket} className="border border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">{bucket}</p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Control</span>
                        <span>{control}</span>
                      </div>
                      <div className="mt-1 h-3 bg-slate-200">
                        <div
                          className="h-3 bg-slate-500"
                          style={{ width: `${Number(control) * 2}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Treatment</span>
                        <span>{treatment}</span>
                      </div>
                      <div className="mt-1 h-3 bg-slate-200">
                        <div
                          className="h-3 bg-emerald-500"
                          style={{ width: `${Number(treatment) * 2}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 font-semibold text-emerald-700">{diff}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="mlm" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <ConceptHeader kicker="MLM" title="Borrow strength when fleet samples are uneven.">
            Multilevel models estimate overall and fleet-specific effects in one
            hierarchy. The main user-facing idea is partial pooling: tiny
            samples should not get the same trust as large samples.
          </ConceptHeader>

          <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="grid gap-3">
              {[
                ["Fleet A", "100 buckets", -2, -2],
                ["Fleet B", "100 buckets", -1, -1],
                ["Fleet C", "4 buckets", -8, -3],
                ["Fleet D", "4 buckets", 5, 0],
              ].map(([fleet, buckets, observed, mlm]) => {
                const observedNumber = Number(observed);
                const mlmNumber = Number(mlm);
                const observedLeft = 50 + observedNumber * 4;
                const mlmLeft = 50 + mlmNumber * 4;
                return (
                  <div key={fleet} className="border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-slate-950">{fleet}</p>
                      <p className="text-sm text-slate-500">{buckets}</p>
                    </div>
                    <div className="relative mt-4 h-9">
                      <div className="absolute left-0 right-0 top-4 h-1 bg-slate-200" />
                      <div className="absolute left-1/2 top-1 h-7 w-px bg-slate-400" />
                      <div
                        className="absolute top-2 h-5 w-5 border-2 border-rose-700 bg-rose-100"
                        style={{ left: `calc(${observedLeft}% - 10px)` }}
                        title={`Observed ${observed}`}
                      />
                      <div
                        className="absolute top-2 h-5 w-5 border-2 border-teal-700 bg-teal-100"
                        style={{ left: `calc(${mlmLeft}% - 10px)` }}
                        title={`MLM ${mlm}`}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-slate-500">
                      <span>-10 min</span>
                      <span>0</span>
                      <span>+10 min</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-700">
                      Observed {observed} min; MLM estimate maybe {mlm} min.
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 border-2 border-rose-700 bg-rose-100" />
                Observed effect
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 border-2 border-teal-700 bg-teal-100" />
                MLM estimate
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">
              Recommended Version
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
              Build trust in layers.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The first E2 version should stay practical: explain per-fleet
              results, weight by task volume, show uncertainty, and add
              adjustments where filters or slices leave imbalance.
            </p>
          </div>

          <ol className="grid gap-3 md:grid-cols-2">
            {flowSteps.map((step, index) => (
              <li
                key={step}
                className="flex gap-3 border border-slate-200 bg-white p-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-slate-950 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span className="text-sm leading-6 text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
