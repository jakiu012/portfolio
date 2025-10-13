---
slug: hovercraft
title: "Hovercraft Prototype & Competition"
subtitle: "Assembly, Testing, CFD"
dates: "2023"
location: "Ann Arbor, MI"
hero: "images/hovercraft_hero.png"
tags: ["CAD/CFD","Hardware","Testing"]
description: "Skirted hovercraft with internal and external flow modeling; raced across three timed courses."
---

## Overview
Skirted, radio-controlled hovercraft built to meet NASA-style constraints, then raced on straight-path, figure-8, and mass-retrieval courses. Final system mass **≈490.62 g** with total electrical **power ≈25 W**.

## Approach
- **Shape and sizing.** “Milano” shell for speed and maneuverability. Overall size ≈ **50 cm** front–back, **20 cm** side–side, **19.05 cm** tall including the vertical motor stand and prop. Inlet Ø **6.35 cm**; rear prop Ø **12.7 cm**; wall thickness ≈ **0.3 in**.
- **Structure and mounts.** Cardboard shell with a **3D-printed plastic motor mount** for stiffness and cable routing.
- **Controls.** RC transmitter to receiver to Arduino; **vectored thrust** via a servo-swiveled vertical motor mount. Because the uploaded program linked steering and motor value, we fixed thrust high during runs.
- **Skirt and plenum.** Skirt inflated by a plate-directed outlet; **rear edge left unconnected** to maximize lift after trials.
- **CFD.**
  - *Internal flow:* altitude **0.1 in**, inlet **2 m/s**; predicted **lift ≈ 4.22 N**.
  - *External flow:* wind-tunnel box, inlet **10 m/s**; **frontal area ≈ 0.0262 m²**, **Cᴅ ≈ 1.09**; higher drag at front edges and near the rear-prop region.

## Results & Outcomes
- **Mass:** **490.62 g** final bill of materials.
- **Power budget:** **25 W** total supply; motors ~**16 W** of that; margin ~**3 W**.
- **Testing, best trials:**
  - Straight path: **18.20 s**
  - Figure-8: **1:00.67**
  - Mass retrieval: **36 payloads** in 6 minutes
- **Competition day:** Straight path **20.19 s**; Figure-8 **DNF** after collision; Mass retrieval **18 payloads**.

## What I’d Improve Next
- Clean, strain-relieved wiring and connectors to survive bumps.
- **Decouple throttle from steering** and add closed-loop speed control for tighter turns and safer loading.
- Skirt seam durability and leakage tuning; smoother front edges to cut external drag.
- **High-altitude package (10 km):** aluminum or composite panels, anti-icing motors and heated shafts, protected electronics, and a higher-energy Li-ion pack for cold temps and lower pressure.

## Gallery
![Hovercraft](images/hovercraft_hero.png)
![Dimensions and layout](images/hovercraft_dims.png)
![Internal CFD](images/hovercraft_internal_cfd.png)
![External CFD](images/hovercraft_external_cfd.png)
![Course diagram](images/hovercraft_course.png)
