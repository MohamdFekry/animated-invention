const qs = (selector) => document.querySelector(selector);

const fmt = (value, digits = 1, sign = false) => {
  const rounded = Number(value).toFixed(digits);
  return sign && value > 0 ? `+${rounded}` : rounded;
};

const pct = (value) => `${Math.round(value * 10) / 10}%`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const scaleToPercent = (value, min, max) => {
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
};

const fleet = {
  controlMix: { alma: 38.8, kara: 35.3, mari: 25.9 },
  controlCpo: { alma: 1017, kara: 1006, mari: 1119 },
  treatmentCpo: { alma: 971, kara: 954, mari: 1073 },
};

function weighted(values, weights) {
  return (
    Object.keys(values).reduce((sum, key) => sum + values[key] * weights[key], 0) /
    Object.values(weights).reduce((sum, value) => sum + value, 0)
  );
}

function updateMix() {
  const karamaInput = qs("#mix-karama");
  const marinaInput = qs("#mix-marina");
  let kara = Number(karamaInput.value);
  let mari = Number(marinaInput.value);

  if (kara + mari > 90) {
    const active = document.activeElement;
    if (active === marinaInput) {
      kara = 90 - mari;
      karamaInput.value = kara;
    } else {
      mari = 90 - kara;
      marinaInput.value = mari;
    }
  }

  const alma = 100 - kara - mari;
  const treatmentMix = { alma, kara, mari };
  const control = weighted(fleet.controlCpo, fleet.controlMix);
  const treatment = weighted(fleet.treatmentCpo, treatmentMix);
  const diff = treatment - control;

  qs("#mix-control-cpo").textContent = fmt(control);
  qs("#mix-treatment-cpo").textContent = fmt(treatment);
  qs("#mix-diff").textContent = fmt(diff, 1, true);
  qs("#mix-karama-label").textContent = pct(kara);
  qs("#mix-marina-label").textContent = pct(mari);
  qs("#mix-alma-bar").style.width = `${alma}%`;
  qs("#mix-kara-bar").style.width = `${kara}%`;
  qs("#mix-mari-bar").style.width = `${mari}%`;
  qs("#mix-alma-bar").textContent = pct(alma);
  qs("#mix-kara-bar").textContent = pct(kara);
  qs("#mix-mari-bar").textContent = pct(mari);

  const note =
    mari > fleet.controlMix.mari + 8
      ? "Marina is now heavily overrepresented in treatment. The global improvement is being pulled upward by expensive volume."
      : mari < fleet.controlMix.mari - 4
        ? "Treatment now has less Marina than control, so the global result looks stronger than the fleet-level story alone."
        : "Treatment is still better inside every fleet. The global number changes because the fleet mix changes.";
  qs("#mix-note").textContent = note;
}

function updateWeights() {
  const smallTasks = Number(qs("#small-tasks").value);
  const smallMetric = Number(qs("#small-metric").value);
  const busyTasks = 500;
  const busyMetric = 20;
  const unweightedAverage = (smallMetric + busyMetric) / 2;
  const weightedAverage =
    (smallTasks * smallMetric + busyTasks * busyMetric) / (smallTasks + busyTasks);
  const gap = unweightedAverage - weightedAverage;

  qs("#small-tasks-label").textContent = smallTasks;
  qs("#small-metric-label").textContent = `${smallMetric} min`;
  qs("#small-bucket-text").textContent = `${smallTasks} tasks, ${smallMetric} min`;
  qs("#unweighted-average").textContent = fmt(unweightedAverage);
  qs("#weighted-average").textContent = fmt(weightedAverage);
  qs("#weight-gap").textContent = fmt(Math.abs(gap));

  const size = 14 + (smallTasks / busyTasks) * 86;
  qs("#small-bucket-size").style.height = `${size}px`;
  qs("#small-bucket-size").style.width = `${Math.max(20, size * 0.72)}px`;

  qs("#weight-note").textContent =
    smallTasks < 80
      ? "The small bucket has a loud metric but very little volume. Task weighting keeps it from dominating the business view."
      : smallTasks < 260
        ? "The small bucket is becoming meaningful. The weighted average starts moving toward the unweighted average."
        : "Both buckets now carry substantial volume, so weighted and unweighted views are closer.";
}

function updateCuped() {
  const controlActual = Number(qs("#cuped-control-actual").value);
  const treatmentActual = Number(qs("#cuped-treatment-actual").value);
  const controlBaseline = Number(qs("#cuped-control-baseline").value);
  const treatmentBaseline = Number(qs("#cuped-treatment-baseline").value);
  const raw = treatmentActual - controlActual;
  const controlResidual = controlActual - controlBaseline;
  const treatmentResidual = treatmentActual - treatmentBaseline;
  const effect = treatmentResidual - controlResidual;

  [
    ["#cuped-control-actual-label", controlActual],
    ["#cuped-control-actual-read", `${controlActual} min`],
    ["#cuped-treatment-actual-label", treatmentActual],
    ["#cuped-treatment-actual-read", `${treatmentActual} min`],
    ["#cuped-control-baseline-label", controlBaseline],
    ["#cuped-control-baseline-read", `${controlBaseline} min`],
    ["#cuped-treatment-baseline-label", treatmentBaseline],
    ["#cuped-treatment-baseline-read", `${treatmentBaseline} min`],
  ].forEach(([selector, value]) => {
    qs(selector).textContent = value;
  });

  qs("#cuped-control-actual-bar").style.width = `${scaleToPercent(controlActual, 15, 65)}%`;
  qs("#cuped-treatment-actual-bar").style.width = `${scaleToPercent(treatmentActual, 15, 65)}%`;
  qs("#cuped-raw").textContent = fmt(raw, 1, true);
  qs("#cuped-control-residual").textContent = fmt(controlResidual, 1, true);
  qs("#cuped-effect").textContent = fmt(effect, 1, true);

  qs("#cuped-note").textContent =
    raw > 0 && effect < 0
      ? "Raw says treatment is worse. CUPED says treatment beat its harder baseline."
      : effect < 0
        ? "After baseline adjustment, treatment looks better than control."
        : effect > 0
          ? "After baseline adjustment, treatment looks worse than control."
          : "After baseline adjustment, treatment and control look about equal.";
}

function updateCi() {
  const effect = Number(qs("#ci-effect").value);
  const buckets = Number(qs("#ci-buckets").value);
  const noise = Number(qs("#ci-noise").value);
  const halfWidth = 1.96 * (noise / Math.sqrt(buckets));
  const lower = effect - halfWidth;
  const upper = effect + halfWidth;
  const conclusive = lower > 0 || upper < 0;
  const min = -4;
  const max = 4;
  const left = scaleToPercent(lower, min, max);
  const right = scaleToPercent(upper, min, max);
  const dot = scaleToPercent(effect, min, max);

  qs("#ci-effect-label").textContent = fmt(effect, 1, true);
  qs("#ci-buckets-label").textContent = buckets;
  qs("#ci-noise-label").textContent = fmt(noise);
  qs("#ci-estimate-read").textContent = fmt(effect, 1, true);
  qs("#ci-range").textContent = `${fmt(lower, 1, true)} to ${fmt(upper, 1, true)}`;
  qs("#ci-status").textContent = conclusive ? "Conclusive" : "Crosses zero";
  qs("#ci-band").style.left = `${left}%`;
  qs("#ci-band").style.width = `${Math.max(2, right - left)}%`;
  qs("#ci-band").style.background = conclusive ? "var(--green)" : "var(--amber)";
  qs("#ci-dot").style.left = `calc(${dot}% - 12px)`;

  qs("#ci-note").textContent = conclusive
    ? "The interval stays on one side of zero, so the direction is easier to trust."
    : "The interval crosses zero, so the data still allows a no-effect story.";
}

function updateRegression() {
  const treatmentPeakShare = Number(qs("#reg-peak-share").value) / 100;
  const controlPeakShare = 1 / 3;
  const quietControl = 20.5;
  const peakControl = 40;
  const quietTreatment = 18;
  const peakTreatment = 38.5;
  const controlAverage = quietControl * (1 - controlPeakShare) + peakControl * controlPeakShare;
  const treatmentAverage =
    quietTreatment * (1 - treatmentPeakShare) + peakTreatment * treatmentPeakShare;
  const raw = treatmentAverage - controlAverage;
  const adjusted = ((quietTreatment - quietControl) + (peakTreatment - peakControl)) / 2;

  qs("#reg-peak-label").textContent = `${Math.round(treatmentPeakShare * 100)}%`;
  qs("#reg-control-avg").textContent = fmt(controlAverage);
  qs("#reg-treatment-avg").textContent = fmt(treatmentAverage);
  qs("#reg-raw").textContent = fmt(raw, 1, true);
  qs("#reg-adjusted").textContent = fmt(adjusted, 1, true);
  qs("#reg-control-bar").style.width = `${scaleToPercent(controlAverage, 15, 42)}%`;
  qs("#reg-treatment-bar").style.width = `${scaleToPercent(treatmentAverage, 15, 42)}%`;

  qs("#reg-note").textContent =
    raw > 0 && adjusted < 0
      ? "Treatment has more peak-hour buckets, so the raw average looks worse than the like-for-like comparison."
      : raw < 0
        ? "With this mix, raw and adjusted views both point toward treatment helping."
        : "The raw comparison is near neutral, but the adjusted view still checks performance within comparable hours.";
}

function updateMlm() {
  const buckets = Number(qs("#mlm-buckets").value);
  const observed = Number(qs("#mlm-effect").value);
  const overall = -1.5;
  const priorStrength = 10;
  const weight = buckets / (buckets + priorStrength);
  const pooled = weight * observed + (1 - weight) * overall;
  const shrinkage = Math.round((1 - weight) * 100);
  const min = -10;
  const max = 10;

  qs("#mlm-buckets-label").textContent = buckets;
  qs("#mlm-effect-label").textContent = `${fmt(observed, 1, true)} min`;
  qs("#mlm-observed-read").textContent = fmt(observed, 1, true);
  qs("#mlm-pooled-read").textContent = fmt(pooled, 1, true);
  qs("#mlm-shrinkage-read").textContent = `${shrinkage}%`;
  qs("#mlm-observed").style.left = `calc(${scaleToPercent(observed, min, max)}% - 12px)`;
  qs("#mlm-pooled").style.left = `calc(${scaleToPercent(pooled, min, max)}% - 12px)`;

  qs("#mlm-note").textContent =
    buckets < 12
      ? "With only a few buckets, the fleet estimate should be treated as suggestive, not definitive."
      : buckets < 60
        ? "There is enough data to listen to the fleet, but the model still borrows some strength from the overall effect."
        : "With many buckets, the pooled estimate mostly trusts the fleet's own observed effect.";
}

function resetValues(values) {
  Object.entries(values).forEach(([selector, value]) => {
    qs(selector).value = value;
  });
}

function init() {
  ["#mix-karama", "#mix-marina"].forEach((selector) => qs(selector).addEventListener("input", updateMix));
  ["#small-tasks", "#small-metric"].forEach((selector) => qs(selector).addEventListener("input", updateWeights));
  [
    "#cuped-control-actual",
    "#cuped-treatment-actual",
    "#cuped-control-baseline",
    "#cuped-treatment-baseline",
  ].forEach((selector) => qs(selector).addEventListener("input", updateCuped));
  ["#ci-effect", "#ci-buckets", "#ci-noise"].forEach((selector) => qs(selector).addEventListener("input", updateCi));
  qs("#reg-peak-share").addEventListener("input", updateRegression);
  ["#mlm-buckets", "#mlm-effect"].forEach((selector) => qs(selector).addEventListener("input", updateMlm));

  qs('[data-action="reset-mix"]').addEventListener("click", () => {
    resetValues({ "#mix-karama": 35.4, "#mix-marina": 30.9 });
    updateMix();
  });
  qs('[data-action="reset-weight"]').addEventListener("click", () => {
    resetValues({ "#small-tasks": 5, "#small-metric": 60 });
    updateWeights();
  });
  qs('[data-action="reset-cuped"]').addEventListener("click", () => {
    resetValues({
      "#cuped-control-actual": 23,
      "#cuped-treatment-actual": 41,
      "#cuped-control-baseline": 22,
      "#cuped-treatment-baseline": 42,
    });
    updateCuped();
  });
  qs('[data-action="reset-ci"]').addEventListener("click", () => {
    resetValues({ "#ci-effect": 1.2, "#ci-buckets": 100, "#ci-noise": 4 });
    updateCi();
  });
  qs('[data-action="reset-regression"]').addEventListener("click", () => {
    resetValues({ "#reg-peak-share": 67 });
    updateRegression();
  });
  qs('[data-action="reset-mlm"]').addEventListener("click", () => {
    resetValues({ "#mlm-buckets": 4, "#mlm-effect": -8 });
    updateMlm();
  });

  updateMix();
  updateWeights();
  updateCuped();
  updateCi();
  updateRegression();
  updateMlm();
}

document.addEventListener("DOMContentLoaded", init);
