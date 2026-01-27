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

Radio-controlled skirted hovercraft built as part of ENGR 100 to meet NASA-style mission constraints.

> **Objective:** Design, build, and test a low-altitude Earth prototype capable of traversing the FXB atrium, then adapt the design for a high-altitude (10 km) environment.

The craft competed in three courses: straight-path speed, figure-8 maneuverability, and mass retrieval.

| Spec | Value |
|------|-------|
| System Mass | **490.62g** (well under 800g limit) |
| Electrical Power | **25W** total |

---

## Design Approach

### Shape & Sizing

- **Milano-shaped shell** optimized for speed and maneuverability - curved edges allow air to flow smoothly during propulsion
- Compact footprint enabled tight turns while keeping shell mass low

| Dimension | Value |
|-----------|-------|
| Length | 50 cm |
| Width | 20 cm |
| Height | 19.05 cm (including vertical motor stand and propeller) |
| Inlet diameter | 6.35 cm |
| Rear propeller diameter | 12.7 cm |
| Wall thickness | 0.3 in |

### Structure & Mounts

- Cardboard shell laser-cut and assembled with tape and hot glue
- **3D-printed plastic motor mount** replaced cardboard version after repeated failures during air-puck competition - provided stiffness, durability, and integrated cable routing holes
- Vertical motor stand positioned so propeller ends before the rear edge, protecting it from wall collisions and improving controllability

### Controls & Electronics

- RC transmitter to receiver to Arduino microcontroller
- **Vectored thrust** via servo-swiveled vertical motor mount for steering
- Arduino program linked steering and motor speed (moving joystick left slowed motor; right sped it up)
- 5 LEDs (2W total) for visibility and status indication

### Skirt & Plenum

- Internal plate with hole-punched perimeter directed airflow to inflate the canvas-like skirt
- **Key finding:** Leaving the rear skirt edge unconnected increased lift by allowing air to escape at the plenum edges rather than back through the inlet
- Closing the inlet gap further increased lift by preventing airflow escape

---

## Mass Budget

| Component | Qty | Mass (g) |
|-----------|-----|----------|
| Shell (cardboard) | 1 | 84.9 |
| Batteries (9V lithium) | 3 | 78.9 |
| Payload capacity | 3 | 71.99 |
| Motors | 2 | 44.7 |
| Motor controller board | 1 | 35.6 |
| Arduino microcontroller | 1 | 31.1 |
| Vertical motor stand w/servo | 1 | 30.8 |
| Wiring | - | 20.0 |
| Glue and tape | - | 10.0 |
| Skirt | - | 7.0 |
| Motor mount (3D-printed) | 1 | 5.3 |
| **System mass total** | | **490.62** |

---

## Power Budget

| Component | Power (W) |
|-----------|-----------|
| Motors (2x) | 16 |
| LEDs (5x) | 2 |
| Motor controller board | 1 |
| Arduino microcontroller | 1 |
| Receiver | 1 |
| Servo | 1 |
| **Total consumed** | **22** |
| **Power margin** | **3** |
| **Total supply (3 batteries)** | **25** |

---

## CFD Analysis (STAR-CCM+)

### Internal Flow Simulation

| Parameter | Value |
|-----------|-------|
| Altitude | 0.1 in |
| Inlet velocity | 2 m/s |
| **Predicted lift** | **4.22 N** |

> Sufficient to lift shell plus all components and payload. Visualization confirmed air escaping at plenum edges to inflate skirt; closing inlet gap reduced losses.

### External Flow Simulation

Modeled hovercraft inside a virtual wind tunnel (boolean subtraction).

| Parameter | Value |
|-----------|-------|
| Inlet velocity | 10 m/s |
| Frontal area | 0.0262 m2 |
| **Drag coefficient (Cd)** | **1.09** |

High-drag regions identified at front shell edges and near the rear propeller - informed decision to remove rear wall and streamline front geometry where possible.

---

## Test Results & Competition Performance

### Pre-Competition Testing (Best Trials)

| Course | Best Result |
|--------|-------------|
| Straight path | **18.20s** |
| Figure-8 | **1:00.67** |
| Mass retrieval | **36 payloads** in 6 min |

### Competition Day

| Course | Result | Notes |
|--------|--------|-------|
| Straight path | **20.19s** | Wider turn than practice |
| Figure-8 | **DNF** | Collision with another craft caused wiring disconnect |
| Mass retrieval | **18 payloads** | Different rug layout required longer path |

> Battery connection issues surfaced before the figure-8 run - adding a third battery caused the system to shut off intermittently.

---

## Lessons Learned & Future Improvements

### Immediate Fixes

- **Wiring reliability** - Implement strain-relieved connections and quick-disconnect connectors to survive collisions
- **Decouple throttle from steering** - Reprogram Arduino to allow independent speed and direction control for tighter turns and safer payload loading
- **Skirt durability** - Reinforce seams and tune leakage for consistent lift
- **Aerodynamic refinement** - Smooth front edges to reduce external drag

### High-Altitude Adaptation (10 km)

| Parameter | Sea Level (0 km) | High Altitude (10 km) |
|-----------|------------------|----------------------|
| Temperature | ~15 deg C | ~-50 deg C |
| Pressure | 101.3 kPa | ~26.5 kPa |
| Air density | 1.225 kg/m3 | ~0.41 kg/m3 |

**Proposed Modifications:**
- **Shell material** - Replace cardboard with aluminum or composite panels for strength-to-weight ratio and UV/corrosion resistance
- **Motors** - Anti-icing motors with heated shafts to prevent ice accumulation on propeller axles
- **Electronics protection** - Insulated enclosures to shield microcontrollers and wiring from cold-induced failures
- **Power supply** - Switch to lithium-ion batteries for higher energy density in cold, low-pressure conditions

---

## Gallery

![Hovercraft](images/hovercraft_hero.png)
![Dimensions and layout](images/hovercraft_dims.png)
![Internal CFD](images/hovercraft_internal_cfd.png)
![External CFD](images/hovercraft_external_cfd.png)
![Course diagram](images/hovercraft_course.png)
