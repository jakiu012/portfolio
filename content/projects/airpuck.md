---
slug: airpuck
title: "Air Puck Prototype for Titan"
subtitle: "Design, CFD Analysis, and Testing"
dates: "February 2023"
location: "Ann Arbor, MI"
hero: "images/airpuck_hero.png"
tags: ["CAD/CFD", "Hardware", "Testing"]
description: "Hexagonal air-puck optimized for fast traverse and payload capacity under strict power and mass constraints. Designed with CATIA, simulated in STAR-CCM+, and Arduino-controlled for potential Titan surface exploration."
---

## Overview

Designed and built an Earth prototype of a low-profile air puck for NASA's conceptual Titan surface exploration mission. The challenge: traverse a course in minimal time while maximizing payload capacity under strict constraints—total mass under 800 g, cardboard construction, one Arduino, one 9V battery, one motor controller, and one propeller. This project combined CAD design, CFD simulation, and iterative hardware testing to optimize lift, stability, and crossing time.

## Design Approach

**Geometry Selection:** After comparing lift values across multiple geometric configurations using both STAR-CCM+ simulations and Bernoulli's equation calculations, the hexagonal shape demonstrated superior lift performance. The hexagon also simplified laser-cut fabrication and provided flat mounting surfaces for electronics.

**Key Dimensions:**
- Base diameter: 14 in (point to point)
- Plenum diameter: 12 in
- Plenum height: 2.5 in
- Inlet diameter: 5 in
- Skirt gap (hover height): ~0.1 in

**Materials & Fabrication:** Laser-cut cardboard panels assembled with tape and hot glue. The flat plenum surface provided stable mounting for microcontrollers, motor mount, and battery, preventing mid-flight component separation. No draft angles or curves—intentionally simplified geometry for rapid rebuilds.

## Simulation & Analysis

**Tools:** CATIA for solid modeling and flat pattern generation; STAR-CCM+ for ground-effect CFD analysis.

**CFD Setup:**
- Inlet boundary at top aperture with velocity sweep up to 2 m/s
- Ground plane at bottom to simulate hover cushion effect
- Hover altitude fixed at 0.1 in
- Outlet defined at the skirt-to-ground gap

**Predicted Performance:**
- Lift: 1.41 N at 2 m/s inlet velocity
- Power consumption: 1.51 W

The CFD results guided skirt gap tuning, which proved critical for balancing payload capacity against crossing time.

## Testing & Results

**System Mass:** 269–329 g across builds (well under the 800 g limit)

**Bench Testing (Payload vs. Time):**

| Payload | Time |
|---------|------|
| 0 g | 6.68 s |
| 20 g | 7.73 s |
| 40 g | 7.13 s |
| 60 g | 15.78 s |

**Competition Results:**
- 60 g payload: 17.78 s ✓
- 80 g payload: 17.50 s ✓
- 100 g payload: Did not reach landing zone

The 80 g successful run with 17.50 s crossing time represented our best competition performance.

## Titan Adaptations

For deployment at 0 km altitude on Titan (95% N₂, ~5% CH₄ atmosphere, −179°C surface temperature):

- **Shell material:** Switch from cardboard to aluminum for increased density and structural integrity against Titan's atmospheric conditions
- **Electronics:** Insulate and harden all components for cryogenic operation
- **Propulsion:** Upsize motor to compensate for increased shell mass while maintaining required lift margins

## Lessons Learned

- Hexagonal geometry balanced aerodynamic performance with manufacturing simplicity
- Skirt gap tuning had outsized impact on payload capacity and stability
- Flat-surface design philosophy enabled rapid iteration during testing
- Weight distribution (electronics on top deck) affected flight stability

## What I'd Improve

- Implement skirt edge vortex control to reduce pressure leakage
- Add nozzle shaping at the outlet for improved lift efficiency
- Explore higher-efficiency duct or fan configurations
- Use lighter core materials to increase payload margin
- Optimize battery placement and wiring for better CG control

## Gallery

![Air Puck Hero](images/airpuck_hero.png)

![CFD Pressure Distribution](images/airpuck_cfd.png)

![CATIA Solid Model](images/airpuck_solidmodel.png)

![Testing Setup](images/airpuck_testing.png)