---
slug: hovercraft
title: "Hovercraft Prototype & Competition"
subtitle: "Assembly, Testing, CFD Analysis"
dates: "April 2023"
location: "Ann Arbor, MI"
hero: "images/hovercraft_hero.png"
tags: ["CAD/CFD", "Hardware", "Testing"]
description: "Skirted hovercraft designed for NASA-style constraints, featuring internal and external flow modeling in STAR-CCM+ and raced across three timed courses."
---

## Overview

Radio-controlled skirted hovercraft built as part of ENGR 100 to meet NASA-style mission constraints. The objective was to design, build, and test a low-altitude Earth prototype capable of traversing the FXB atrium, then adapt the design for a high-altitude (10 km) environment. The craft competed in three courses: straight-path speed, figure-8 maneuverability, and mass retrieval. Final system mass **490.62 g** (well under 800 g limit) with total electrical power **25 W**.

## Design Approach

### Shape & Sizing
- **Milano-shaped shell** optimized for speed and maneuverability—curved edges allow air to flow smoothly during propulsion.
- Overall dimensions: **50 cm × 20 cm × 19.05 cm** (length × width × height including vertical motor stand and propeller).
- Compact footprint enabled tight turns while keeping shell mass low.
- Inlet diameter: **6.35 cm**; rear propeller diameter: **12.7 cm**; wall thickness: **0.3 in**.

### Structure & Mounts
- Cardboard shell laser-cut and assembled with tape and hot glue.
- **3D-printed plastic motor mount** replaced cardboard version after repeated failures during air-puck competition—provided stiffness, durability, and integrated cable routing holes.
- Vertical motor stand positioned so propeller ends before the rear edge, protecting it from wall collisions and improving controllability by bringing thrust closer to center of mass.

### Controls & Electronics
- RC transmitter → receiver → Arduino microcontroller.
- **Vectored thrust** via servo-swiveled vertical motor mount for steering.
- Arduino program linked steering and motor speed (moving joystick left slowed motor; right sped it up). To simplify operation, motor value was fixed at high constant thrust during competition runs.
- 5 LEDs (2 W total) for visibility and status indication.

### Skirt & Plenum
- Internal plate with hole-punched perimeter directed airflow to inflate the canvas-like skirt.
- Through experimentation, found that **leaving the rear skirt edge unconnected** increased lift by allowing air to escape at the plenum edges rather than back through the inlet.
- Closing the inlet gap further increased lift by preventing airflow escape.

## Mass Budget

| Component                    | Qty | Mass (g) |
|-----------------------------|-----|----------|
| Shell (cardboard)            | 1   | 84.9     |
| Batteries (9V lithium)       | 3   | 78.9     |
| Payload capacity             | 3   | 71.99    |
| Motors                       | 2   | 44.7     |
| Motor controller board       | 1   | 35.6     |
| Arduino microcontroller      | 1   | 31.1     |
| Vertical motor stand w/servo | 1   | 30.8     |
| Wiring                       | —   | 20.0     |
| Glue and tape                | —   | 10.0     |
| Skirt                        | —   | 7.0      |
| Motor mount (3D-printed)     | 1   | 5.3      |
| **System mass total**        |     | **490.62** |

## Power Budget

| Component                   | Power (W) |
|----------------------------|-----------|
| Motors (2×)                 | 16        |
| LEDs (5×)                   | 2         |
| Motor controller board      | 1         |
| Arduino microcontroller     | 1         |
| Receiver                    | 1         |
| Servo                       | 1         |
| **Total consumed**          | **22**    |
| **Power margin**            | **3**     |
| **Total supply (3 batteries)** | **25**  |

## CFD Analysis (STAR-CCM+)

### Internal Flow Simulation
- **Parameters:** altitude 0.1 in, inlet velocity 2 m/s.
- **Result:** predicted lift **4.22 N**—sufficient to lift shell plus all components and payload.
- Visualization confirmed air escaping at plenum edges to inflate skirt; closing inlet gap reduced losses.

### External Flow Simulation
- Modeled hovercraft inside a virtual wind tunnel (boolean subtraction).
- **Parameters:** inlet velocity 10 m/s.
- **Frontal area:** 0.0262 m².
- **Drag coefficient (Cᴅ):** 1.09.
- High-drag regions identified at front shell edges and near the rear propeller—informed decision to remove rear wall and streamline front geometry where possible.

## Test Results & Competition Performance

### Pre-Competition Testing (Best Trials)
| Course          | Best Result      |
|----------------|------------------|
| Straight path   | **18.20 s**      |
| Figure-8        | **1:00.67**      |
| Mass retrieval  | **36 payloads** in 6 min |

### Competition Day
| Course          | Result           | Notes |
|----------------|------------------|-------|
| Straight path   | **20.19 s**      | Wider turn than practice |
| Figure-8        | **DNF**          | Collision with another craft caused wiring disconnect |
| Mass retrieval  | **18 payloads**  | Different rug layout required longer path |

Battery connection issues surfaced before the figure-8 run—adding a third battery caused the system to shut off intermittently.

## Lessons Learned & Future Improvements

### Immediate Fixes
- **Wiring reliability:** Implement strain-relieved connections and quick-disconnect connectors to survive collisions.
- **Decouple throttle from steering:** Reprogram Arduino to allow independent speed and direction control for tighter turns and safer payload loading.
- **Skirt durability:** Reinforce seams and tune leakage for consistent lift.
- **Aerodynamic refinement:** Smooth front edges to reduce external drag.

### High-Altitude Adaptation (10 km)

| Parameter     | Sea Level (0 km) | High Altitude (10 km) |
|--------------|------------------|----------------------|
| Temperature   | ~15°C            | ~−50°C               |
| Pressure      | 101.3 kPa        | ~26.5 kPa            |
| Air density   | 1.225 kg/m³      | ~0.41 kg/m³          |

**Proposed modifications:**
- **Shell material:** Replace cardboard with aluminum or composite panels for strength-to-weight ratio and UV/corrosion resistance.
- **Motors:** Anti-icing motors with heated shafts to prevent ice accumulation on propeller axles.
- **Electronics protection:** Insulated enclosures to shield microcontrollers and wiring from cold-induced failures.
- **Power supply:** Switch to lithium-ion batteries for higher energy density in cold, low-pressure conditions; alternatively add more batteries while managing mass.

## Gallery

![Hovercraft](images/hovercraft_hero.png)
![Dimensions and layout](images/hovercraft_dims.png)
![Internal CFD](images/hovercraft_internal_cfd.png)
![External CFD](images/hovercraft_external_cfd.png)
![Course diagram](images/hovercraft_course.png)