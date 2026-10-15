// HUD, skill menus and character panels, isolated from the game loop.
(function(root){
 root.RSInterface={create(ctx){
  const {$,S,DB,SKILL_DEFS,SKILL_BY_ID,STAT_KEYS,BUFF_DEFS,totalStats,character,combatProfile,stageAllows,skillMenuVisible,skillIsEnabled,skillIsActive,skillAvailable,learnSkill,saveRun,activeBoss,types,cl,time,buildName,activeBuff,hunterContext}=ctx;
  function skillIcon(d) {
    return d.iconUrl
      ? '<img class="skill-art" src="' + d.iconUrl + '" alt="">'
      : d.icon;
  }
  function renderSkillToggleBox(box, onlyEnabled = false) {
    if (!box) return;
    const visible = (d) =>
      skillMenuVisible(d) && (!onlyEnabled || skillIsEnabled(d.id));
    let sig = SKILL_DEFS.filter(visible)
      .map(
        (d) =>
          d.id +
          ":" +
          (S[d.stateKey] || 0) +
          ":" +
          (skillIsEnabled(d.id) ? 1 : 0),
      )
      .join("|");
    if (box.dataset.signature === sig) return;
    box.dataset.signature = sig;
    box.innerHTML = "";
    let pool = SKILL_DEFS.filter(visible);
    if (!pool.length) {
      box.innerHTML = '<span class="muted">Активных навыков пока нет.</span>';
      return;
    }
    pool.forEach((d) => {
      let level = S[d.stateKey] || 0,
        active = skillIsActive(d),
        enabled = skillIsEnabled(d.id),
        b = document.createElement("button");
      b.type = "button";
      b.dataset.skillId = d.id;
      b.setAttribute("aria-pressed", String(enabled));
      b.className =
        "skill " +
        (active ? (enabled ? "skill-on" : "skill-off") : "skill-passive");
      b.title =
        d.name +
        " — " +
        d.description +
        " — " +
        (active
          ? enabled
            ? "Отключить автозапуск"
            : "Включить автозапуск"
          : d.description);
      b.innerHTML =
        '<span class="skill-icon">' +
        skillIcon(d) +
        '</span><span class="skill-info"><span class="skill-name">' +
        d.name +
        '</span><span class="skill-level">Lv ' +
        level +
        "/" +
        d.maxLevel +
        (active && !enabled ? '<em class="skill-state"> Off</em>' : "") +
        "</span></span>";
      if (active && level > 0)
        b.onclick = () => {
          S.skillEnabled[d.id] = !enabled;
          saveRun();
          renderActiveSkills();
          hud();
        };
      else b.disabled = true;
      box.appendChild(b);
    });
  }
  function renderActiveSkills() {
    renderSkillToggleBox($("skills"), true);
    renderSkillToggleBox($("pauseActiveSkills")?.querySelector(".skills"));
  }
  function renderSkillMenu() {
    let box = $("pauseCards"),
      scroll = document.querySelector(".pause-scroll"),
      position = scroll?.scrollTop || 0;
    $("pauseHint").textContent = S.skillPoints
      ? S.stage + " · доступно очков: " + S.skillPoints
      : "Нет свободных очков навыков";
    box.innerHTML = "";
    const recommended=RSCombatPolicy.next(S,SKILL_DEFS,skillAvailable);
    for (const d of SKILL_DEFS.filter(
      (d) => d.spendable !== false && stageAllows(d.jobId),
    )) {
      const current = S[d.stateKey] || 0,
        available = skillAvailable(d.id),
        b = document.createElement("button");
      b.className = "card"+(d.id===recommended?.id?" recommended":"");
      b.disabled = !available || S.skillPoints <= 0 || d.implemented === false;
      let reasons = d.requires
        .filter((r) => (S[SKILL_BY_ID[r.skillId].stateKey] || 0) < r.level)
        .map((r) => SKILL_BY_ID[r.skillId].name + " " + r.level)
        .join(", ");
      b.innerHTML =
        "<strong>" +
        skillIcon(d) +
        " " +
        d.name +
        "</strong><small>" +
        d.description +
        '<br><span class="skill-next">Текущий уровень: ' +
        current +
        "/" +
        d.maxLevel +
        "</span>" +
        (current<d.maxLevel?"<br>"+RSInsights.preview(d,current,S):"") +
        (d.id===recommended?.id?"<br>★ Следующий навык сборки":"") +
        (reasons ? "<br>Требуется: " + reasons : "") +
        (d.implemented === false ? "<br>Пока не реализован" : "") +
        "</small>";
      b.onclick = () => {
        learnSkill(d.id);
      };
      box.appendChild(b);
    }
    if (scroll) scroll.scrollTop = position;
  }
  function updateSkillIndicator() {
    let badge = $("skillBadge");
    if (!badge) return;
    badge.textContent = S.skillPoints;
    badge.classList.toggle("hide", S.skillPoints <= 0);
  }
  function updateSkillStatus() {
    document.querySelectorAll("button[data-skill-id]").forEach((b) => {
      const d = SKILL_BY_ID[b.dataset.skillId],
        remaining = Math.max(0, (S.cooldowns[d.id] || 0) - S.t),
        off = !skillIsEnabled(d.id),
        cost = d.spCosts?.[(S[d.stateKey] || 1)-1] ?? d.spCost,
        low = !S.debugInfiniteSp && S.sp < cost;
      let status = b.querySelector(".skill-status");
      if (!status) {
        status = document.createElement("span");
        status.className = "skill-status";
        b.querySelector(".skill-info").appendChild(status);
      }
      status.textContent=RSCombatPolicy.reason(hunterContext(),d)||'Готов';
      b.classList.toggle("skill-no-sp", !off && low);
      b.title = d.name + " · SP " + cost + " · " + d.description;
    });
  }
  function renderCharacterInfo() {
    const box = $("characterInfo");
    if (!box || !S.metrics) return;
    const q = totalStats(),
      rows = [
        ["Профессия", S.stage],
        ["Base / Job", S.lvl + " / " + S.job],
        ["ATK", S.atkMin + "–" + S.atkMax],
        ...(stageAllows('mage')?[["MATK",S.matk],["Каст",'DEX сокращает время · адаптация Survivor ×0,35']]:[]),
        ...(stageAllows('thief')?[["Оружие",S.stage==='Assassin'?(S.weaponStyle==='dual'?'Два кинжала':'Катар'):'Кинжал']]:[]),
        ["Защита", S.armor],
        ["Экипировка", S.gear.name],
        ["Бонус оружия", "+" + S.gear.weaponAtk + " ATK"],
        ["Бонус точности", "+" + S.gear.hit + " HIT"],
        ["Бонус брони", "+" + S.gear.defense + " DEF"],
        ["Верхом", S.stage === "Knight" && S.peco > 0 ? "Peco Peco" : "Нет"],
        ["Билд", buildName()],
        ["Базовая атака", combatProfile().kind==='bow'?'Лук · '+S.attackRange+' px':combatProfile().kind==='magic'?'Магическая искра · '+S.attackRange+' px':'Ближний бой'],
        ...(combatProfile().kind==='bow'?[["Стрелы", "Без ограничений · элемент по уязвимости"]]:[]),
        ["HIT / FLEE", S.hit + " / " + S.flee],
        ["Критический шанс", Math.round(S.crit * 100) + "%"],
        ["Интервал атаки", S.rate.toFixed(2) + " сек."],
        ...Object.entries(q).map(([k, v]) => [k.toUpperCase(), v]),
        ["Потрачено SP", Math.round(S.metrics.spSpent)],
        ["Получено урона", Math.round(S.metrics.taken)],
      ];
    box.innerHTML =
      "<dl>" +
      rows.map(([k, v]) => "<dt>" + k + "</dt><dd>" + v + "</dd>").join("") +
      "</dl><h3>Урон за забег</h3>" +
      Object.entries(S.metrics.damage)
        .map(
          ([id, v]) =>
            "<div>" +
            (SKILL_BY_ID[id]?.name || "Обычная атака") +
            ": " +
            Math.round(v) +
            "</div>",
        )
        .join("");
  }
  function hud() {
    const now = performance.now();
    if (S.run && !S.pause && now - (hud.last || 0) < 100) return;
    hud.last = now;
    $("level").textContent = S.lvl;
    $("jobLevel").textContent = S.job;
    $("job").textContent = S.stage;
    $("hpText").textContent = Math.ceil(Math.max(0, S.hp)) + "/" + S.max;
    $("spText").textContent = Math.ceil(S.sp) + "/" + S.spMax;
    $("hp").style.width = cl(S.hp / S.max, 0, 1) * 100 + "%";
    $("sp").style.width = cl(S.sp / S.spMax, 0, 1) * 100 + "%";
    $("time").textContent = time(S.t);
    $("kills").textContent = S.kills;
    const boss = activeBoss();
    $("bossHud").classList.toggle("hide", !boss);
    if (boss) {
      $("bossName").textContent = types[boss.type][0];
      $("bossHpText").textContent = Math.ceil(Math.max(0, boss.hp)) + "/" + boss.max;
      $("bossHp").style.width = cl(boss.hp / boss.max, 0, 1) * 100 + "%";
    }
    let legend = document.querySelector(".hud-side .legend");
    if (legend) legend.textContent = S.stage + " · Base 99 / Job 50";
    let q = totalStats();
    const statMarkup = STAT_KEYS.map(
      ([k, n]) =>
        '<div class="stat-cell"><span>' +
        n +
        " <em>" +
        q[k] +
        "</em></span></div>",
    ).join("");
    if($("statGrid").innerHTML!==statMarkup)$("statGrid").innerHTML=statMarkup;
    $("statPoints").textContent = buildName();
    $("skillPointsText").textContent = S.skillPoints;
    renderActiveSkills();
    updateSkillStatus();
    const buffMarkup = Object.keys(BUFF_DEFS)
      .filter((id) => activeBuff(id))
      .map((id) => {
        let d = BUFF_DEFS[id],
          left = Math.max(0, Math.ceil(S.buffs[id].expiresAt - S.t));
        return (
          '<div class="buff" title="' +
          d.skill +
          " " +
          d.level +
          " · " +
          left +
          ' сек."><span class="buff-icon-wrap"><span class="buff-fallback">' +
          (d.icon || "✦") +
          '</span><img class="buff-icon" src="' +
          (d.iconUrl || "") +
          '" alt="" onerror="this.classList.add(\'is-missing\')"></span><span class="buff-copy"><b>' +
          d.name +
          "</b><span>" +
          left +
          " сек.</span></span></div>"
        );
      })
      .join("");
    if($("buffs").innerHTML!==buffMarkup)$("buffs").innerHTML=buffMarkup;
    let states=$('classStatus');if(!states){states=document.createElement('div');states.id='classStatus';states.className='class-status';states.setAttribute('aria-label','Состояния персонажа');$('buffs').after(states);}
    const stateText=RSInsights.statuses(S).join(' · ');if(states.textContent!==stateText)states.textContent=stateText;
    updateSkillIndicator();
  }
 return {skillIcon,renderSkillToggleBox,renderActiveSkills,renderSkillMenu,updateSkillIndicator,updateSkillStatus,renderCharacterInfo,hud};
 }};
})(typeof window!=="undefined"?window:globalThis);
